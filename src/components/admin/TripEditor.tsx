"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Save,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageDetailView } from "@/components/packages/PackageDetailView";
import { allIndianStates, categories, getItineraryDays } from "@/lib/data";
import { difficultyLevels, slugify, type TripInput } from "@/lib/trip-schema";
import { tripDocToPackage, type TripDoc } from "@/lib/trip-doc";
import { uploadPhoto } from "@/lib/firebase/upload";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import {
  DateListEditor,
  Field,
  DayItineraryEditor,
  Section,
  StringListEditor,
  inputClass,
} from "./fields";

function toForm(doc: TripDoc): TripInput {
  return {
    title: doc.title ?? "",
    slug: doc.slug ?? "",
    overview: doc.overview ?? "",
    category: doc.category ?? [],
    state: doc.state ?? "",
    location: doc.location ?? "",
    image: doc.image ?? "",
    gallery: doc.gallery ?? [],
    difficulty: doc.difficulty ?? "Moderate",
    duration: doc.duration ?? "",
    durationDays: doc.durationDays ?? 1,
    price: doc.price ?? 0,
    discountPrice: doc.discountPrice ?? 0,
    seatsLeft: doc.seatsLeft ?? 0,
    guideIncluded: doc.guideIncluded ?? true,
    meals: doc.meals ?? "",
    transportation: doc.transportation ?? "",
    departure: doc.departure ?? "",
    returnTime: doc.returnTime ?? "",
    highlights: doc.highlights ?? [],
    temples: doc.temples ?? [],
    altitude: doc.altitude ?? "",
    trekDistance: doc.trekDistance ?? "",
    weather: doc.weather ?? "",
    bestSeason: doc.bestSeason ?? "",
    weekend: doc.weekend ?? false,
    pickupLocations: doc.pickupLocations ?? [],
    tags: doc.tags ?? [],
    itinerary: doc.itinerary ?? [],
    itineraryDays: getItineraryDays(tripDocToPackage(doc)),
    inclusions: doc.inclusions ?? [],
    exclusions: doc.exclusions ?? [],
    thingsToCarry: doc.thingsToCarry ?? [],
    safetyNotes: doc.safetyNotes ?? [],
    departures: doc.departures ?? [],
    sources: doc.sources ?? [],
  };
}

export function TripEditor({ initial }: { initial: TripDoc }) {
  const [trip, setTrip] = useState(initial);

  if (trip.status === "generating") {
    return <GeneratingView trip={trip} onDone={setTrip} />;
  }
  if (trip.status === "failed") {
    return <FailedView trip={trip} />;
  }
  return <Editor trip={trip} onSaved={setTrip} />;
}

// ---------------------------------------------------------------------------

const STEPS = ["Reading your itinerary", "Researching the destination", "Writing the trip page"];

