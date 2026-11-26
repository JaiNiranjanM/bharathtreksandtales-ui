"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Link2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prettyDate, registrationOpen, type BatchDoc } from "@/lib/captain/core";
import { api } from "@/lib/captain/client";
import { cn } from "@/lib/utils";
import { Section } from "./fields";

/** The link BTT shares so travellers can fill in their own details. It is tied to this batch (this trip and date). */
export function BatchJoinLink({ batch, origin }: { batch: BatchDoc; origin: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function run(action: string, body: Record<string, unknown> = {}) {
    setError("");
    setBusy(action);
    try {
      await api(`/api/admin/batches/${batch.id}`, "POST", { action, ...body });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  const link = batch.joinToken ? `${origin}/join/${batch.joinToken}` : "";
  const accepting = registrationOpen(batch);
  const tripOver = Boolean(batch.joinToken) && batch.joinOpen && !accepting;

  async function copy() {
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Section
      title="Registration link"
      description="Share this link and people fill in their own details. It is tied to this trip and date, so you always know who it is for. They appear below as Pending until you confirm them."
    >
      {!batch.joinToken ? (
        <Button onClick={() => run("createJoinLink")} disabled={busy !== null}>
          {busy === "createJoinLink" ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />} Create registration link
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", accepting ? "bg-forest-light/15 text-forest-light" : "bg-foreground/10")}>
              {accepting ? "Accepting registrations" : tripOver ? "Closed (the trip is over)" : "Closed"}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="w-full flex-1 rounded-lg border border-foreground/15 bg-transparent px-3 py-2 font-mono text-xs focus:outline-none" />
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hi! Please fill in your details for ${batch.tripTitle} (${prettyDate(batch.startDate)}) here: ${link}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" disabled={busy !== null} onClick={() => run("setJoinOpen", { open: !batch.joinOpen })}>
              {busy === "setJoinOpen" && <Loader2 size={13} className="animate-spin" />}
              {batch.joinOpen ? "Stop accepting registrations" : "Accept registrations again"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={busy !== null}
              onClick={() => confirm("Make a new link? The old link stops working straight away, so share the new one.") && run("rotateJoinLink")}
            >
              {busy === "rotateJoinLink" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Make a new link
            </Button>
          </div>
        </div>
      )}
      {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}
    </Section>
  );
}
