"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Loader2, Plus, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaptainDoc } from "@/lib/captain/core";
import { api } from "@/lib/captain/client";
import { cn } from "@/lib/utils";
import { Field, Section, inputClass } from "./fields";

export function CaptainsManager({ captains }: { captains: CaptainDoc[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [link, setLink] = useState<{ name: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy("create");
    try {
      const res = await api<{ resetLink: string }>("/api/admin/captains", "POST", { name, email, phone });
      setLink({ name, url: res.resetLink });
      setName("");
      setEmail("");
      setPhone("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the captain");
    } finally {
      setBusy(null);
    }
  }

  async function act(c: CaptainDoc, action: "resetLink" | "deactivate" | "activate") {
    if (action === "deactivate" && !confirm(`Switch off ${c.name}'s login? They will be signed out straight away.`)) return;
    setError("");
    setBusy(`${action}-${c.uid}`);
    try {
      const res = await api<{ resetLink?: string }>(`/api/admin/captains/${c.uid}`, "POST", { action });
      if (res.resetLink) setLink({ name: c.name, url: res.resetLink });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const loginUrl = typeof window === "undefined" ? "/captain/login" : `${window.location.origin}/captain/login`;

  return (
    <div className="space-y-6">
      {link && (
        <div className="rounded-2xl border border-forest-light/40 bg-forest-light/10 p-5">
          <p className="font-medium">Password link for {link.name}</p>
          <p className="mt-1 text-sm opacity-80">
            Send this link to the captain. They open it, choose a password, and then sign in at{" "}
            <span className="font-medium">{loginUrl}</span>. The link only works for them, once.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input readOnly value={link.url} onFocus={(e) => e.currentTarget.select()} className={cn(inputClass, "flex-1 font-mono text-xs")} />
            <Button type="button" variant="outline" size="sm" onClick={() => copy(link.url)}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hi ${link.name}, you are a trip captain with Bharath Treks & Tales. Set your password here: ${link.url}\nThen sign in at ${loginUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}

      <Section title="Add a captain" description="Creates a login. The captain sets their own password from a link you send them.">
        <form onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name">
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email (their login)">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Phone (optional)">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </Field>
          </div>
          {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}
          <Button type="submit" disabled={busy === "create"}>
            {busy === "create" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create captain
          </Button>
        </form>
      </Section>

      <Section title={`Captains (${captains.length})`}>
        {captains.length === 0 ? (
          <p className="text-sm opacity-60">No captains yet.</p>
        ) : (
          <ul className="divide-y divide-foreground/10">
            {captains.map((c) => (
              <li key={c.uid} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    {c.name}
                    {!c.active && <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]">Switched off</span>}
                  </p>
                  <p className="text-xs opacity-60">{[c.email, c.phone].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex gap-2">
                  {c.active && (
                    <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => act(c, "resetLink")}>
                      {busy === `resetLink-${c.uid}` ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />} New password link
                    </Button>
                  )}
                  {c.active ? (
                    <Button size="sm" variant="ghost" className="text-saffron" disabled={busy !== null} onClick={() => act(c, "deactivate")}>
                      <UserX size={13} /> Switch off
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled={busy !== null} onClick={() => act(c, "activate")}>
                      <UserCheck size={13} /> Switch on
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
