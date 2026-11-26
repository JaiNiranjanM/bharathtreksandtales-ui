"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/captain/client";
import { MAX_PEOPLE_PER_SUBMISSION } from "@/lib/captain/schemas";

const EMPTY_PERSON = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  pickupPoint: "",
  emergencyName: "",
  emergencyPhone: "",
  medicalNotes: "",
  notes: "",
};
type Person = typeof EMPTY_PERSON;

const input =
  "w-full rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-sm focus:border-royal-light focus:outline-none";

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide opacity-60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs opacity-50">{hint}</span>}
    </label>
  );
}

/**
 * The details form for a booking or a registration link: who is travelling, how to reach them,
 * emergency contact and medical notes. Sends to `endpoint`; nothing is shown to anyone but BTT and the trip captain.
 */
export function RegistrationForm({
  endpoint,
  extra,
  pickupOptions,
  initialPeople,
  withContact,
  successText,
  maxPeople = MAX_PEOPLE_PER_SUBMISSION,
}: {
  endpoint: string;
  /** Fields the server needs besides the form, e.g. the trip and date for a booking. */
  extra: Record<string, unknown>;
  pickupOptions: string[];
  initialPeople: number;
  /** A booking asks who is booking; a registration link does not (the first traveller is the contact). */
  withContact: boolean;
  successText: string;
  /** Most people this submission may include (for example the seats left on the date). */
  maxPeople?: number;
}) {
  const limit = Math.max(1, Math.min(maxPeople, MAX_PEOPLE_PER_SUBMISSION));
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [people, setPeople] = useState<Person[]>(() =>
    Array.from({ length: Math.min(Math.max(initialPeople, 1), limit) }, () => ({ ...EMPTY_PERSON }))
  );
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot: hidden from people, filled in by bots
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ ref: string; added: number; duplicates: number } | null>(null);

  const setPerson = (i: number, key: keyof Person, value: string) =>
    setPeople((cur) => cur.map((p, j) => (j === i ? { ...p, [key]: value } : p)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        ...extra,
        ...(withContact ? { contact: contact } : {}),
        travellers: people.map((p) => ({ ...p, age: p.age.trim() === "" ? null : Number(p.age) })),
        consent,
        website,
      };
      setDone(await api<{ ref: string; added: number; duplicates: number }>(endpoint, "POST", payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-forest-light/40 bg-forest-light/10 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto text-forest-light" />
        <h2 className="mt-3 font-heading text-2xl font-bold">Details received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm opacity-80">{successText}</p>
        {done.duplicates > 0 && (
          <p className="mt-2 text-xs opacity-70">
            {done.duplicates} {done.duplicates === 1 ? "person was" : "people were"} already registered, so nothing was added twice.
          </p>
        )}
        <p className="mt-4 text-xs uppercase tracking-wide opacity-60">Reference</p>
        <p className="font-mono text-xl font-bold tracking-widest">{done.ref}</p>
        <p className="mt-1 text-xs opacity-60">Quote this if you contact BTT.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {withContact && (
        <section className="space-y-4 rounded-2xl border border-foreground/10 bg-surface p-5">
          <h2 className="font-heading text-lg font-bold">Who is booking?</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <F label="Your name">
              <input required className={input} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            </F>
            <F label="Phone">
              <input required type="tel" inputMode="tel" className={input} autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </F>
            <F label="Email (optional)">
              <input type="email" className={input} autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </F>
          </div>
        </section>
      )}

      {people.map((p, i) => (
        <section key={i} className="space-y-4 rounded-2xl border border-foreground/10 bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold">
              {people.length > 1 || withContact ? `Traveller ${i + 1}` : "Your details"}
            </h2>
            <div className="flex items-center gap-3">
              {withContact && i === 0 && (
                <button
                  type="button"
                  onClick={() => setPeople((cur) => cur.map((x, j) => (j === 0 ? { ...x, name: contact.name || x.name, phone: contact.phone || x.phone } : x)))}
                  className="cursor-pointer text-xs font-medium text-royal-light hover:underline"
                >
                  I am travelling: use my details
                </button>
              )}
              {people.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPeople((cur) => cur.filter((_, j) => j !== i))}
                  aria-label={`Remove traveller ${i + 1}`}
                  className="cursor-pointer rounded-md p-1.5 opacity-60 hover:bg-foreground/5 hover:opacity-100"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <F label="Full name">
              <input required className={input} value={p.name} onChange={(e) => setPerson(i, "name", e.target.value)} />
            </F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Age">
                <input required type="number" inputMode="numeric" min={0} max={120} className={input} value={p.age} onChange={(e) => setPerson(i, "age", e.target.value)} />
              </F>
              <F label="Gender">
                <select className={input} value={p.gender} onChange={(e) => setPerson(i, "gender", e.target.value)}>
                  <option value="">Select</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </F>
            </div>
            <F label={`Phone${!withContact && i === 0 ? "" : " (optional)"}`}>
              <input required={!withContact && i === 0} type="tel" inputMode="tel" className={input} value={p.phone} onChange={(e) => setPerson(i, "phone", e.target.value)} />
            </F>
            <F label="Pickup point">
              {pickupOptions.length > 0 ? (
                <select className={input} value={p.pickupPoint} onChange={(e) => setPerson(i, "pickupPoint", e.target.value)}>
                  <option value="">Select</option>
                  {pickupOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input className={input} value={p.pickupPoint} onChange={(e) => setPerson(i, "pickupPoint", e.target.value)} />
              )}
            </F>
            <F label="Emergency contact name">
              <input className={input} value={p.emergencyName} onChange={(e) => setPerson(i, "emergencyName", e.target.value)} />
            </F>
            <F label="Emergency contact phone">
              <input type="tel" inputMode="tel" className={input} value={p.emergencyPhone} onChange={(e) => setPerson(i, "emergencyPhone", e.target.value)} />
            </F>
          </div>
          <F label="Medical conditions or allergies" hint="Anything the trip captain should know in an emergency. Leave blank if none.">
            <textarea rows={2} className={input} value={p.medicalNotes} onChange={(e) => setPerson(i, "medicalNotes", e.target.value)} />
          </F>
          <F label="Anything else (optional)" hint="Food preference, seat request, and so on.">
            <textarea rows={2} className={input} value={p.notes} onChange={(e) => setPerson(i, "notes", e.target.value)} />
          </F>
        </section>
      ))}

      {people.length < limit && (
        <button
          type="button"
          onClick={() => setPeople((cur) => [...cur, { ...EMPTY_PERSON }])}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-foreground/25 px-4 py-2.5 text-sm font-medium hover:bg-foreground/5"
        >
          <Plus size={15} /> Add another person
        </button>
      )}

      <div className="space-y-3 rounded-2xl bg-foreground/5 p-5 text-sm">
        <p className="opacity-80">
          If anyone travelling is <strong>under 18</strong>, a parent or guardian must fill in this form for them.
        </p>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
          <span className="opacity-90">
            I agree that Bharath Treks &amp; Tales and the trip captain may use these details, including emergency contact and medical
            information, to run this trip safely. They are not shared with anyone else.
          </span>
        </label>
      </div>

      {error && <p className="rounded-xl bg-saffron/10 p-4 text-sm text-saffron">{error}</p>}
      <Button type="submit" variant="saffron" size="lg" className="w-full sm:w-auto" disabled={busy || !consent}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Send my details
      </Button>
    </form>
  );
}
