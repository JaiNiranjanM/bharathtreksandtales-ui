"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock, Pencil, Phone, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACCESS_LABEL,
  prettyDate,
  summarizeMoney,
  suggestedAccessDate,
  type AccessState,
  type AdvanceDoc,
  type BatchDoc,
  type ExpenseView,
  type SettlementDoc,
  type TravellerDoc,
} from "@/lib/captain/core";
import { api, telHref } from "@/lib/captain/client";
import { cn, formatINR } from "@/lib/utils";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseItem } from "./ExpenseItem";
import { MoneySummaryCard } from "./MoneySummaryCard";

type Tab = "travellers" | "expenses" | "summary";

export function CaptainBatchView({
  batch,
  state,
  canTravellers,
  canExpenses,
  travellers,
  expenses,
  advances,
  settlements,
  uid,
}: {
  batch: BatchDoc;
  state: AccessState;
  canTravellers: boolean;
  canExpenses: boolean;
  travellers: TravellerDoc[];
  expenses: ExpenseView[];
  advances: AdvanceDoc[];
  settlements: SettlementDoc[];
  uid: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(state === "not_granted" ? "summary" : "travellers");
  const money = useMemo(() => summarizeMoney(advances, expenses, settlements), [advances, expenses, settlements]);

  const tabs: [Tab, string][] = [
    ["travellers", `Travellers${canTravellers ? ` (${travellers.length})` : ""}`],
    ["expenses", `Expenses (${expenses.length})`],
    ["summary", "Money summary"],
  ];

  return (
    <div>
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5">
        <h1 className="font-heading text-2xl font-bold">{batch.tripTitle}</h1>
        <p className="mt-1 text-sm opacity-70">
          {prettyDate(batch.startDate)}
          {batch.endDate !== batch.startDate && ` to ${prettyDate(batch.endDate)}`}
          {batch.location && ` · ${batch.location}`}
        </p>
        <span
          className={cn(
            "mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold",
            state === "open" ? "bg-forest-light/15 text-forest-light" : "bg-foreground/10"
          )}
        >
          {ACCESS_LABEL[state]}
        </span>
        {batch.notes && <p className="mt-3 text-sm opacity-80">{batch.notes}</p>}
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-foreground/10">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "shrink-0 cursor-pointer border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id ? "border-saffron text-saffron" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "travellers" && (
          <TravellersTab batch={batch} state={state} canTravellers={canTravellers} travellers={travellers} />
        )}
        {tab === "expenses" && (
          <ExpensesTab
            batchId={batch.id}
            state={state}
            canExpenses={canExpenses}
            expenses={expenses}
            uid={uid}
            onChanged={() => router.refresh()}
          />
        )}
        {tab === "summary" && (
          <div className="space-y-6">
            <MoneySummaryCard money={money} />
            <MoneyList title="Advances from BTT" empty="No advance has been recorded yet." items={advances.map((a) => ({ id: a.id, date: a.date, label: `${a.method.toUpperCase()}${a.note ? ` · ${a.note}` : ""}`, amount: a.amount }))} />
            <MoneyList
              title="Settlement payments"
              empty="No settlement payment yet."
              items={settlements.map((s) => ({
                id: s.id,
                date: s.date,
                label: `${s.direction === "captain_to_btt" ? "You returned cash to BTT" : "BTT paid you"}${s.note ? ` · ${s.note}` : ""}`,
                amount: s.amount,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MoneyList({ title, empty, items }: { title: string; empty: string; items: { id: string; date: string; label: string; amount: number }[] }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-bold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm opacity-60">{empty}</p>
      ) : (
        <ul className="mt-2 divide-y divide-foreground/10 rounded-xl border border-foreground/10 bg-surface">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                <span className="opacity-60">{prettyDate(i.date)}</span> · {i.label}
              </span>
              <span className="font-semibold tabular-nums">{formatINR(i.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Notice({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-surface p-5 text-sm">
      <span className="mt-0.5 shrink-0 opacity-60">{icon}</span>
      <div className="opacity-80">{children}</div>
    </div>
  );
}

function TravellersTab({
  batch,
  state,
  canTravellers,
  travellers,
}: {
  batch: BatchDoc;
  state: AccessState;
  canTravellers: boolean;
  travellers: TravellerDoc[];
}) {
  const [query, setQuery] = useState("");
  const [pickup, setPickup] = useState("all");

  if (!canTravellers) {
    return (
      <Notice icon={<Lock size={18} />}>
        {state === "not_granted" ? (
          <>
            BTT has not opened traveller details for this trip yet. They are usually shared a few days before departure
            (around {prettyDate(suggestedAccessDate(batch))}).
          </>
        ) : state === "settled" ? (
          <>This trip has been settled, so traveller details are no longer available.</>
        ) : (
          <>Traveller details are locked now that the trip is over. You can still add expenses until BTT settles the trip.</>
        )}
      </Notice>
    );
  }

  const pickups = Array.from(new Set(travellers.map((t) => t.pickupPoint).filter(Boolean))).sort();
  const q = query.trim().toLowerCase();
  const shown = travellers.filter(
    (t) =>
      (pickup === "all" || t.pickupPoint === pickup) &&
      (!q || t.name.toLowerCase().includes(q) || t.phone.includes(q))
  );

  return (
    <div>
      <p className="mb-4 flex items-start gap-2 rounded-xl bg-saffron/10 p-3 text-xs text-saffron">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        This is private traveller information shared only for this trip. Please do not copy, forward or keep it after the trip.
      </p>
      {travellers.length === 0 ? (
        <p className="text-sm opacity-60">BTT has not added any travellers to this trip yet.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2">
              <Search size={15} className="opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or phone"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            {pickups.length > 1 && (
              <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="rounded-lg border border-foreground/15 bg-transparent px-3 py-2 text-sm">
                <option value="all">All pickup points ({travellers.length})</option>
                {pickups.map((p) => (
                  <option key={p} value={p}>
                    {p} ({travellers.filter((t) => t.pickupPoint === p).length})
                  </option>
                ))}
              </select>
            )}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {shown.map((t) => (
              <li key={t.id} className="rounded-xl border border-foreground/10 bg-surface p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs opacity-60">{[t.age !== null ? `${t.age} yrs` : "", t.gender].filter(Boolean).join(" · ")}</p>
                </div>
                {t.pickupPoint && <p className="mt-1 text-xs opacity-70">Pickup: {t.pickupPoint}</p>}
                {t.phone && (
                  <a href={telHref(t.phone)} className="mt-2 flex w-fit items-center gap-1.5 text-royal-light hover:underline">
                    <Phone size={14} /> {t.phone}
                  </a>
                )}
                {(t.emergencyName || t.emergencyPhone) && (
                  <p className="mt-2 text-xs">
                    <span className="opacity-60">Emergency contact:</span> {t.emergencyName}{" "}
                    {t.emergencyPhone && (
                      <a href={telHref(t.emergencyPhone)} className="text-royal-light hover:underline">
                        {t.emergencyPhone}
                      </a>
                    )}
                  </p>
                )}
                {t.medicalNotes && (
                  <p className="mt-2 rounded-lg bg-saffron/10 px-3 py-2 text-xs text-saffron">
                    <span className="font-semibold">Medical:</span> {t.medicalNotes}
                  </p>
                )}
                {t.notes && <p className="mt-2 text-xs opacity-70">Note: {t.notes}</p>}
              </li>
            ))}
          </ul>
          {shown.length === 0 && <p className="mt-4 text-sm opacity-60">No travellers match.</p>}
        </>
      )}
    </div>
  );
}

function ExpensesTab({
  batchId,
  state,
  canExpenses,
  expenses,
  uid,
  onChanged,
}: {
  batchId: string;
  state: AccessState;
  canExpenses: boolean;
  expenses: ExpenseView[];
  uid: string;
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ExpenseView | null>(null);
  const [error, setError] = useState("");

  async function remove(e: ExpenseView) {
    if (!confirm(`Delete "${e.description}" (${formatINR(e.amount)})?`)) return;
    setError("");
    try {
      await api(`/api/captain/batches/${batchId}/expenses/${e.id}`, "DELETE");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div className="space-y-4">
      {!canExpenses ? (
        <Notice icon={<Lock size={18} />}>
          {state === "settled"
            ? "This trip has been settled, so expenses can no longer be changed."
            : "BTT has not opened this trip yet. You will be able to add expenses once access is given."}
        </Notice>
      ) : adding || editing ? (
        <ExpenseForm
          key={editing?.id ?? "new"}
          batchId={batchId}
          initial={editing ?? undefined}
          onCancel={() => {
            setAdding(false);
            setEditing(null);
          }}
          onDone={() => {
            setAdding(false);
            setEditing(null);
            onChanged();
          }}
        />
      ) : (
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} /> Add expense
        </Button>
      )}
      {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}

      {expenses.length === 0 ? (
        <p className="text-sm opacity-60">No expenses yet.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((e) => {
            const mine = e.submittedBy === uid;
            const editable = canExpenses && mine && e.status !== "approved";
            return (
              <ExpenseItem key={e.id} expense={e}>
                {editable && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setAdding(false); setEditing(e); }}>
                      <Pencil size={13} /> {e.status === "rejected" ? "Fix and resubmit" : "Edit"}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-saffron" onClick={() => remove(e)}>
                      <Trash2 size={13} /> Delete
                    </Button>
                  </div>
                )}
              </ExpenseItem>
            );
          })}
        </ul>
      )}
    </div>
  );
}
