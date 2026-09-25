"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/services/authService";

function ResetContent() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await resetPassword(token.trim(), password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
        <h1 className="font-heading text-3xl font-bold text-[#14181f]">Reset Password</h1>
        <p className="mt-2 text-sm text-[#14181f]/60">Paste your reset token and choose a new password.</p>

        {done ? (
          <div className="mt-6 text-center">
            <CheckCircle2 size={36} className="mx-auto text-green-600" />
            <p className="mt-3 text-sm text-[#14181f]/70">Password reset successful.</p>
            <Link href="/login" className="mt-4 inline-block font-medium text-[#ea580c]">Sign in →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="rp-token" className="mb-1.5 block text-sm font-medium text-[#14181f]">Reset Token</label>
              <input id="rp-token" type="text" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token from email / server log"
                className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-3 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
            </div>
            <div>
              <label htmlFor="rp-pass" className="mb-1.5 block text-sm font-medium text-[#14181f]">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
                <input id="rp-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
              </div>
            </div>
            <div>
              <label htmlFor="rp-confirm" className="mb-1.5 block text-sm font-medium text-[#14181f]">Confirm Password</label>
              <input id="rp-confirm" type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password"
                className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-3 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white px-4">
      <Suspense fallback={null}>
        <ResetContent />
      </Suspense>
    </div>
  );
}
