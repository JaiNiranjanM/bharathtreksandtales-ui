"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/services/newsletterService";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const result = await subscribeNewsletter(email.trim());
      setStatus({
        type: result.alreadySubscribed ? "info" : "success",
        message: result.message,
      });
      if (!result.alreadySubscribed) {
        setEmail("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not subscribe. Please try again later.";
      setStatus({
        type: "error",
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal via-royal to-forest px-8 py-14 text-center text-white sm:px-16"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
        <h2 className="relative font-heading text-2xl font-bold sm:text-3xl">
          Get the next trip in your inbox
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-sm text-white/75">
          Early access to new treks, temple yatras and weekend deals — no spam, just journeys.
        </p>

        {status && status.type === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-white/15 px-6 py-4 text-sm font-medium text-white backdrop-blur-xs"
          >
            <CheckCircle2 size={18} className="text-gold" />
            <span>{status.message}</span>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full rounded-full bg-white/10 px-5 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Button
              type="submit"
              variant="saffron"
              disabled={isLoading || !email.trim()}
              className="shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Subscribing...
                </>
              ) : (
                <>
                  Subscribe <Send size={14} />
                </>
              )}
            </Button>
          </form>
        )}

        {status && status.type !== "success" && (
          <p
            className={`mt-3 text-xs ${
              status.type === "info" ? "text-gold" : "text-rose-300"
            }`}
          >
            {status.message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
