import "server-only";
import { prettyDate } from "./captain/core";

/** What the admin is told when someone registers. */
export interface RegistrationAlert {
  source: "website" | "link";
  tripTitle: string;
  /** First day of the batch, YYYY-MM-DD */
  date: string;
  count: number;
  contactName: string;
  ref: string;
  /** Seats still free afterwards; null when there is no limit. */
  seatsLeft: number | null;
  /** Where the admin confirms them. */
  adminUrl: string;
}

export type ChannelResult = "sent" | "skipped" | "failed";

type Env = Record<string, string | undefined>;

/** One line, plain text. WhatsApp templates do not allow line breaks in a variable. */
export function registrationMessage(a: RegistrationAlert) {
  const what = a.source === "website" ? "booking" : "registration";
  const people = `${a.count} ${a.count === 1 ? "traveller" : "travellers"}`;
  const seats =
    a.seatsLeft === null ? "" : a.seatsLeft === 0 ? " The date is now full." : ` ${a.seatsLeft} ${a.seatsLeft === 1 ? "seat" : "seats"} left.`;
  return `New ${what} for ${a.tripTitle} (${prettyDate(a.date)}): ${people} from ${a.contactName}. Ref ${a.ref}.${seats} Confirm here: ${a.adminUrl}`
    .replace(/\s+/g, " ")
    .trim();
}

async function sendEmail(text: string, subject: string, env: Env, fetchImpl: typeof fetch): Promise<ChannelResult> {
  const key = env.RESEND_API_KEY;
  const to = env.ALERT_EMAIL_TO || env.ADMIN_EMAIL;
  if (!key || !to) return "skipped";
  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Resend's own test sender works until you verify a domain; it can only email your Resend account address.
        from: env.ALERT_EMAIL_FROM || "BTT Alerts <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Resend answered ${res.status}`);
    return "sent";
  } catch (err) {
    console.error("Email alert failed", err);
    return "failed";
  }
}

async function sendWhatsApp(text: string, env: Env, fetchImpl: typeof fetch): Promise<ChannelResult> {
  const token = env.WHATSAPP_CLOUD_TOKEN;
  const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
  const to = (env.WHATSAPP_ALERT_TO ?? "").replace(/\D/g, "");
  const template = env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneId || !to || !template) return "skipped";
  try {
    const res = await fetchImpl(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: env.WHATSAPP_TEMPLATE_LANG || "en" },
          components: [{ type: "body", parameters: [{ type: "text", text }] }],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`WhatsApp answered ${res.status}`);
    return "sent";
  } catch (err) {
    console.error("WhatsApp alert failed", err);
    return "failed";
  }
}

/**
 * Tells the admin about a new booking or registration by email and/or WhatsApp, whichever is set up.
 * It never throws: a failed alert must not affect the person who just registered.
 */
export async function notifyRegistration(
  alert: RegistrationAlert,
  opts: { env?: Env; fetchImpl?: typeof fetch } = {}
): Promise<{ email: ChannelResult; whatsapp: ChannelResult }> {
  const env = opts.env ?? process.env;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const text = registrationMessage(alert);
  const subject = `New ${alert.source === "website" ? "booking" : "registration"}: ${alert.tripTitle} (${prettyDate(alert.date)})`;
  const [email, whatsapp] = await Promise.all([
    sendEmail(text, subject, env, fetchImpl),
    sendWhatsApp(text, env, fetchImpl),
  ]);
  return { email, whatsapp };
}
