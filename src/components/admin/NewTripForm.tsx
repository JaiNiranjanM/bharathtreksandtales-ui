"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, ImagePlus, Loader2, Sparkles, Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { newTripId, uploadPhoto, uploadSourceFile } from "@/lib/firebase/upload";
import { DateListEditor, Field, Section, inputClass } from "./fields";

const ITINERARY_ACCEPT = ".pdf,.docx,.txt,.md,image/png,image/jpeg,image/webp,image/gif";
const MAX_FILE_MB = 25;

export function NewTripForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [pastedText, setPastedText] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [seats, setSeats] = useState("20");
  const [departures, setDepartures] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [research, setResearch] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const busy = Boolean(status);

  function addFiles(list: FileList | null, setter: React.Dispatch<React.SetStateAction<File[]>>) {
    if (!list) return;
    const tooBig = Array.from(list).find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than ${MAX_FILE_MB} MB.`);
      return;
    }
    setter((prev) => [...prev, ...Array.from(list)]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (files.length === 0 && !pastedText.trim()) {
      setError("Upload an itinerary file or paste the itinerary text.");
      return;
    }
    const id = newTripId();
    try {
      setStatus("Uploading itinerary…");
      const fileRefs = await Promise.all(files.map((f) => uploadSourceFile(id, f)));
      setStatus(photos.length ? "Uploading photos…" : "Starting AI…");
      const photoUrls = await Promise.all(photos.map((f) => uploadPhoto(id, f)));

      setStatus("Starting AI…");
      const res = await fetch("/api/admin/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          files: fileRefs,
          photos: photoUrls,
          pastedText,
          price: Number(price) || 0,
          discountPrice: Number(discountPrice) || 0,
          seatsLeft: Number(seats) || 0,
          departures,
          notes,
          research,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not start generation");
      router.push(`/admin/trips/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">New trip</h1>
        <p className="mt-1 text-sm opacity-60">
          Upload the itinerary. AI reads it, researches the destination, and drafts the full trip page
          for you to review before publishing.
        </p>
      </div>

      <Section title="1. Itinerary" description="PDF, Word (.docx), screenshots/photos, or paste the text. Add as many as you like.">
        <DropZone accept={ITINERARY_ACCEPT} onFiles={(l) => addFiles(l, setFiles)} icon={<Upload size={22} />}>
          Click to upload itinerary files
        </DropZone>
        {files.length > 0 && (
          <ul className="space-y-1.5">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-2 text-sm">
                <FileText size={15} className="shrink-0 opacity-60" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-xs opacity-50">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  className="opacity-50 hover:opacity-100 cursor-pointer"
                  aria-label="Remove file"
                >
                  <X size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Field label="Or paste itinerary text">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={6}
            placeholder="Paste the WhatsApp message, email or document text here…"
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="2. Photos" description="The first photo is the cover image. The rest appear in the gallery.">
        <DropZone accept="image/png,image/jpeg,image/webp" onFiles={(l) => addFiles(l, setPhotos)} icon={<ImagePlus size={22} />}>
          Click to add photos
        </DropZone>
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {photos.map((f, i) => (
              <PhotoThumb
                key={`${f.name}-${i}`}
                file={f}
                cover={i === 0}
                onRemove={() => setPhotos(photos.filter((_, j) => j !== i))}
                onMakeCover={() => setPhotos([f, ...photos.filter((_, j) => j !== i)])}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="3. Price, seats & dates" description="Leave the price empty to use the price from the itinerary, if it has one.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Price (₹ / person)">
            <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Offer price (₹)" hint="Optional discounted price">
            <input
              type="number"
              min={0}
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Seats per departure date" hint="Each date has this many seats">
            <input type="number" min={0} value={seats} onChange={(e) => setSeats(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Departure dates" hint="Leave empty to use dates found in the itinerary.">
          <DateListEditor value={departures} onChange={setDepartures} />
        </Field>
      </Section>

      <Section title="4. AI options">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={research}
            onChange={(e) => setResearch(e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <span className="font-medium">Research the destination on the web</span>
            <span className="block text-xs opacity-60">
              Fills in altitude, distance, weather, best season, temples and safety notes. Takes 1–3 minutes.
            </span>
          </span>
        </label>
        <Field label="Notes for the AI (optional)" hint='e.g. "Mark this as a family-friendly trip" or "Pickup only from Majestic"'>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
        </Field>
      </Section>

      {error && <p className="rounded-xl bg-saffron/10 p-4 text-sm text-saffron">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" variant="saffron" size="lg" disabled={busy}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {status || "Generate trip page"}
        </Button>
      </div>
    </form>
  );
}

function DropZone({
  accept,
  onFiles,
  icon,
  children,
}: {
  accept: string;
  onFiles: (files: FileList | null) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-sm transition-colors ${
        over ? "border-royal-light bg-royal/5" : "border-foreground/15 hover:bg-foreground/5"
      }`}
    >
      <span className="opacity-60">{icon}</span>
      <span className="font-medium">{children}</span>
      <span className="text-xs opacity-50">or drag and drop</span>
      <input
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function PhotoThumb({
  file,
  cover,
  onRemove,
  onMakeCover,
}: {
  file: File;
  cover: boolean;
  onRemove: () => void;
  onMakeCover: () => void;
}) {
  const [url] = useState(() => URL.createObjectURL(file));
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-foreground/5">
      <Image src={url} alt={file.name} fill unoptimized className="object-cover" />
      {cover && (
        <span className="absolute left-1 top-1 rounded bg-saffron px-1.5 py-0.5 text-[10px] font-bold text-white">
          COVER
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!cover ? (
          <button type="button" onClick={onMakeCover} className="text-white cursor-pointer" title="Make cover">
            <Star size={14} />
          </button>
        ) : (
          <span />
        )}
        <button type="button" onClick={onRemove} className="text-white cursor-pointer" title="Remove">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
