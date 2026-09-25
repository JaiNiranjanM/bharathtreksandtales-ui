"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initial }: { initial: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
      className="mt-5 flex items-center gap-2 rounded-full border border-foreground/10 bg-surface px-4 py-3 shadow-sm"
    >
      <Search size={18} className="opacity-50" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search trips, destinations, blogs…"
        className="w-full bg-transparent text-sm focus:outline-none"
      />
      <button type="submit" className="rounded-full bg-royal px-4 py-1.5 text-xs font-semibold text-white">Search</button>
    </form>
  );
}
