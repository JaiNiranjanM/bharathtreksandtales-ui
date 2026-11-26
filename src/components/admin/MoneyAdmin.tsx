"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "@/components/captain/ExpenseItem";
import { MoneySummaryCard } from "@/components/captain/MoneySummaryCard";
import {
  PAYMENT_METHODS,
  prettyDate,
  summarizeMoney,
  type AdvanceDoc,
  type ExpenseView,
  type SettlementDoc,
} from "@/lib/captain/core";
import { api, todayInIndia } from "@/lib/captain/client";
import { formatINR } from "@/lib/utils";
import { Field, Section, inputClass } from "./fields";

/** Advances given, expense claims to review, and settlement payments for one batch. */
export function MoneyAdmin({
  batchId,
  advances,
  expenses,
  settlements,
}: {
  batchId: string;
  advances: AdvanceDoc[];
  expenses: ExpenseView[];
  settlements: SettlementDoc[];
}) {
  const router = useRouter();
  const url = `/api/admin/batches/${batchId}/money`;
  const money = useMemo(() => summarizeMoney(advances, expenses, settlements), [advances, expenses, settlements]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(body: Record<string, unknown>) {
    setError("");
    setBusy(true);
    try {
      await api(url, "POST", body);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const pending = expenses.filter((e) => e.status === "pending");

  return (
    <div className="space-y-6">
      <Section title="Money summary" description="Advance given to the captain, minus the expenses you approve, plus or minus any settlement payment.">
        <MoneySummaryCard money={money} />
      </Section>

      {error && <p className="rounded-xl bg-saffron/10 p-4 text-sm text-saffron">{error}</p>}

      <Section title="Advance given to the captain" description="Cash or transfers BTT gave the captain to run the trip.">
        <AdvanceForm busy={busy} onAdd={(advance) => run({ action: "addAdvance", advance })} />
        <MoneyRows
          rows={advances.map((a) => ({
            id: a.id,
            date: a.date,
            label: `${PAYMENT_METHODS.find((m) => m.id === a.method)?.label ?? a.method}${a.note ? ` · ${a.note}` : ""}`,
            amount: a.amount,
          }))}
          empty="No advance recorded yet."
          onDelete={(id) => confirm("Remove this advance?") && run({ action: "deleteAdvance", id })}
        />
      </Section>

      <Section
        title={`Expense claims (${expenses.length})`}
        description={pending.length ? `${pending.length} waiting for your review.` : "Approve or reject each claim. You can approve less than the full amount."}
      >
        {expenses.length === 0 ? (
          <p className="text-sm opacity-60">The captain has not submitted any expenses yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((e) => (
              <ExpenseItem key={e.id} expense={e}>
                <Decision expense={e} busy={busy} onDecide={(decision) => run({ action: "decide", expenseId: e.id, decision })} />
              </ExpenseItem>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Settlement payments" description="Cash the captain handed back, or money BTT paid the captain, after the trip.">
        <SettlementForm key={money.outstanding} busy={busy} outstanding={money.outstanding} onAdd={(settlement) => run({ action: "addSettlement", settlement })} />
        <MoneyRows
          rows={settlements.map((s) => ({
            id: s.id,
            date: s.date,
            label: `${s.direction === "captain_to_btt" ? "Captain returned cash to BTT" : "BTT paid the captain"}${s.note ? ` · ${s.note}` : ""}`,
            amount: s.amount,
          }))}
          empty="No settlement payment recorded."
          onDelete={(id) => confirm("Remove this payment?") && run({ action: "deleteSettlement", id })}
        />
      </Section>
    </div>
  );
}

function MoneyRows({
  rows,
  empty,
  onDelete,
}: {
  rows: { id: string; date: string; label: string; amount: number }[];
  empty: string;
  onDelete: (id: string) => void;
}) {
  if (rows.length === 0) return <p className="text-sm opacity-60">{empty}</p>;
  return (
    <ul className="divide-y divide-foreground/10 rounded-xl border border-foreground/10">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <span>
            <span className="opacity-60">{prettyDate(r.date)}</span> · {r.label}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-semibold tabular-nums">{formatINR(r.amount)}</span>
            <button onClick={() => onDelete(r.id)} aria-label="Remove" className="rounded-md p-1.5 opacity-50 hover:bg-foreground/5 hover:opacity-100 cursor-pointer">
              <Trash2 size={14} />
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}

function AdvanceForm({ busy, onAdd }: { busy: boolean; onAdd: (a: Record<string, unknown>) => Promise<boolean> }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayInIndia());
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (await onAdd({ amount: Number(amount), date, method, note })) {
          setAmount("");
          setNote("");
        }
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] sm:items-end"
    >
      <Field label="Amount (₹)">
        <input required type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Date">
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </Field>
      <Field label="How">
        <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
          {PAYMENT_METHODS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Note (optional)">
        <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </Field>
      <Button type="submit" size="sm" disabled={busy}>
        <Plus size={14} /> Add
      </Button>
    </form>
  );
}

function SettlementForm({
  busy,
  outstanding,
  onAdd,
}: {
  busy: boolean;
  outstanding: number;
  onAdd: (s: Record<string, unknown>) => Promise<boolean>;
}) {
  const [direction, setDirection] = useState<"captain_to_btt" | "btt_to_captain">(outstanding < 0 ? "btt_to_captain" : "captain_to_btt");
  const [amount, setAmount] = useState(Math.abs(outstanding) > 0.005 ? String(Math.abs(outstanding)) : "");
  const [date, setDate] = useState(todayInIndia());
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (await onAdd({ direction, amount: Number(amount), date, note })) {
          setAmount("");
          setNote("");
        }
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_2fr_auto] sm:items-end"
    >
      <Field label="Who paid">
        <select value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} className={inputClass}>
          <option value="captain_to_btt">Captain returned cash to BTT</option>
          <option value="btt_to_captain">BTT paid the captain</option>
        </select>
      </Field>
      <Field label="Amount (₹)">
        <input required type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Date">
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Note (optional)">
        <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </Field>
      <Button type="submit" size="sm" disabled={busy}>
        <Plus size={14} /> Add
      </Button>
    </form>
  );
}

/** Approve (full or part) or reject one claim. Decided claims can be changed. */
function Decision({
  expense,
  busy,
  onDecide,
}: {
  expense: ExpenseView;
  busy: boolean;
  onDecide: (d: Record<string, unknown>) => Promise<boolean>;
}) {
  const decided = expense.status !== "pending";
  const [open, setOpen] = useState(!decided);
  const [approved, setApproved] = useState(String(expense.approvedAmount ?? expense.amount));
  const [note, setNote] = useState(expense.adminNote);
  const [working, setWorking] = useState<"approved" | "rejected" | null>(null);

  async function decide(decision: "approved" | "rejected") {
    setWorking(decision);
    const ok = await onDecide(
      decision === "approved"
        ? { decision, approvedAmount: Number(approved), adminNote: note }
        : { decision, adminNote: note }
    );
    setWorking(null);
    if (ok) setOpen(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-royal-light hover:underline cursor-pointer">
        Change decision
      </button>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr] sm:items-end">
      <Field label="Amount to approve (₹)">
        <input type="number" min="0" step="0.01" max={expense.amount} value={approved} onChange={(e) => setApproved(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Note to the captain (needed to reject)">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Bill unclear, please resend" className={inputClass} />
      </Field>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button size="sm" disabled={busy} onClick={() => decide("approved")}>
          {working === "approved" ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
        </Button>
        <Button size="sm" variant="outline" className="text-red-500" disabled={busy} onClick={() => decide("rejected")}>
          {working === "rejected" ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />} Reject
        </Button>
        {decided && (
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
