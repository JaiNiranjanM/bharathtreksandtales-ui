"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/services/authService";
import { useAppStore } from "@/lib/store";

function VerifyContent() {
  const params = useSearchParams();
  const updateUser = useAppStore((s) => s.updateUser);
  const [token, setToken] = useState(params.get("token") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const updated = await verifyEmail(token.trim());
      updateUser(updated);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
        <h1 className="font-heading text-3xl font-bold text-[#14181f]">Verify Email</h1>
        <p className="mt-2 text-sm text-[#14181f]/60">Paste the verification token sent to your new email address.</p>
        {done ? (
          <div className="mt-6 text-center">
            <CheckCircle2 size={36} className="mx-auto text-green-600" />
            <p className="mt-3 text-sm text-[#14181f]/70">Email verified and updated.</p>
            <Link href="/profile" className="mt-4 inline-block font-medium text-[#ea580c]">Back to profile →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <input type="text" required value={token} onChange={(e) => setToken(e.target.value)} placeholder="Verification token"
              className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] px-4 py-3 text-sm text-[#14181f] outline-none focus:border-[#ea580c]/60" />
            {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify Email"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white px-4">
      <Suspense fallback={null}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
