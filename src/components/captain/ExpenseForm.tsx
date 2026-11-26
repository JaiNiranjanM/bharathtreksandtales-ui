"use client";

import { useState } from "react";
import { Camera, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/admin/fields";
import { EXPENSE_CATEGORIES, type ExpenseCategory, type ExpenseView } from "@/lib/captain/core";
import { MAX_BILLS_PER_EXPENSE } from "@/lib/captain/schemas";
import { api, compressBill, todayInIndia } from "@/lib/captain/client";

/** Add a new expense, or fix a pending / rejected one. Bills are photos or PDFs. */
export function ExpenseForm({
  batchId,
  initial,
  onDone,
  onCancel,
}: {
  batchId: string;
  initial?: ExpenseView;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? "transport");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ?? todayInIndia());
  const [kept, setKept] = useState(initial?.bills ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const total = kept.length + files.length;

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, MAX_BILLS_PER_EXPENSE - kept.length));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return setError("Enter the amount you spent.");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("data", JSON.stringify({ category, description, amount: value, date }));
      for (const f of await Promise.all(files.map(compressBill))) form.append("bills", f);
      if (initial) {
        form.append("keep", JSON.stringify(kept.map((b) => b.path)));
        await api(`/api/captain/batches/${batchId}/expenses/${initial.id}`, "PUT", form);
      } else {
        await api(`/api/captain/batches/${batchId}/expenses`, "POST", form);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the expense");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-royal/30 bg-surface p-5">
      <h3 className="font-heading text-lg font-bold">{initial ? "Edit expense" : "Add an expense"}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="What was it for?">
          <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)} className={inputClass}>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount spent (₹)">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Details" hint="For example: Tempo traveller diesel, Hosur to Kollimalai">
        <input required minLength={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Date of expense">
        <input type="date" required max={todayInIndia()} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </Field>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Bill (photo or PDF)</p>
        <ul className="mt-2 space-y-1.5">
          {kept.map((b) => (
            <li key={b.path} className="flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-2 text-sm">
              <Paperclip size={14} className="shrink-0 opacity-60" />
              <span className="flex-1 truncate">{b.name}</span>
              <button type="button" onClick={() => setKept(kept.filter((x) => x.path !== b.path))} aria-label="Remove bill" className="opacity-60 hover:opacity-100 cursor-pointer">
                <X size={15} />
              </button>
            </li>
          ))}
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-2 text-sm">
              <Paperclip size={14} className="shrink-0 opacity-60" />
              <span className="flex-1 truncate">{f.name}</span>
              <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove bill" className="opacity-60 hover:opacity-100 cursor-pointer">
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
        {total < MAX_BILLS_PER_EXPENSE && (
          <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-foreground/25 px-4 py-2.5 text-sm font-medium hover:bg-foreground/5">
            <Camera size={16} /> Take photo or choose file
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
        <p className="mt-1.5 text-xs opacity-50">Up to {MAX_BILLS_PER_EXPENSE} bills. No bill? Add the details above and BTT will decide.</p>
      </div>

      {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />} {initial ? "Save and send again" : "Submit expense"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
