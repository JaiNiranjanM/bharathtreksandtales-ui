/** Bharath Treks & Tales public contact details. */
export const CONTACT_PHONE_E164 = "+918148703335";
export const CONTACT_PHONE_DISPLAY = "+91 81487 03335";
/** wa.me wants the number without "+" or spaces. */
export const WHATSAPP_NUMBER = "918148703335";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
