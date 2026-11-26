import { NextResponse } from "next/server";
import { registrationOpen } from "@/lib/captain/core";
import { fail, zodMessage } from "@/lib/captain/http";
import { clientIp, rateLimited } from "@/lib/captain/rateLimit";
import { RegistrationError, registerTravellers } from "@/lib/captain/registration";
import { joinSubmitSchema } from "@/lib/captain/schemas";
import { getBatchByJoinToken } from "@/lib/captain/store";
import { isFirebaseConfigured } from "@/lib/firebase/admin";

/** Someone fills in their details through a batch's registration link. Saved as pending until BTT confirms. */
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (rateLimited(`join:${clientIp(request)}`, 12, 60 * 60 * 1000)) {
    return fail("Too many attempts. Please try again in a while.", 429);
  }

  const raw = await request.json().catch(() => null);
  // A bot filled the hidden field: pretend it worked and save nothing.
  if (raw && typeof raw === "object" && "website" in raw && raw.website) return NextResponse.json({ ref: "000000" });

  const parsed = joinSubmitSchema.safeParse(raw);
  if (!parsed.success) return fail(zodMessage(parsed.error));

  // Malformed and bot submissions were turned away above without touching the database.
  if (!isFirebaseConfigured()) return fail("Registration is not available right now. Please contact BTT.", 503);
  const { token } = await params;
  const batch = await getBatchByJoinToken(token);
  if (!batch || !registrationOpen(batch)) return fail("This registration link is closed. Please contact BTT.", 410);

  const first = parsed.data.travellers[0];
  try {
    const result = await registerTravellers(batch.id, {
      source: "link",
      contact: { name: first.name, phone: first.phone, email: "" },
      travellers: parsed.data.travellers,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof RegistrationError) return fail(err.message, 409);
    console.error("Registration failed", err);
    return fail("Could not save your details. Please try again.", 500);
  }
}
