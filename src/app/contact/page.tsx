"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { submitContact } = await import("@/services/contactService");
      await submitContact({ name, email, message });
      setSent(true);
      setName(""); setEmail(""); setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 max-w-lg text-sm text-foreground/60">
            Have a question, suggestion or want to plan a custom trip? We&apos;d love to hear from you.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
                <h2 className="font-heading text-lg font-bold">Reach Us</h2>
                <div className="mt-4 space-y-3 text-sm text-foreground/70">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-royal-light" />
                    The Executive Zone, Shakti Tower-1, No.766,<br />Anna Salai, Chennai - 600002
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} className="text-royal-light" />
                    +91 99440 48889 / +91 88077 50608
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-royal-light" />
                    support@bharathtreksandtales.com
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
                <h2 className="font-heading text-lg font-bold">Office Hours</h2>
                <p className="mt-3 text-sm text-foreground/70">
                  Monday – Saturday: 10:00 AM – 7:00 PM<br />
                  Sunday: Closed (emergency bookings via WhatsApp)
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
              <h2 className="font-heading text-lg font-bold">Send a Message</h2>
              {sent ? (
                <div className="mt-6 space-y-3">
                  <div className="rounded-xl bg-forest/10 p-4 text-center text-sm text-forest-light">
                    Thank you! We&apos;ll get back to you within 24 hours.
                  </div>
                  <button onClick={() => setSent(false)} className="text-sm text-royal hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:border-saffron/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:border-saffron/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-msg" className="mb-1 block text-sm font-medium">Message</label>
                    <textarea
                      id="contact-msg"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full resize-none rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:border-saffron/60"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-saffron/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-saffron/35 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
