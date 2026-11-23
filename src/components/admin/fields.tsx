"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:border-royal-light focus:outline-none";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-xs font-semibold uppercase tracking-wide opacity-60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs opacity-50">{hint}</span>}
    </label>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-surface p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-xs opacity-60">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

/** Edits a list of short strings as an add/remove list. */
export function StringListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  }

  return (
    <div>
      <ul className="space-y-1.5">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="rounded-md p-1.5 opacity-50 hover:bg-foreground/5 hover:opacity-100 cursor-pointer"
              aria-label="Remove"
            >
              <X size={15} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          placeholder={placeholder ?? "Add item and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg border border-foreground/15 px-3 text-xs font-medium hover:bg-foreground/5 cursor-pointer"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

export function ItineraryEditor({
  value,
  onChange,
}: {
  value: { time: string; activity: string }[];
  onChange: (v: { time: string; activity: string }[]) => void;
}) {
  function update(i: number, patch: Partial<{ time: string; activity: string }>) {
    onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {value.map((step, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-foreground/10 p-2.5 sm:flex-row sm:items-start">
          <input
            value={step.time}
            placeholder="Day 1 · 6:00 AM"
            onChange={(e) => update(i, { time: e.target.value })}
            className={cn(inputClass, "sm:w-44")}
          />
          <textarea
            value={step.activity}
            rows={2}
            placeholder="What happens"
            onChange={(e) => update(i, { activity: e.target.value })}
            className={cn(inputClass, "flex-1 resize-y")}
          />
          <div className="flex shrink-0 gap-0.5 self-end sm:self-start">
            <IconBtn label="Move up" onClick={() => move(i, -1)}>
              <ArrowUp size={14} />
            </IconBtn>
            <IconBtn label="Move down" onClick={() => move(i, 1)}>
              <ArrowDown size={14} />
            </IconBtn>
            <IconBtn label="Remove step" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 size={14} />
            </IconBtn>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { time: "", activity: "" }])}
        className="flex items-center gap-1 rounded-lg border border-dashed border-foreground/20 px-3 py-2 text-xs font-medium hover:bg-foreground/5 cursor-pointer"
      >
        <Plus size={14} /> Add step
      </button>
    </div>
  );
}

export function DateListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[...value].sort().map((d) => (
          <span
            key={d}
            className="flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium"
          >
            {new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== d))}
              className="opacity-50 hover:opacity-100 cursor-pointer"
              aria-label="Remove date"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {value.length === 0 && <span className="text-xs opacity-50">No dates added</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <input ref={ref} type="date" className={cn(inputClass, "w-auto")} />
        <button
          type="button"
          onClick={() => {
            const v = ref.current?.value;
            if (v && !value.includes(v)) onChange([...value, v]);
            if (ref.current) ref.current.value = "";
          }}
          className="flex items-center gap-1 rounded-lg border border-foreground/15 px-3 text-xs font-medium hover:bg-foreground/5 cursor-pointer"
        >
          <Plus size={14} /> Add date
        </button>
      </div>
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 opacity-60 hover:bg-foreground/5 hover:opacity-100 cursor-pointer"
    >
      {children}
    </button>
  );
}
