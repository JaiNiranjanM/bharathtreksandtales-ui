import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { globalSearch } from "@/services/searchService";
import { SearchBox } from "./SearchBox";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  let results: Awaited<ReturnType<typeof globalSearch>> | null = null;
  if (query.length >= 2) {
    try {
      results = await globalSearch(query);
    } catch {
      results = { packages: [], blog: [] };
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-heading text-3xl font-bold">Search</h1>
          <Suspense fallback={null}>
            <SearchBox initial={query} />
          </Suspense>

          {query.length >= 2 && results && (
            <div className="mt-8 space-y-8">
              <section>
                <h2 className="font-heading text-lg font-bold">Trips ({results.packages.length})</h2>
                {results.packages.length === 0 ? (
                  <p className="mt-2 text-sm opacity-60">No trips match “{query}”.</p>
                ) : (
                  <div className="mt-3 grid gap-3">
                    {results.packages.map((p) => (
                      <Link key={p.slug} href={`/packages/${p.slug}`} className="flex gap-3 rounded-xl border border-foreground/10 bg-surface p-3 hover:shadow-md">
                        <img src={p.image} alt={p.title} className="h-16 w-24 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold">{p.title}</p>
                          <p className="text-xs opacity-60">{p.location} • {p.state}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <h2 className="font-heading text-lg font-bold">Stories ({results.blog.length})</h2>
                {results.blog.length === 0 ? (
                  <p className="mt-2 text-sm opacity-60">No stories match “{query}”.</p>
                ) : (
                  <div className="mt-3 grid gap-3">
                    {results.blog.map((b) => (
                      <Link key={b.slug} href={`/blog/${b.slug}`} className="rounded-xl border border-foreground/10 bg-surface p-4 hover:shadow-md">
                        <p className="text-sm font-semibold">{b.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs opacity-60">{b.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
