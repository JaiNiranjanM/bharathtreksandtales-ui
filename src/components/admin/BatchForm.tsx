"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, type BatchDoc, type CaptainDoc } from "@/lib/captain/core";
import { api } from "@/lib/captain/client";
import { Field, Section, inputClass } from "./fields";

export interface TripOption {
  id: string;
  title: string;
  location: string;
  durationDays: number;
  /** Upcoming departure dates (YYYY-MM-DD) */
  departures: string[];
}

/** Create a batch (one run of a trip), or edit its basics and captains. */
export function BatchForm({
  batch,
  trips = [],
  captains,
}: {
  batch?: BatchDoc;
  trips?: TripOption[];
  captains: CaptainDoc[];
}) {
  const router = useRouter();
  const [tripId, setTripId] = useState(batch?.tripId ?? "");
  const [tripTitle, setTripTitle] = useState(batch?.tripTitle ?? "");
  const [location, setLocation] = useState(batch?.location ?? "");
  const [startDate, setStartDate] = useState(batch?.startDate ?? "");
  const [endDate, setEndDate] = useState(batch?.endDate ?? "");
  const [captainUids, setCaptainUids] = useState<string[]>(batch?.captainUids ?? []);
  const [notes, setNotes] = useState(batch?.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function pickTrip(id: string) {
    setTripId(id);
    const t = trips.find((x) => x.id === id);
    if (!t) return;
    setTripTitle(t.title);
    setLocation(t.location);
    const start = t.departures[0];
    if (start) {
      setStartDate(start);
      setEndDate(addDays(start, Math.max(0, t.durationDays - 1)));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setBusy(true);
    const body = { tripId, tripTitle, location, startDate, endDate, captainUids, notes };
    try {
      if (batch) {
        await api(`/api/admin/batches/${batch.id}`, "POST", { action: "update", batch: body });
        setSaved(true);
        router.refresh();
      } else {
        const res = await api<{ id: string }>("/api/admin/batches", "POST", body);
        router.push(`/admin/batches/${res.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const toggle = (uid: string) =>
    setCaptainUids((cur) => (cur.includes(uid) ? cur.filter((u) => u !== uid) : [...cur, uid]));

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Trip & dates">
        {!batch && trips.length > 0 && (
          <Field label="Trip on the website (optional)" hint="Fills in the name, place and dates. For a trip that is not listed on the site, leave it blank and type the details.">
            <select value={tripId} onChange={(e) => pickTrip(e.target.value)} className={inputClass}>
              <option value="">Not listed on the website</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Trip name">
          <input required value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Place">
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First day">
            <input
              required
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (!endDate || endDate < e.target.value) setEndDate(e.target.value);
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Last day">
            <input required type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Notes for the captain (optional)" hint="Meeting point, reporting time, anything they should know. Shown on their page.">
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
        </Field>
      </Section>

      <Section title="Captains" description="Assigned captains see this trip once you give them access.">
        {captains.length === 0 ? (
          <p className="text-sm opacity-60">
            No captains yet. <a href="/admin/captains" className="text-royal-light underline">Add a captain</a> first, then come back.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {captains.map((c) => (
              <li key={c.uid}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-foreground/10 p-3 text-sm">
                  <input type="checkbox" checked={captainUids.includes(c.uid)} onChange={() => toggle(c.uid)} className="mt-1 h-4 w-4" />
                  <span>
                    <span className="font-medium">{c.name}</span>
                    {!c.active && <span className="ml-2 text-xs text-saffron">switched off</span>}
                    <span className="block text-xs opacity-60">{c.email}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {error && <p className="rounded-xl bg-saffron/10 p-4 text-sm text-saffron">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="saffron" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {batch ? "Save changes" : "Create batch"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-forest-light">
            <Check size={15} /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
