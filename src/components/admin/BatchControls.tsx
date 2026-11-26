"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, LockOpen, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACCESS_LABEL,
  DETAILS_LOCK_DAYS,
  SUGGESTED_ACCESS_DAYS_BEFORE,
  addDays,
  prettyDate,
  suggestedAccessDate,
  type AccessState,
  type BatchDoc,
} from "@/lib/captain/core";
import { api } from "@/lib/captain/client";
import { cn } from "@/lib/utils";
import { Section } from "./fields";

const when = (ms: number) => new Date(ms).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

/** Give or take back captain access, settle the trip, or delete it. */
export function BatchControls({
  batch,
  state,
  pendingClaims,
}: {
  batch: BatchDoc;
  state: AccessState;
  pendingClaims: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function run(action: string, body: Record<string, unknown>) {
    setError("");
    setBusy(action);
    try {
      await api(`/api/admin/batches/${batch.id}`, "POST", { action, ...body });
      if (action === "delete") router.push("/admin/batches");
      else router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function settle() {
    const note = prompt("Add a closing note for the record (optional). Press OK to settle the trip.", "");
    if (note === null) return;
    setError("");
    setBusy("markSettled");
    try {
      await api(`/api/admin/batches/${batch.id}`, "POST", { action: "markSettled", note });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      // The only error the admin can choose to override is "money does not balance".
      if (message.startsWith("The money does not balance") && confirm(`${message}\n\nClose the trip anyway?`)) {
        try {
          await api(`/api/admin/batches/${batch.id}`, "POST", { action: "markSettled", note, acceptUnbalanced: true });
        } catch (err2) {
          setError(err2 instanceof Error ? err2.message : "Something went wrong");
        }
      } else {
        setError(message);
      }
    } finally {
      setBusy(null);
      router.refresh();
    }
  }

  function remove() {
    const typed = prompt("This deletes the batch, its travellers, expenses and bill files for good.\nType DELETE to confirm.");
    if (typed === "DELETE") run("delete", {});
  }

  return (
    <Section title="Captain access & settlement">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", state === "open" ? "bg-forest-light/15 text-forest-light" : "bg-foreground/10")}>
          {ACCESS_LABEL[state]}
        </span>
        {batch.accessGrantedAt && state !== "settled" && <span className="text-xs opacity-60">Access given {when(batch.accessGrantedAt)}</span>}
        {batch.settledAt && <span className="text-xs opacity-60">Settled {when(batch.settledAt)}</span>}
      </div>

      {state === "not_granted" && (
        <div className="space-y-3 text-sm">
          <p className="opacity-80">
            Captains cannot see this trip&apos;s traveller details or add expenses yet. Usually you give access about{" "}
            {SUGGESTED_ACCESS_DAYS_BEFORE} days before departure (around <strong>{prettyDate(suggestedAccessDate(batch))}</strong>).
          </p>
          <Button onClick={() => run("grantAccess", {})} disabled={busy !== null}>
            {busy === "grantAccess" ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Give captains access now
          </Button>
        </div>
      )}

      {(state === "open" || state === "details_locked") && (
        <div className="space-y-3 text-sm">
          <p className="opacity-80">
            {state === "open" ? (
              <>
                Captains can see traveller details and add expenses. Traveller details lock on{" "}
                <strong>{prettyDate(addDays(batch.endDate, DETAILS_LOCK_DAYS))}</strong> ({DETAILS_LOCK_DAYS} days after the trip), or as soon as you settle it.
              </>
            ) : (
              <>Traveller details are now locked. Captains can still add expenses until you settle the trip.</>
            )}
          </p>
          <Button variant="outline" onClick={() => run("revokeAccess", {})} disabled={busy !== null}>
            {busy === "revokeAccess" ? <Loader2 size={16} className="animate-spin" /> : <LockOpen size={16} />} Take access back
          </Button>
        </div>
      )}

      <div className="border-t border-foreground/10 pt-4">
        {state === "settled" ? (
          <div className="space-y-3 text-sm">
            <p className="opacity-80">
              This trip is settled. Captains can no longer see traveller details or change expenses.
              {batch.settleNote && <> Closing note: &ldquo;{batch.settleNote}&rdquo;</>}
            </p>
            <Button variant="outline" onClick={() => run("reopen", {})} disabled={busy !== null}>
              {busy === "reopen" ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />} Reopen
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="opacity-80">
              When the money is squared up, mark the trip as settled. This closes expense upload and traveller access for the captains.
              {pendingClaims > 0 && <span className="text-saffron"> {pendingClaims} claim{pendingClaims === 1 ? " is" : "s are"} still waiting for your review.</span>}
            </p>
            <Button variant="saffron" onClick={settle} disabled={busy !== null || !batch.accessGrantedAt}>
              {busy === "markSettled" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Mark trip as settled
            </Button>
            {!batch.accessGrantedAt && <p className="text-xs opacity-50">Give captains access first; there is nothing to settle before that.</p>}
          </div>
        )}
      </div>

      {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}

      <div className="border-t border-foreground/10 pt-4">
        <Button variant="ghost" className="text-saffron" onClick={remove} disabled={busy !== null}>
          <Trash2 size={15} /> Delete this batch
        </Button>
      </div>
    </Section>
  );
}
