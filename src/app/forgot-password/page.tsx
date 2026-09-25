"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
          <h1 className="font-heading text-3xl font-bold text-[#14181f]">Forgot Password</h1>
          <p className="mt-2 text-sm text-[#14181f]/60">
            Enter your account email and we&apos;ll send a reset link (check the server log for the token in dev).
          </p>

          {sent ? (
            <div className="mt-6 text-center">
              <CheckCircle2 size={36} className="mx-auto text-green-600" />
              <p className="mt-3 text-sm text-[#14181f]/70">
                If that email exists, a reset link has been sent. Then{" "}
                <Link href="/reset-password" className="font-medium text-[#ea580c] hover:underline">set a new password</Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-[#14181f]">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                  <input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
                </div>
              </div>
              {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#14181f]/50">
            <Link href="/login" className="font-medium text-[#ea580c]">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
