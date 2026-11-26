"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Loader2, LogIn } from "lucide-react";
import { clientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";

export default function CaptainLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(clientAuth(), email.trim(), password);
      const res = await fetch("/api/captain/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await cred.user.getIdToken() }),
      });
      if (!res.ok) {
        await signOut(clientAuth());
        throw new Error((await res.json()).error ?? "Sign-in failed");
      }
      router.replace("/captain");
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "Incorrect email or password."
          : code === "auth/user-disabled"
          ? "This account has been switched off. Please contact BTT."
          : err instanceof Error
          ? err.message
          : "Sign-in failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function forgot() {
    setError("");
    setInfo("");
    if (!email.trim()) return setError("Enter your email above first.");
    try {
      await sendPasswordResetEmail(clientAuth(), email.trim());
    } catch {
      /* Show the same message either way so the form doesn't reveal which emails exist. */
    }
    setInfo("If this email belongs to a captain, a password reset link has been sent to it.");
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-surface-muted px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-surface p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image src="/btt_logo_icon.png" alt="" width={40} height={57} className="h-12 w-auto" />
          <h1 className="mt-4 font-heading text-2xl font-bold">Captain Login</h1>
          <p className="mt-1 text-sm opacity-60">Bharath Treks &amp; Tales trip captains</p>
        </div>

        {!isFirebaseClientConfigured && (
          <p className="mt-6 rounded-lg bg-saffron/10 p-3 text-xs text-saffron">
            Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local.
          </p>
        )}

        <label className="mt-6 block text-xs font-semibold uppercase tracking-wide opacity-60">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2.5 text-sm focus:border-royal-light focus:outline-none"
        />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide opacity-60">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2.5 text-sm focus:border-royal-light focus:outline-none"
        />

        {error && <p className="mt-4 text-sm text-saffron">{error}</p>}
        {info && <p className="mt-4 text-sm text-forest-light">{info}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Sign in
        </Button>
        <button type="button" onClick={forgot} className="mt-3 w-full cursor-pointer text-center text-xs opacity-60 hover:opacity-100">
          Forgot password?
        </button>
      </form>
    </main>
  );
}
