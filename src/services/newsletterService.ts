import { BASE_URL } from "./api";

export interface NewsletterResult {
  message: string;
  alreadySubscribed: boolean;
}

export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
  const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Subscription failed. Please try again.");
  }

  return {
    message: json.message,
    alreadySubscribed: json.alreadySubscribed ?? false,
  };
}
