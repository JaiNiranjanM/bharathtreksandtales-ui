"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCheck, Download, FileUp, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOURCE_LABEL, type TravellerDoc } from "@/lib/captain/core";
import { api } from "@/lib/captain/client";
import { CSV_TEMPLATE, travellersFromCsv, type CsvImportResult } from "@/lib/captain/csv";
import { cn } from "@/lib/utils";
import { Field, Section, inputClass } from "./fields";

const EMPTY = { name: "", phone: "", age: "", gender: "", pickupPoint: "", emergencyName: "", emergencyPhone: "", medicalNotes: "", notes: "" };
type Values = typeof EMPTY;

const toPayload = (v: Values) => ({
  ...v,
  age: v.age.trim() === "" ? null : Number(v.age),
});

/** The traveller list for a batch: add, edit, delete, or import from a CSV file. */
export function TravellersAdmin({ batchId, travellers }: { batchId: string; travellers: TravellerDoc[] }) {
  const router = useRouter();
  const url = `/api/admin/batches/${batchId}/travellers`;
  const [editing, setEditing] = useState<{ id?: string; values: Values } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pending = travellers.filter((t) => t.status === "pending");

  const [csvText, setCsvText] = useState("");
  const [csv, setCsv] = useState<CsvImportResult | null>(null);
  const [showImport, setShowImport] = useState(false);

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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const ok = await run(
      editing.id
        ? { action: "update", id: editing.id, traveller: toPayload(editing.values) }
        : { action: "add", traveller: toPayload(editing.values) }
    );
    if (ok) setEditing(null);
  }

  async function remove(t: TravellerDoc) {
    if (confirm(`Remove ${t.name} from this trip?`)) await run({ action: "delete", id: t.id });
  }

  function readCsv(text: string) {
    setCsvText(text);
    setCsv(text.trim() ? travellersFromCsv(text) : null);
  }

  async function importCsv() {
    if (!csv || csv.rows.length === 0) return;
    if (await run({ action: "import", rows: csv.rows })) {
      setCsv(null);
      setCsvText("");
      setShowImport(false);
    }
  }

  function downloadTemplate() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: "text/csv" }));
    a.download = "travellers-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((cur) => (cur ? { ...cur, values: { ...cur.values, [key]: e.target.value } } : cur));

  return (
    <Section
      title={`Travellers (${travellers.length})`}
      description="Add them yourself, import a file, or let them register through a booking or your registration link. Captains see only Confirmed travellers, and only while their access is open. Medical notes are shown to captains too."
    >
      {pending.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-saffron/10 p-4 text-sm">
          <p className="text-saffron">
            <strong>{pending.length}</strong> {pending.length === 1 ? "person has" : "people have"} registered and {pending.length === 1 ? "is" : "are"} waiting for you to confirm.
          </p>
          <Button size="sm" disabled={busy} onClick={() => confirm(`Confirm all ${pending.length} pending travellers?`) && run({ action: "confirmAll" })}>
            <CheckCheck size={14} /> Confirm all
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setEditing({ values: EMPTY })} disabled={busy}>
          <Plus size={14} /> Add traveller
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowImport((v) => !v)}>
          <FileUp size={14} /> Import from CSV
        </Button>
      </div>

      {showImport && (
        <div className="space-y-3 rounded-xl border border-foreground/10 p-4">
          <p className="text-sm opacity-80">
            Paste rows from Excel or Google Sheets, or choose a CSV file (in Excel: File, Save As, CSV). The first row must be headers, with at least a{" "}
            <strong>Name</strong> column.
          </p>
          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2 text-xs font-medium hover:bg-foreground/5">
              <FileUp size={14} /> Choose file
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) readCsv(await f.text());
                  e.target.value = "";
                }}
              />
            </label>
            <Button size="sm" variant="ghost" onClick={downloadTemplate}>
              <Download size={14} /> Download template
            </Button>
          </div>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => readCsv(e.target.value)}
            placeholder="Name,Phone,Age,Pickup point…"
            className={`${inputClass} font-mono text-xs`}
          />
          {csv && (
            <div className="space-y-2 text-sm">
              <p className={csv.rows.length ? "text-forest-light" : "text-saffron"}>
                {csv.rows.length} traveller{csv.rows.length === 1 ? "" : "s"} ready to import.
              </p>
              {csv.ignoredColumns.length > 0 && <p className="text-xs opacity-60">Ignored columns: {csv.ignoredColumns.join(", ")}</p>}
              {csv.problems.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-saffron">
                  {csv.problems.slice(0, 8).map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                  {csv.problems.length > 8 && <li>…and {csv.problems.length - 8} more</li>}
                </ul>
              )}
              <Button size="sm" onClick={importCsv} disabled={busy || csv.rows.length === 0}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Import {csv.rows.length}
              </Button>
            </div>
          )}
        </div>
      )}

      {editing && (
        <form onSubmit={save} className="space-y-4 rounded-xl border border-royal/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{editing.id ? "Edit traveller" : "Add traveller"}</h3>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="opacity-60 hover:opacity-100 cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input required value={editing.values.name} onChange={set("name")} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={editing.values.phone} onChange={set("phone")} className={inputClass} />
            </Field>
            <Field label="Age">
              <input type="number" min={0} max={120} value={editing.values.age} onChange={set("age")} className={inputClass} />
            </Field>
            <Field label="Gender">
              <input value={editing.values.gender} onChange={set("gender")} className={inputClass} />
            </Field>
            <Field label="Pickup point">
              <input value={editing.values.pickupPoint} onChange={set("pickupPoint")} className={inputClass} />
            </Field>
            <div />
            <Field label="Emergency contact name">
              <input value={editing.values.emergencyName} onChange={set("emergencyName")} className={inputClass} />
            </Field>
            <Field label="Emergency contact phone">
              <input value={editing.values.emergencyPhone} onChange={set("emergencyPhone")} className={inputClass} />
            </Field>
          </div>
          <Field label="Medical notes" hint="Allergies, conditions, medicines. Visible to the captain.">
            <textarea rows={2} value={editing.values.medicalNotes} onChange={set("medicalNotes")} className={inputClass} />
          </Field>
          <Field label="Other notes">
            <textarea rows={2} value={editing.values.notes} onChange={set("notes")} className={inputClass} />
          </Field>
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editing.id ? "Save" : "Add"}
          </Button>
        </form>
      )}

      {error && <p className="rounded-lg bg-saffron/10 p-3 text-sm text-saffron">{error}</p>}

      {travellers.length === 0 ? (
        <p className="text-sm opacity-60">No travellers added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide opacity-60">
              <tr>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Age</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Pickup</th>
                <th className="py-2 pr-3">Emergency</th>
                <th className="py-2 pr-3">Medical</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {travellers.map((t) => (
                <tr key={t.id} className="align-top">
                  <td className="py-2 pr-3 font-medium">
                    {t.name}
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-normal">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-semibold",
                          t.status === "pending" ? "bg-saffron/15 text-saffron" : "bg-forest-light/15 text-forest-light"
                        )}
                      >
                        {t.status === "pending" ? "Pending" : "Confirmed"}
                      </span>
                      <span className="opacity-60">
                        {SOURCE_LABEL[t.source]}
                        {t.submissionId && ` · ref ${t.submissionId.slice(0, 6).toUpperCase()}`}
                      </span>
                    </div>
                    {t.contactName && t.contactName !== t.name && (
                      <div className="mt-0.5 text-[11px] font-normal opacity-60">
                        Booked by {t.contactName} {t.contactPhone}
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-3">{t.age ?? ""}</td>
                  <td className="py-2 pr-3">{t.phone}</td>
                  <td className="py-2 pr-3">{t.pickupPoint}</td>
                  <td className="py-2 pr-3 text-xs">
                    {t.emergencyName} {t.emergencyPhone}
                  </td>
                  <td className="py-2 pr-3 text-xs">{t.medicalNotes}</td>
                  <td className="py-2 text-right whitespace-nowrap">
                    {t.status === "pending" && (
                      <button
                        onClick={() => run({ action: "confirm", id: t.id })}
                        disabled={busy}
                        aria-label={`Confirm ${t.name}`}
                        title="Confirm"
                        className="rounded-md p-1.5 text-forest-light hover:bg-forest-light/10 cursor-pointer"
                      >
                        <Check size={15} />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setEditing({
                          id: t.id,
                          values: { ...EMPTY, ...t, age: t.age === null ? "" : String(t.age) },
                        })
                      }
                      aria-label={`Edit ${t.name}`}
                      className="rounded-md p-1.5 opacity-60 hover:bg-foreground/5 hover:opacity-100 cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(t)}
                      aria-label={`Remove ${t.name}`}
                      className="rounded-md p-1.5 opacity-60 hover:bg-foreground/5 hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
