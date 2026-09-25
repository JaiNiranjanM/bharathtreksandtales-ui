"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/authService";
import { useAppStore } from "@/lib/store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAppStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      setAuth(res.user, res.token);
      // Cookie mirror so src/middleware.ts can guard /profile + /dashboard
      document.cookie = `btt_token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-xl shadow-black/5 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-[#14181f]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#14181f]/60">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#14181f]">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#14181f]">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#14181f]/40" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#14181f]/10 bg-[#f6f5f2] py-3 pl-10 pr-4 text-sm text-[#14181f] outline-none transition-colors focus:border-[#ea580c]/60"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-medium text-[#ea580c] hover:text-[#f97316]">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="saffron"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#14181f]/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#ea580c] hover:text-[#f97316]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div data-theme="light" className="flex min-h-screen items-center justify-center bg-white px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