function GeneratingView({ trip, onDone }: { trip: TripDoc; onDone: (t: TripDoc) => void }) {
  const [elapsed, setElapsed] = useState(() => Math.max(0, Math.round((Date.now() - trip.createdAt) / 1000)));

  useEffect(() => {
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    const poll = setInterval(async () => {
      const res = await fetch(`/api/admin/trips/${trip.id}`, { cache: "no-store" });
      if (!res.ok) return;
      const latest = (await res.json()) as TripDoc;
      if (latest.status !== "generating") onDone(latest);
    }, 4000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [trip.id, onDone]);

  const step = elapsed < 15 ? 0 : elapsed < 100 ? 1 : 2;

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-foreground/10 bg-surface p-8 text-center">
      <Loader2 size={32} className="mx-auto animate-spin text-royal-light" />
      <h1 className="mt-4 font-heading text-2xl font-bold">Building your trip page…</h1>
      <p className="mt-1 text-sm opacity-60">
        This usually takes 1–3 minutes. You can leave this page; the draft will be waiting in your trips list.
      </p>
      <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className={cn("flex items-center gap-2", i > step && "opacity-40")}>
            {i < step ? (
              <Check size={16} className="text-forest-light" />
            ) : i === step ? (
              <Loader2 size={16} className="animate-spin text-royal-light" />
            ) : (
              <span className="h-4 w-4 rounded-full border border-foreground/30" />
            )}
            {label}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs opacity-40">{elapsed}s elapsed</p>
    </div>
  );
}

function FailedView({ trip }: { trip: TripDoc }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-saffron/30 bg-surface p-8 text-center">
      <AlertTriangle size={32} className="mx-auto text-saffron" />
      <h1 className="mt-4 font-heading text-2xl font-bold">Generation failed</h1>
      <p className="mt-2 text-sm opacity-70">{trip.error ?? "Something went wrong."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button
          variant="outline"
          disabled={deleting}
          onClick={async () => {
            setDeleting(true);
            await fetch(`/api/admin/trips/${trip.id}`, { method: "DELETE" });
            router.push("/admin/trips/new");
          }}
        >
          <Trash2 size={16} /> Discard &amp; start again
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Editor({ trip, onSaved }: { trip: TripDoc; onSaved: (t: TripDoc) => void }) {
  const router = useRouter();
  const [form, setForm] = useState<TripInput>(() => toForm(trip));
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState<null | "draft" | "published">(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof TripInput>(key: K, value: TripInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const previewPkg = useMemo(() => tripDocToPackage({ ...trip, ...form }), [trip, form]);
  const photos = [form.image, ...form.gallery].filter(Boolean);
  const isPublished = trip.status === "published";

  function setPhotos(list: string[]) {
    setForm((f) => ({ ...f, image: list[0] ?? "", gallery: list.slice(1) }));
    setDirty(true);
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadPhoto(trip.id, f)));
      setPhotos([...photos, ...urls]);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function save(status: "draft" | "published") {
    setSaving(status);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: form, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSaved({ ...trip, ...form, status, updatedAt: Date.now() });
      setDirty(false);
      setMessage({
        type: "ok",
        text:
          status === "published"
            ? isPublished
              ? "Changes are live."
              : "Trip published! It now appears on the website."
            : isPublished
            ? "Trip unpublished and saved as a draft."
            : "Draft saved.",
      });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(null);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${form.title || "this trip"}" permanently? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/trips/${trip.id}`, { method: "DELETE" });
    if (res.ok) {
      setDirty(false);
      router.push("/admin");
      router.refresh();
    } else {
      setMessage({ type: "error", text: "Delete failed" });
    }
  }

  return (
    <div>
      {/* Top bar */}
      <div className="sticky top-[57px] z-30 -mx-4 mb-6 border-b border-foreground/10 bg-surface-muted/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="rounded-full p-1.5 hover:bg-foreground/5" aria-label="Back to trips">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-heading text-xl font-bold">{form.title || "Untitled trip"}</h1>
              <StatusBadge status={trip.status} />
              {dirty && <span className="text-xs text-saffron">Unsaved changes</span>}
            </div>
          </div>
          <div className="flex rounded-full border border-foreground/15 p-0.5 text-sm">
            <TabBtn active={tab === "edit"} onClick={() => setTab("edit")}>
              <Pencil size={14} /> Edit
            </TabBtn>
            <TabBtn active={tab === "preview"} onClick={() => setTab("preview")}>
              <Eye size={14} /> Preview
            </TabBtn>
          </div>
          <div className="flex flex-wrap gap-2">
            {isPublished && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/packages/${trip.slug}`} target="_blank">
                  <ExternalLink size={14} /> Live page
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" disabled={!!saving} onClick={() => save("draft")}>
              {saving === "draft" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isPublished ? (
                <EyeOff size={14} />
              ) : (
                <Save size={14} />
              )}
              {isPublished ? "Unpublish" : "Save draft"}
            </Button>
            <Button variant="saffron" size="sm" disabled={!!saving} onClick={() => save("published")}>
              {saving === "published" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isPublished ? "Update live trip" : "Publish trip"}
            </Button>
          </div>
        </div>
        {message && (
          <p
            className={cn(
              "mt-2 flex items-center gap-2 text-sm",
              message.type === "ok" ? "text-forest-light" : "text-saffron"
            )}
          >
            {message.type === "ok" ? <Check size={15} /> : <AlertTriangle size={15} />}
            {message.text}
            <button onClick={() => setMessage(null)} className="opacity-60 hover:opacity-100 cursor-pointer">
              <X size={13} />
            </button>
          </p>
        )}
      </div>

      {tab === "preview" ? (
        <div className="-mx-4 overflow-hidden rounded-2xl border border-foreground/10 bg-background sm:mx-0">
          <PackageDetailView pkg={previewPkg} />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          <Section title="Basics">
            <Field label="Trip title">
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Page URL" hint={`bharathtreksandtales.com/packages/${form.slug || "…"}`}>
              <div className="flex gap-2">
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => set("slug", slugify(form.title))}
                  className="shrink-0 rounded-lg border border-foreground/15 px-3 text-xs font-medium hover:bg-foreground/5 cursor-pointer"
                >
                  From title
                </button>
              </div>
            </Field>
            <Field label="Overview">
              <textarea
                value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                rows={4}
                className={inputClass}
              />
            </Field>
            <Field label="Categories">
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = form.category.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        set(
                          "category",
                          active ? form.category.filter((x) => x !== c.id) : [...form.category, c.id]
                        )
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                        active ? "border-royal bg-royal text-white" : "border-foreground/15 hover:bg-foreground/5"
                      )}
                    >
                      {c.icon} {c.label}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Location">
                <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
              </Field>
              <Field label="State">
                <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass}>
                  <option value="">Select state</option>
                  {allIndianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Difficulty">
                <select
                  value={form.difficulty}
                  onChange={(e) => set("difficulty", e.target.value as TripInput["difficulty"])}
                  className={inputClass}
                >
                  {difficultyLevels.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <Field label="Duration">
                  <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Days">
                  <input
                    type="number"
                    min={1}
                    value={form.durationDays}
                    onChange={(e) => set("durationDays", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.weekend} onChange={(e) => set("weekend", e.target.checked)} />
                Weekend trip
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.guideIncluded}
                  onChange={(e) => set("guideIncluded", e.target.checked)}
                />
                Guide included
              </label>
            </div>
          </Section>

          <Section title="Photos" description="The first photo is the cover. Hover a photo to make it the cover or remove it.">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((url, i) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-foreground/5">
                  <Image src={url} alt="" fill sizes="160px" className="object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-saffron px-1.5 py-0.5 text-[10px] font-bold text-white">
                      COVER
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {i > 0 ? (
                      <button
                        type="button"
                        title="Make cover"
                        onClick={() => setPhotos([url, ...photos.filter((p) => p !== url)])}
                        className="text-white cursor-pointer"
                      >
                        <Star size={14} />
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      title="Remove"
                      onClick={() => setPhotos(photos.filter((p) => p !== url))}
                      className="text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-foreground/15 text-xs hover:bg-foreground/5">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                Add photos
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </Section>

          <Section title="Price, seats & dates">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Price (₹ / person)">
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Offer price (₹)" hint="Same as price if no discount">
                <input
                  type="number"
                  min={0}
                  value={form.discountPrice}
                  onChange={(e) => set("discountPrice", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Seats per departure date" hint="Each date has this many seats">
                <input
                  type="number"
                  min={0}
                  value={form.seatsLeft}
                  onChange={(e) => set("seatsLeft", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Departure dates">
              <DateListEditor value={form.departures} onChange={(v) => set("departures", v)} />
            </Field>
          </Section>

          <Section title="Logistics">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Departure">
                <input value={form.departure} onChange={(e) => set("departure", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Return">
                <input value={form.returnTime} onChange={(e) => set("returnTime", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Transport">
                <input
                  value={form.transportation}
                  onChange={(e) => set("transportation", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Meals">
                <input value={form.meals} onChange={(e) => set("meals", e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Pickup points">
              <StringListEditor value={form.pickupLocations} onChange={(v) => set("pickupLocations", v)} />
            </Field>
          </Section>

          <Section title="Quick facts">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Altitude">
                <input value={form.altitude} onChange={(e) => set("altitude", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Trek distance">
                <input
                  value={form.trekDistance}
                  onChange={(e) => set("trekDistance", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Weather">
                <input value={form.weather} onChange={(e) => set("weather", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Best season">
                <input value={form.bestSeason} onChange={(e) => set("bestSeason", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </Section>

          <Section title="Trip highlights">
            <StringListEditor value={form.highlights} onChange={(v) => set("highlights", v)} />
            <Field label="Temples on the route">
              <StringListEditor value={form.temples} onChange={(v) => set("temples", v)} />
            </Field>
            <Field label="Tags">
              <StringListEditor value={form.tags} onChange={(v) => set("tags", v)} />
            </Field>
          </Section>

          <Section title="Day-by-day itinerary" description="Shown as expandable day cards on the trip page.">
            <DayItineraryEditor value={form.itineraryDays} onChange={(v) => set("itineraryDays", v)} />
          </Section>

          <Section title="Inclusions, exclusions & packing">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Inclusions">
                <StringListEditor value={form.inclusions} onChange={(v) => set("inclusions", v)} />
              </Field>
              <Field label="Exclusions">
                <StringListEditor value={form.exclusions} onChange={(v) => set("exclusions", v)} />
              </Field>
            </div>
            <Field label="Things to carry">
              <StringListEditor value={form.thingsToCarry} onChange={(v) => set("thingsToCarry", v)} />
            </Field>
            <Field label="Safety & good to know">
              <StringListEditor value={form.safetyNotes} onChange={(v) => set("safetyNotes", v)} />
            </Field>
          </Section>

          {form.sources.length > 0 && (
            <Section title="Research sources" description="Pages the AI used. Shown at the bottom of the trip page.">
              <ul className="space-y-1.5 text-sm">
                {form.sources.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-royal-light hover:underline">
                      {s.title || s.url}
                    </a>
                    <button
                      type="button"
                      onClick={() => set("sources", form.sources.filter((_, j) => j !== i))}
                      className="opacity-50 hover:opacity-100 cursor-pointer"
                      aria-label="Remove source"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="flex justify-between border-t border-foreground/10 pt-6">
            <Button variant="ghost" onClick={remove} className="text-saffron">
              <Trash2 size={16} /> Delete trip
            </Button>
            <Button variant="saffron" disabled={!!saving} onClick={() => save("published")}>
              <Send size={16} /> {isPublished ? "Update live trip" : "Publish trip"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer",
        active ? "bg-foreground text-background" : "opacity-70 hover:opacity-100"
      )}
    >
      {children}
    </button>
  );
}
