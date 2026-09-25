import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBlogPostBySlug, getBlogPosts, type BlogPost } from "@/services/blogService";

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    return { title: `${post.title} | Bharath Treks & Tales Blog`, description: post.excerpt };
  } catch {
    return { title: "Blog Post Not Found" };
  }
}

function renderContent(content: string) {
  // Minimal markdown-ish renderer: headings, quotes, bold, lists, paragraphs
  return content.split("\n").map((line, i) => {
    const t = line.trim();
    if (t.startsWith("## ")) return <h2 key={i} className="mt-8 font-heading text-2xl font-bold">{t.slice(3)}</h2>;
    if (t.startsWith("# ")) return <h1 key={i} className="font-heading text-3xl font-bold">{t.slice(2)}</h1>;
    if (t.startsWith("> ")) return <blockquote key={i} className="mt-4 border-l-4 border-saffron pl-4 text-sm italic opacity-80">{t.slice(2)}</blockquote>;
    if (t.startsWith("*") && t.endsWith("*") && t.length > 2) return <p key={i} className="mt-4 text-sm italic opacity-70">{t.slice(1, -1)}</p>;
    if (!t) return <span key={i} className="block h-3" />;
    return <p key={i} className="mt-4 leading-relaxed text-foreground/80">{t}</p>;
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost | null = null;
  let related: BlogPost[] = [];
  try {
    post = await getBlogPostBySlug(slug);
    const all = await getBlogPosts();
    related = all.filter((p) => p.slug !== slug && p.category === post!.category).slice(0, 2);
    if (related.length === 0) related = all.filter((p) => p.slug !== slug).slice(0, 2);
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 pt-28">
        <article className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="text-sm font-medium text-saffron hover:underline">← All stories</Link>
          <span className="ml-3 rounded-full bg-saffron px-3 py-1 text-xs font-medium text-white">{post.category}</span>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="mt-2 text-xs opacity-50">{post.date} • {post.author}</p>
          <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <p className="mt-6 text-base font-medium opacity-80">{post.excerpt}</p>
          <div className="mt-2">{renderContent(post.content)}</div>

          <div className="mt-10 rounded-2xl bg-royal/5 p-6 text-center">
            <p className="font-heading text-lg font-bold">Inspired to travel?</p>
            <p className="mt-1 text-sm opacity-70">Browse curated treks, yatras and weekend escapes.</p>
            <Link href="/packages" className="mt-4 inline-block rounded-full bg-saffron px-6 py-2.5 text-sm font-medium text-white">Explore Trips</Link>
          </div>

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold">Keep reading</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
                    <div className="aspect-video overflow-hidden">
                      <img src={r.image} alt={r.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-sm font-semibold">{r.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs opacity-60">{r.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
