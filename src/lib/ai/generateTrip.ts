import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import mammoth from "mammoth";
import { adminBucket } from "../firebase/admin";
import { aiTripSchema, type AiTrip, type UploadedFileRef } from "../trip-schema";

const MODEL = "claude-sonnet-5-5";
// Server-side fallback: if a request is declined, the API retries it on a fallback model.
const BETAS = ["server-side-fallback-2026-07-01"];

type ContentBlock = Anthropic.Beta.BetaContentBlockParam;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

/** Turns the admin's uploaded files + pasted text into Claude content blocks. */
async function buildItineraryBlocks(
  files: UploadedFileRef[],
  pastedText: string
): Promise<ContentBlock[]> {
  const blocks: ContentBlock[] = [];
  const bucket = adminBucket();

  for (const file of files) {
    const [buffer] = await bucket.file(file.path).download();
    const type = file.contentType.toLowerCase();
    const name = file.name.toLowerCase();

    if (type === "application/pdf" || name.endsWith(".pdf")) {
      blocks.push({
        type: "document",
        title: file.name,
        source: { type: "base64", media_type: "application/pdf", data: buffer.toString("base64") },
      });
    } else if ((IMAGE_TYPES as readonly string[]).includes(type)) {
      blocks.push({
        type: "image",
        source: { type: "base64", media_type: type as ImageType, data: buffer.toString("base64") },
      });
    } else if (
      name.endsWith(".docx") ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({ buffer });
      blocks.push({ type: "text", text: `<itinerary_document name="${file.name}">\n${value}\n</itinerary_document>` });
    } else if (type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
      blocks.push({ type: "text", text: `<itinerary_document name="${file.name}">\n${buffer.toString("utf8")}\n</itinerary_document>` });
    } else {
      throw new Error(`Unsupported file type for "${file.name}" (${file.contentType}). Use PDF, Word, image or text.`);
    }
  }

  if (pastedText.trim()) {
    blocks.push({ type: "text", text: `<itinerary_text>\n${pastedText.trim()}\n</itinerary_text>` });
  }
  if (blocks.length === 0) throw new Error("No itinerary provided. Upload a file or paste the itinerary text.");
  return blocks;
}

function textOf(content: Anthropic.Beta.BetaContentBlock[]) {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

function assertNotRefused(message: Anthropic.Beta.BetaMessage, step: string) {
  if (message.stop_reason === "refusal") {
    throw new Error(`The AI declined the ${step} step. Try editing the itinerary text and generate again.`);
  }
}

const RESEARCH_SYSTEM = `You are the destination researcher for Bharath Treks & Tales, an Indian travel company that runs treks, temple pilgrimages, one day trips and weekend getaways.

You will be given a trip itinerary. Identify the destination(s) and use web search to gather accurate, current facts that a traveller would want on the trip page:
- exact location, district and state
- summit / maximum altitude, trek distance and typical trekking time
- difficulty and fitness required
- typical weather and temperatures in the trip's season, and the best months to go
- temples, viewpoints, waterfalls and other attractions on or near the route
- entry fees, forest department permits, timings, and any current restrictions or closures
- safety considerations (leeches, slippery trails, wildlife, crowds, network coverage)

Prefer official sources (forest departments, temple boards, state tourism) and reputable trekking sites. Write concise research notes as bullet points grouped by topic, and finish with a "Sources" list of the page titles and URLs you relied on. If something cannot be verified, say so rather than guessing.`;

/** Step 1: research the destination on the web. Returns notes as plain text. */
async function researchDestination(client: Anthropic, itinerary: ContentBlock[], notes: string) {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: [
        ...itinerary,
        {
          type: "text",
          text: `Research the destination of the trip in the itinerary above.${notes ? `\n\nNotes from the organiser: ${notes}` : ""}`,
        },
      ],
    },
  ];

  // A long server-side search turn can pause; send it back so the server continues it.
  for (let i = 0; i < 5; i++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: BETAS,
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: RESEARCH_SYSTEM,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8, user_location: { type: "approximate", country: "IN" } }],
      messages,
    });
    const message = await stream.finalMessage();
    assertNotRefused(message, "research");
    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content });
      continue;
    }
    return textOf(message.content);
  }
  throw new Error("Web research did not finish. Please try again.");
}

const EXTRACT_SYSTEM = `You turn a trip itinerary into the structured content of a trip page for Bharath Treks & Tales.

Rules:
- The organiser's itinerary is the source of truth for schedule, pickup points, meals, transport, inclusions, exclusions, prices and dates. Never contradict it.
- Use the research notes only to fill facts the itinerary does not state (altitude, distance, weather, best season, temples, safety). Never invent prices, dates, phone numbers or availability.
- If a fact is unknown after both sources, write a short honest value such as "Varies" rather than making one up; leave lists empty when there is nothing to add.
- Write in clear, warm Indian English. Keep highlights and list items short (under ~12 words each).
- Build the day-by-day itinerary from the organiser's schedule: one entry per day, in order, each with a short title and a 1-3 sentence description. A single-day trip has one entry. Put timed activities in that day's schedule only when the itinerary gives times; otherwise leave the schedule empty.
- Only list sources that appear in the research notes.`;

/** Step 2: extract the page fields as validated JSON. */
async function extractTrip(
  client: Anthropic,
  itinerary: ContentBlock[],
  research: string,
  notes: string
): Promise<AiTrip> {
  const message = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: BETAS,
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(aiTripSchema) },
    system: EXTRACT_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          ...itinerary,
          {
            type: "text",
            text: [
              research ? `<research_notes>\n${research}\n</research_notes>` : "No web research is available.",
              notes ? `<organiser_notes>\n${notes}\n</organiser_notes>` : "",
              "Produce the trip page content for this itinerary.",
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
        ],
      },
    ],
  });
  assertNotRefused(message, "page generation");
  if (message.stop_reason === "max_tokens" || !message.parsed_output) {
    throw new Error("The AI response was incomplete. Please try again.");
  }
  return message.parsed_output;
}

export async function generateTripFromItinerary(input: {
  files: UploadedFileRef[];
  pastedText: string;
  notes: string;
  research: boolean;
}): Promise<AiTrip> {
  const client = new Anthropic();
  const itinerary = await buildItineraryBlocks(input.files, input.pastedText);

  let research = "";
  if (input.research) {
    try {
      research = await researchDestination(client, itinerary, input.notes);
    } catch (err) {
      // Research is a bonus; still build the page from the itinerary alone.
      console.error("Trip research failed, continuing without it", err);
    }
  }
  return extractTrip(client, itinerary, research, input.notes);
}
