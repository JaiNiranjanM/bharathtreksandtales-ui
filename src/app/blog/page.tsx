import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getBlogPosts } from "@/services/blogService";

const fallbackPosts = [
  {
    slug: "top-10-treks-karnataka",
    title: "Top 10 Treks in Karnataka You Can't Miss",
    excerpt: "From the cloud-kissed peaks of Kudremukh to the sunrise at Nandi Hills — the best trails for every skill level.",
    date: "2026-03-10",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=800&auto=format&fit=crop",
    category: "trekking",
  },
  {
    slug: "temple-yatras-south-india",
    title: "Spiritual Journeys: Temple Yatras of South India",
    excerpt: "A curated guide to Tirupati, Sabarimala, Rameswaram and the most sacred shrines across the southern states.",
    date: "2026-02-22",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop",
    category: "spiritual",
  },
  {
    slug: "coorg-couple-getaway-guide",
    title: "Coorg: The Perfect Couple Getaway",
    excerpt: "Waterfalls, homestays and candlelight dinners — plan your Coorg retreat step-by-step.",
    date: "2026-01-18",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
    category: "couples",
  },
  {
    slug: "family-hill-stations-tamil-nadu",
    title: "Family-Friendly Hill Stations in Tamil Nadu",
    excerpt: "Kodaikanal and beyond — where to stay, what to eat, and how to keep kids happy on the trail.",
    date: "2026-01-05",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
    category: "family",
  },
];

export default async function BlogPage() {
  let posts = fallbackPosts;
  try {
    const apiPosts = await getBlogPosts();
    if (apiPosts.length > 0) posts = apiPosts;
  } catch {
    // Backend unreachable — show curated fallback
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="font-heading text-4xl font-bold">Blog</h1>
          <p className="mt-3 max-w-lg text-sm text-foreground/60">
            Stories, guides and travel tips from the Bharath Treks & Tales team.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <article key={post.slug} className="group overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-medium text-white capitalize">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-foreground/40">{post.date}</p>
                  <h2 className="mt-1.5 font-heading text-lg font-semibold group-hover:text-royal-light">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-medium text-saffron hover:text-saffron-light">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
