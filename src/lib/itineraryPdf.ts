import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { TravelPackage } from "./data";
import { CONTACT_PHONE_DISPLAY } from "./contact";

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 48;
const COLOR_TEXT = rgb(0.08, 0.1, 0.12);
const COLOR_MUTED = rgb(0.4, 0.42, 0.46);
const COLOR_ACCENT = rgb(0.92, 0.35, 0.05);

/** The built-in PDF fonts only cover Latin-1, so map common symbols and drop the rest. */
function clean(text: string) {
  return text
    .replace(/₹/g, "Rs ")
    .replace(/[·•]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E¡-ÿ]/g, "")
    .trim();
}

export async function buildItineraryPdf(pkg: TravelPackage, siteUrl: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${clean(pkg.title)} - Itinerary`);
  pdf.setAuthor("Bharath Treks & Tales");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;
  const contentW = PAGE_W - MARGIN * 2;

  const ensure = (needed: number) => {
    if (y - needed < MARGIN + 30) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };

  const wrap = (text: string, font: PDFFont, size: number, width: number) => {
    const lines: string[] = [];
    let line = "";
    for (const word of clean(text).split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= width) {
        line = test;
      } else {
        if (line) lines.push(line);
        // A single very long word: hard-split it.
        let w = word;
        while (font.widthOfTextAtSize(w, size) > width && w.length > 1) {
          let cut = w.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > width) cut--;
          lines.push(w.slice(0, cut));
          w = w.slice(cut);
        }
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const paragraph = (
    text: string,
    opts: { font?: PDFFont; size?: number; indent?: number; color?: ReturnType<typeof rgb>; gap?: number } = {}
  ) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 10.5;
    const indent = opts.indent ?? 0;
    const lineH = size * 1.4;
    for (const line of wrap(text, font, size, contentW - indent)) {
      ensure(lineH);
      y -= lineH;
      page.drawText(line, { x: MARGIN + indent, y, size, font, color: opts.color ?? COLOR_TEXT });
    }
    y -= opts.gap ?? 0;
  };

  const heading = (text: string) => {
    ensure(40);
    y -= 14;
    paragraph(text, { font: bold, size: 13, color: COLOR_ACCENT, gap: 2 });
    page.drawLine({
      start: { x: MARGIN, y: y + 1 },
      end: { x: PAGE_W - MARGIN, y: y + 1 },
      thickness: 0.6,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 4;
  };

  const bullets = (items: string[]) => {
    for (const item of items) {
      const lines = wrap(item, regular, 10.5, contentW - 14);
      if (lines.length === 0) continue;
      ensure(14.7);
      y -= 14.7;
      page.drawText("-", { x: MARGIN + 2, y, size: 10.5, font: bold, color: COLOR_ACCENT });
      page.drawText(lines[0], { x: MARGIN + 14, y, size: 10.5, font: regular, color: COLOR_TEXT });
      for (const extra of lines.slice(1)) {
        ensure(14.7);
        y -= 14.7;
        page.drawText(extra, { x: MARGIN + 14, y, size: 10.5, font: regular, color: COLOR_TEXT });
      }
    }
  };

  // ---- Header ----
  page.drawText("BHARATH TREKS & TALES", { x: MARGIN, y: y - 10, size: 9, font: bold, color: COLOR_ACCENT });
  y -= 24;
  paragraph(pkg.title, { font: bold, size: 22, gap: 2 });
  const sub = [pkg.location, pkg.state].filter(Boolean).join(", ");
  if (sub) paragraph(sub, { color: COLOR_MUTED, size: 11 });
  paragraph(
    [pkg.duration, `${pkg.difficulty} difficulty`, pkg.price ? `Rs ${pkg.discountPrice || pkg.price} per person` : ""]
      .filter(Boolean)
      .join("   |   "),
    { font: bold, size: 10.5, gap: 4 }
  );

  // ---- Facts ----
  const facts: [string, string | undefined][] = [
    ["Departure", pkg.departure],
    ["Return", pkg.returnTime],
    ["Transport", pkg.transportation],
    ["Meals", pkg.meals],
    ["Altitude", pkg.altitude],
    ["Trek distance", pkg.trekDistance && pkg.trekDistance !== "N/A" ? pkg.trekDistance : undefined],
    ["Weather", pkg.weather],
    ["Best season", pkg.bestSeason],
  ];
  const shown = facts.filter(([, v]) => v);
  if (shown.length) {
    heading("Quick facts");
    for (const [label, value] of shown) {
      paragraph(`${label}: ${value}`, { gap: 1 });
    }
  }

  if (pkg.overview) {
    heading("About this trip");
    paragraph(pkg.overview);
  }
  if (pkg.highlights.length) {
    heading("Trip highlights");
    bullets(pkg.highlights);
  }
  if (pkg.itinerary.length) {
    heading("Itinerary");
    for (const step of pkg.itinerary) {
      ensure(32);
      if (step.time) paragraph(step.time, { font: bold, size: 10, color: rgb(0.15, 0.39, 0.92) });
      paragraph(step.activity, { indent: 10, gap: 4 });
    }
  }
  if (pkg.pickupLocations.length) {
    heading("Pickup points");
    bullets(pkg.pickupLocations);
  }
  if (pkg.inclusions.length) {
    heading("Inclusions");
    bullets(pkg.inclusions);
  }
  if (pkg.exclusions.length) {
    heading("Exclusions");
    bullets(pkg.exclusions);
  }
  if (pkg.thingsToCarry.length) {
    heading("Things to carry");
    bullets(pkg.thingsToCarry);
  }
  if (pkg.safetyNotes?.length) {
    heading("Safety & good to know");
    bullets(pkg.safetyNotes);
  }

  // ---- Footer on every page ----
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const text = clean(
      `Bharath Treks & Tales  |  ${CONTACT_PHONE_DISPLAY}  |  ${siteUrl.replace(/^https?:\/\//, "")}  |  Page ${i + 1} of ${pages.length}`
    );
    p.drawText(text, {
      x: (PAGE_W - regular.widthOfTextAtSize(text, 8.5)) / 2,
      y: 26,
      size: 8.5,
      font: regular,
      color: COLOR_MUTED,
    });
  });

  return pdf.save();
}
