import { buildItineraryPdf } from "@/lib/itineraryPdf";
import { getPackageBySlug } from "@/lib/trips";

/** Public: downloads a PDF itinerary generated from the trip page content. */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return new Response("Trip not found", { status: 404 });

  const pdf = await buildItineraryPdf(pkg, new URL(request.url).origin);
  const filename = `${pkg.slug}-itinerary.pdf`.replace(/[^a-z0-9._-]/gi, "_");
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
