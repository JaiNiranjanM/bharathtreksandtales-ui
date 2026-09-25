"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { globalSearch, type SearchResult } from '@/services/searchService';

export function GlobalSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(v: string) {
    setQ(v);
    if (v.trim().length >= 2) {
      setLoading(true);
    } else {
      setResults(null);
      setLoading(false);
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setQ('');
      setResults(null);
      setLoading(false);
    }
    onOpenChange(v);
  }

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) return;
    const t = setTimeout(() => {
      globalSearch(query).then(
        (data) => { setResults(data); setLoading(false); },
        () => { setResults(null); setLoading(false); }
      );
    }, 320);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search size={18} className="opacity-50" />
          <input
            autoFocus
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search trips, destinations, blogs…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button onClick={() => handleOpenChange(false)} className="rounded p-1 hover:bg-foreground/10"><X size={16} /></button>
        </div>
        <div className="max-h-[60vh] overflow-auto p-4">
          {loading && <p className="text-sm text-muted-foreground">Searching…</p>}
          {!loading && !results && q.trim().length >= 2 && <p className="text-sm text-muted-foreground">No results</p>}
          {!loading && !results && q.trim().length < 2 && <p className="text-sm text-muted-foreground">Type at least 2 characters to search packages and blogs.</p>}
          {results && (
            <div className="space-y-5">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">Trips ({results.packages.length})</h4>
                {results.packages.length === 0 ? <p className="text-sm opacity-60">No trips found</p> : (
                  <div className="grid gap-2">
                    {results.packages.map((p) => (
                      <Link key={p.slug} href={`/packages/${p.slug}`} onClick={() => handleOpenChange(false)} className="flex gap-3 rounded-lg border p-2 hover:bg-foreground/5">
                        <img src={p.image} alt={p.title} className="h-12 w-20 rounded object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.title}</p>
                          <p className="text-xs opacity-60">{p.location} • {p.state}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">Blogs ({results.blog.length})</h4>
                {results.blog.length === 0 ? <p className="text-sm opacity-60">No blogs found</p> : (
                  <div className="grid gap-2">
                    {results.blog.map((b) => (
                      <Link key={b.slug} href={`/blog/${b.slug}`} onClick={() => handleOpenChange(false)} className="rounded-lg border p-3 hover:bg-foreground/5">
                        <p className="text-sm font-medium">{b.title}</p>
                        <p className="text-xs opacity-60 line-clamp-2">{b.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={() => handleOpenChange(false)} className="inline-block text-sm text-royal hover:underline">View all results →</Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
