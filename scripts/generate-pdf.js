const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'Bharath_Treks_Flow_3Page.pdf');

// Colors
const C = {
  navy: '#1e3a8a',
  navy2: '#1e40af',
  blue: '#2563eb',
  blueLight: '#eff6ff',
  blueBorder: '#bfdbfe',
  purple: '#7c3aed',
  purpleLight: '#f5f3ff',
  purpleBorder: '#ddd6fe',
  orange: '#ea580c',
  orangeLight: '#fff7ed',
  orangeBorder: '#fed7aa',
  green: '#16a34a',
  greenLight: '#f0fdf4',
  greenBorder: '#bbf7d0',
  greenDark: '#166534',
  teal: '#0e7490',
  tealLight: '#ecfeff',
  pink: '#db2777',
  pinkLight: '#fdf2f8',
  gray: '#475569',
  grayLight: '#f8fafc',
  grayBorder: '#cbd5e1',
  grayText: '#64748b',
  lightText: '#94a3b8',
  slategray: '#64748b',
};

function headerBar(doc, title, subtitle) {
  // navy header 0,0,595,46
  doc.save().rect(0, 0, 595.28, 46).fill(C.navy);
  doc.fillColor('white').font('Helvetica-Bold').fontSize(13).text(title, 0, 16, { align: 'center', width: 595.28 });
  doc.fillColor('#93c5fd').font('Helvetica').fontSize(7).text(subtitle, 0, 32, { align: 'center', width: 595.28 });
  doc.restore();
}

function footerBar(doc, pageNum) {
  doc.save().rect(0, 825, 595.28, 17).fill(C.navy);
  doc.fillColor('#93c5fd').font('Helvetica').fontSize(6).text('Bharath Treks & Tales  —  Next.js 15  •  React 19  •  Tailwind 4  •  Express + SQLite  •  Zustand', 0, 831, { align: 'center', width: 595.28 });
  doc.restore();
  // page number right
  doc.fillColor(C.lightText).font('Helvetica').fontSize(6).text(`Page ${pageNum} of 3`, 500, 812, { width: 70, align: 'right' });
}

function roundedBox(doc, x, y, w, h, r, fill, stroke, strokeWidth = 1) {
  doc.save().roundedRect(x, y, w, h, r).fillAndStroke(fill, stroke);
  doc.lineWidth(strokeWidth);
  doc.restore();
}

function arrowRight(doc, x1, y, x2, color, width = 1.2) {
  doc.save().strokeColor(color).lineWidth(width).lineCap('round');
  doc.moveTo(x1, y).lineTo(x2 - 6, y).stroke();
  // triangle
  doc.fillColor(color);
  doc.moveTo(x2, y).lineTo(x2 - 7, y - 3.5).lineTo(x2 - 7, y + 3.5).fill();
  doc.restore();
}
function arrowDown(doc, x, y1, y2, color, width = 1.2) {
  doc.save().strokeColor(color).lineWidth(width).lineCap('round');
  doc.moveTo(x, y1).lineTo(x, y2 - 6).stroke();
  doc.fillColor(color);
  doc.moveTo(x, y2).lineTo(x - 3.5, y2 - 7).lineTo(x + 3.5, y2 - 7).fill();
  doc.restore();
}
function arrowCurve(doc, x1, y1, cx, cy, x2, y2, color) {
  doc.save().strokeColor(color).lineWidth(1.2).lineCap('round');
  doc.moveTo(x1, y1).quadraticCurveTo(cx, cy, x2, y2).stroke();
  // small arrow head pointing toward x2,y2 - approximate
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const len = 7;
  doc.fillColor(color);
  doc.moveTo(x2, y2).lineTo(x2 - len * Math.cos(ang - 0.45), y2 - len * Math.sin(ang - 0.45)).lineTo(x2 - len * Math.cos(ang + 0.45), y2 - len * Math.sin(ang + 0.45)).fill();
  doc.restore();
}

function gen() {
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // ================= PAGE 1 : USER FLOW DIAGRAM =================
  doc.addPage({ size: 'A4', margin: 0 });
  headerBar(doc, 'Bharath Treks & Tales', 'User Flow Diagram  •  Fixed & De-cluttered  •  Page 1 of 3');
  footerBar(doc, 1);

  // title under header
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8).text('1. USER FLOW — PAGE-BY-PAGE NAVIGATION MAP', 22, 56);
  doc.save().strokeColor(C.blue).lineWidth(0.7).moveTo(22, 66).lineTo(300, 66).stroke().restore();
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6.5).text('First-visit → Home hub → Browse → Detail/Booking → Explore/Past Trips → Auth → Static  •  No crossing arrows •  Print-ready vector', 22, 69, { width: 551 });

  // --- LANDING ---
  const ly = 82;
  // Hero3DIntro
  roundedBox(doc, 22, ly, 150, 52, 7, 'white', C.blue, 1);
  doc.save().roundedRect(22, ly, 150, 6, 4).fill(C.blue).restore();
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(7.5).text('Hero3DIntro', 22, ly + 15, { width: 150, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('Cinematic scroll parallax', 22, ly + 25, { width: 150, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('5 layers + temple + moon', 22, ly + 32, { width: 150, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5.5).text('First-time visitors only  •  hasEnteredSite=false', 22, ly + 42, { width: 150, align: 'center' });
  arrowRight(doc, 172, ly + 26, 202, C.blue);
  // Category Select
  roundedBox(doc, 202, ly, 150, 52, 7, 'white', C.blue, 1);
  doc.save().roundedRect(202, ly, 150, 6, 4).fill(C.blue).restore();
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(7.5).text('Category Select', 202, ly + 15, { width: 150, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('8 cards: Trekking, Spiritual...', 202, ly + 25, { width: 150, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('Pick a category or press Skip', 202, ly + 32, { width: 150, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5.5).text('Zustand  selectedCategory  +  enterSite()', 202, ly + 42, { width: 150, align: 'center' });
  arrowRight(doc, 352, ly + 26, 382, C.blue);
  doc.save().strokeColor('#9ca3af').lineWidth(0.9).dash(3, { space: 2 }).moveTo(277, ly + 52).quadraticCurveTo(277, ly + 64, 382, ly + 64).stroke().undash().restore();
  doc.fillColor('#9ca3af').font('Helvetica').fontSize(5.5).text('skip', 325, ly + 57);
  // tiny arrow for skip
  doc.save().fillColor('#9ca3af').moveTo(382, ly + 64).lineTo(376, ly + 61).lineTo(376, ly + 67).fill().restore();

  // --- HOME ---
  const hy = 146;
  roundedBox(doc, 382, hy, 191, 128, 9, 'white', C.navy, 1.6);
  doc.save().roundedRect(382, hy, 191, 22, 6).fill(C.navy).restore();
  doc.save().rect(382, hy + 12, 191, 10).fill(C.navy).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(8.5).text('HOME  —  /', 382, hy + 9, { width: 191, align: 'center' });
  doc.fillColor('white').font('Helvetica').fontSize(5).text('Central hub', 382, hy + 16, { width: 191, align: 'center' });

  // inside HOME 2x4 mini grid simplified
  const hx = 390;
  function homeChip(x, y, w, title) {
    roundedBox(doc, x, y, w, 18, 4, C.blueLight, C.blueBorder, 0.6);
    doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(5.2).text(title, x, y + 7, { width: w, align: 'center' });
  }
  homeChip(hx, hy + 30, 88, 'HeroSection (Search)');
  homeChip(hx + 92, hy + 30, 88, 'Popular Destinations');
  homeChip(hx, hy + 51, 88, 'Trending ×4 (carousel)');
  homeChip(hx + 92, hy + 51, 88, 'Stats + Why Us');
  homeChip(hx, hy + 72, 88, 'Testimonials + Gallery');
  homeChip(hx + 92, hy + 72, 88, 'FAQ + Newsletter');
  // fine print arrows
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('Search → /packages?query  •  Chips → ?category  •  “View All” → /packages', hx, hy + 95, { width: 175, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5).text('API: GET /api/packages  •  Zustand: selectedCategory', hx, hy + 108, { width: 175, align: 'center' });

  // Arrows HOME -> next level (clean, no crossing)
  // HOME bottom center to each target top
  // to Packages
  doc.save().strokeColor(C.blue).lineWidth(1).moveTo(410, hy + 128).lineTo(410, 290).lineTo(105, 290).lineTo(105, 308).stroke().restore();
  doc.save().fillColor(C.blue).moveTo(105, 308).lineTo(102, 302).lineTo(108, 302).fill().restore();
  doc.fillColor(C.blue).font('Helvetica').fontSize(5).text('View All / Search', 125, 286);

  // to Explore
  doc.save().strokeColor(C.purple).lineWidth(1).moveTo(475, hy + 128).lineTo(475, 292).lineTo(298, 292).lineTo(298, 308).stroke().restore();
  doc.save().fillColor(C.purple).moveTo(298, 308).lineTo(295, 302).lineTo(301, 302).fill().restore();
  doc.fillColor(C.purple).font('Helvetica').fontSize(5).text('Header “Explore Map”', 335, 286);

  // to Past Trips
  doc.save().strokeColor(C.green).lineWidth(1).moveTo(520, hy + 128).lineTo(520, 292).lineTo(435, 292).lineTo(435, 308).stroke().restore();
  doc.save().fillColor(C.green).moveTo(435, 308).lineTo(432, 302).lineTo(438, 302).fill().restore();
  doc.fillColor(C.green).font('Helvetica').fontSize(5).text('Past Trips', 445, 286);

  // to Auth - right side vertical drop
  doc.save().strokeColor(C.teal).lineWidth(1).moveTo(545, hy + 128).lineTo(545, 292).lineTo(545, 308).stroke().restore();
  // combined arrow to login/signup cluster
  doc.save().strokeColor(C.teal).lineWidth(0.8).moveTo(545, 310).lineTo(485, 310).lineTo(485, 320).stroke().restore();
  doc.save().strokeColor(C.teal).lineWidth(0.8).moveTo(545, 310).lineTo(565, 310).lineTo(565, 320).stroke().restore();
  doc.fillColor(C.teal).font('Helvetica').fontSize(5).text('Login / Signup / Profile / Wishlist', 475, 300);

  // ===== ROW 2: BROWSE =====
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(6.8).text('2. BROWSE TRIPS', 22, 285);
  doc.save().strokeColor(C.blue).lineWidth(0.6).moveTo(22, 292).lineTo(150, 292).stroke().restore();

  // Packages
  roundedBox(doc, 22, 310, 170, 86, 8, 'white', C.blue, 1.2);
  doc.save().roundedRect(22, 310, 170, 18, 5).fill(C.blue).restore();
  doc.save().rect(22, 320, 170, 8).fill(C.blue).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(7.5).text('/packages', 22, 317, { width: 170, align: 'center' });
  roundedBox(doc, 29, 336, 78, 22, 4, C.blueLight, C.blueBorder, 0.5);
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(5.3).text('Search + Filters', 29, 342, { width: 78, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('text • category • state', 29, 350, { width: 78, align: 'center' });
  roundedBox(doc, 112, 336, 73, 22, 4, C.blueLight, C.blueBorder, 0.5);
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(5.3).text('Duration • Budget', 112, 342, { width: 73, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('weekend • slider', 112, 350, { width: 73, align: 'center' });
  roundedBox(doc, 29, 363, 156, 14, 4, '#e2e8f0', '#e2e8f0', 0.3);
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('API: GET /api/packages?category=&state=&difficulty=', 29, 367, { width: 156, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(4.8).text('PackageCard grid • wishlist ♥ • share • “Book Now”', 29, 381, { width: 156, align: 'center' });

  // Explore
  roundedBox(doc, 210, 310, 160, 86, 8, 'white', C.purple, 1.2);
  doc.save().roundedRect(210, 310, 160, 18, 5).fill(C.purple).restore();
  doc.save().rect(210, 320, 160, 8).fill(C.purple).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(7.5).text('/explore', 210, 317, { width: 160, align: 'center' });
  roundedBox(doc, 217, 336, 72, 22, 4, C.purpleLight, C.purpleBorder, 0.5);
  doc.fillColor('#5b21b6').font('Helvetica-Bold').fontSize(5.6).text('IndiaMap (SVG)', 217, 342, { width: 72, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('hover tooltip', 217, 350, { width: 72, align: 'center' });
  roundedBox(doc, 293, 336, 70, 22, 4, C.purpleLight, C.purpleBorder, 0.5);
  doc.fillColor('#5b21b6').font('Helvetica-Bold').fontSize(5.6).text('State Results', 293, 342, { width: 70, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('trip count • dates', 293, 350, { width: 70, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('5 states: TN • KA • KL • AP • MH   → PackageCard grid', 217, 367, { width: 146, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5).text('API: GET /api/explore/states  +  /states/:state/summary', 217, 380, { width: 146, align: 'center' });

  // Past Trips
  roundedBox(doc, 388, 310, 165, 86, 8, 'white', C.green, 1.2);
  doc.save().roundedRect(388, 310, 165, 18, 5).fill(C.green).restore();
  doc.save().rect(388, 320, 165, 8).fill(C.green).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(7.5).text('/past-trips', 388, 317, { width: 165, align: 'center' });
  roundedBox(doc, 395, 336, 72, 22, 4, C.greenLight, C.greenBorder, 0.5);
  doc.fillColor(C.greenDark).font('Helvetica-Bold').fontSize(5.6).text('PastTripCard', 395, 343, { width: 72, align: 'center' });
  roundedBox(doc, 472, 336, 72, 22, 4, C.greenLight, C.greenBorder, 0.5);
  doc.fillColor(C.greenDark).font('Helvetica-Bold').fontSize(5.6).text('Grid listing', 472, 343, { width: 72, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('Completed-trip reports  •  local fallback', 395, 365, { width: 150, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5).text('API: GET /api/completed-trips  (+ /:slug)', 395, 380, { width: 150, align: 'center' });

  // arrows from browse to detail
  arrowDown(doc, 107, 396, 414, C.blue);
  doc.fillColor(C.blue).font('Helvetica').fontSize(5).text('click PackageCard', 114, 404);
  // Explore -> detail dashed
  doc.save().strokeColor(C.blue).lineWidth(0.8).dash(2, { space: 2 }).moveTo(290, 396).lineTo(107, 425).stroke().undash().restore();
  doc.save().fillColor(C.blue).moveTo(107, 425).lineTo(104, 420).lineTo(110, 419).fill().restore();
  doc.fillColor(C.blue).font('Helvetica').fontSize(5).text('StateResults → card', 185, 412);
  // Past -> detail vertical
  arrowDown(doc, 470, 396, 414, C.green);
  doc.fillColor(C.green).font('Helvetica').fontSize(5).text('open report', 478, 404);

  // ===== ROW 3: DETAIL & BOOKING & AUTH =====
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(6.8).text('3. DETAIL  &  BOOKING  &  AUTH', 22, 417);
  doc.save().strokeColor(C.blue).lineWidth(0.6).moveTo(22, 424).lineTo(220, 424).stroke().restore();
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(6.8).text('4. AUTH & WISHLIST', 400, 417);
  doc.save().strokeColor(C.teal).lineWidth(0.6).moveTo(400, 424).lineTo(515, 424).stroke().restore();

  // Package Detail
  roundedBox(doc, 22, 430, 170, 96, 8, 'white', C.orange, 1.2);
  doc.save().roundedRect(22, 430, 170, 18, 5).fill(C.orange).restore();
  doc.save().rect(22, 440, 170, 8).fill(C.orange).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(7).text('/packages/[slug]', 22, 437, { width: 170, align: 'center' });
  roundedBox(doc, 29, 455, 78, 18, 4, C.orangeLight, C.orangeBorder, 0.5);
  doc.fillColor('#9a3412').font('Helvetica-Bold').fontSize(5.2).text('Hero + Gallery', 29, 461, { width: 78, align: 'center' });
  roundedBox(doc, 112, 455, 73, 18, 4, C.orangeLight, C.orangeBorder, 0.5);
  doc.fillColor('#9a3412').font('Helvetica-Bold').fontSize(5.2).text('Itinerary • Facts', 112, 461, { width: 73, align: 'center' });
  roundedBox(doc, 29, 477, 156, 12, 4, C.orangeLight, C.orangeBorder, 0.5);
  doc.fillColor('#9a3412').font('Helvetica-Bold').fontSize(5.2).text('Inclusions • Packing • Difficulty', 29, 480, { width: 156, align: 'center' });
  roundedBox(doc, 29, 493, 156, 20, 6, '#dcfce7', C.green, 0.9);
  doc.fillColor(C.greenDark).font('Helvetica-Bold').fontSize(6).text('BookingSidebar (sticky)', 29, 498, { width: 156, align: 'center' });
  doc.fillColor(C.greenDark).font('Helvetica').fontSize(4.8).text('date • pickup • seats • coupon • price • Book Now', 29, 506, { width: 156, align: 'center' });

  // Past Trip Detail
  roundedBox(doc, 210, 430, 160, 96, 8, 'white', C.orange, 1.2);
  doc.save().roundedRect(210, 430, 160, 18, 5).fill(C.orange).restore();
  doc.save().rect(210, 440, 160, 8).fill(C.orange).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(7).text('/past-trips/[slug]', 210, 437, { width: 160, align: 'center' });
  roundedBox(doc, 217, 455, 72, 18, 4, C.orangeLight, C.orangeBorder, 0.5);
  doc.fillColor('#9a3412').font('Helvetica-Bold').fontSize(5.2).text('Hero + Gallery', 217, 461, { width: 72, align: 'center' });
  roundedBox(doc, 293, 455, 70, 18, 4, C.orangeLight, C.orangeBorder, 0.5);
  doc.fillColor('#9a3412').font('Helvetica-Bold').fontSize(5.2).text('Day-by-day', 293, 461, { width: 70, align: 'center' });
  roundedBox(doc, 217, 477, 146, 12, 4, '#dcfce7', C.greenBorder, 0.5);
  doc.fillColor(C.greenDark).font('Helvetica-Bold').fontSize(5.2).text('Related trips + CTA → /packages', 217, 480, { width: 146, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('API: GET /api/completed-trips/:slug', 217, 498, { width: 146, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5).text('404 if slug not found', 217, 509, { width: 146, align: 'center' });

  // Auth cluster 2x2
  // Login
  roundedBox(doc, 388, 430, 80, 44, 6, 'white', C.teal, 0.9);
  doc.save().roundedRect(388, 430, 80, 13, 4).fill(C.teal).restore();
  doc.save().rect(388, 437, 80, 6).fill(C.teal).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6.5).text('/login', 388, 434, { width: 80, align: 'center' });
  doc.fillColor('#1e293b').font('Helvetica').fontSize(5).text('Email + Password', 388, 449, { width: 80, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(4.8).text('POST /api/auth/login', 388, 458, { width: 80, align: 'center' });
  // Signup
  roundedBox(doc, 474, 430, 80, 44, 6, 'white', C.teal, 0.9);
  doc.save().roundedRect(474, 430, 80, 13, 4).fill(C.teal).restore();
  doc.save().rect(474, 437, 80, 6).fill(C.teal).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6.5).text('/signup', 474, 434, { width: 80, align: 'center' });
  doc.fillColor('#1e293b').font('Helvetica').fontSize(5).text('2-step registration', 474, 449, { width: 80, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(4.8).text('POST /api/auth/register', 474, 458, { width: 80, align: 'center' });
  // Profile
  roundedBox(doc, 388, 480, 80, 44, 6, 'white', C.green, 0.9);
  doc.save().roundedRect(388, 480, 80, 13, 4).fill(C.green).restore();
  doc.save().rect(388, 487, 80, 6).fill(C.green).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6.5).text('/profile', 388, 484, { width: 80, align: 'center' });
  doc.fillColor('#1e293b').font('Helvetica').fontSize(5).text('Edit role • phone • bio', 388, 499, { width: 80, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(4.8).text('PUT /api/auth/profile', 388, 508, { width: 80, align: 'center' });
  // Wishlist
  roundedBox(doc, 474, 480, 80, 44, 6, 'white', C.pink, 0.9);
  doc.save().roundedRect(474, 480, 80, 13, 4).fill(C.pink).restore();
  doc.save().rect(474, 487, 80, 6).fill(C.pink).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6.2).text('/dashboard/wishlist', 474, 484, { width: 80, align: 'center' });
  doc.fillColor('#1e293b').font('Helvetica').fontSize(5).text('Zustand + localStore', 474, 499, { width: 80, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(4.8).text('♥ on PackageCard', 474, 508, { width: 80, align: 'center' });

  // Booking flow horizontal below detail
  const by = 538;
  roundedBox(doc, 22, by, 348, 62, 8, 'white', C.green, 1.1);
  doc.save().roundedRect(22, by, 348, 16, 5).fill(C.green).restore();
  doc.save().rect(22, by + 8, 348, 8).fill(C.green).restore();
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6.8).text('BOOKING MODAL  →  CONFIRMATION', 22, by + 6, { width: 348, align: 'center' });
  // steps
  function bStep(x, num, label) {
    roundedBox(doc, x, by + 22, 58, 18, 4, C.greenLight, C.greenBorder, 0.5);
    doc.fillColor(C.greenDark).font('Helvetica-Bold').fontSize(5.2).text(num + '. ' + label, x, by + 28, { width: 58, align: 'center' });
  }
  bStep(30, '1', 'Date (5)');
  bStep(91, '2', 'Pickup');
  bStep(152, '3', 'Seats +/-');
  bStep(213, '4', 'Coupon');
  bStep(274, '5', 'Price → Pay');
  // mini arrows
  for (const ax of [88, 149, 210, 271]) { arrowRight(doc, ax, by + 31, ax + 3, C.green, 0.8); }
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('Form: name • email • phone [6-9][0-9]{9} • requests   →   POST /api/bookings   →   Ref: BTT-<timestamp>', 30, by + 45, { width: 332, align: 'center' });
  doc.fillColor(C.lightText).font('Helvetica').fontSize(4.8).text('Coupon: POST /api/coupons/validate  (fallback TREK5/BTT10)  •  Confirmation shows ref + amount + date/pickup', 30, by + 53, { width: 332, align: 'center' });
  // arrow from Package Detail BookingSidebar to modal
  doc.save().strokeColor(C.green).lineWidth(1).moveTo(107, 526).lineTo(107, 534).lineTo(30, 534).lineTo(30, 538).stroke().restore();
  doc.save().fillColor(C.green).moveTo(30, 538).lineTo(27, 533).lineTo(33, 533).fill().restore();
  doc.fillColor(C.green).font('Helvetica').fontSize(5).text('“Book Now”', 110, 530);

  // Static pages strip
  const sy = 612;
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(6.5).text('ALSO REACHABLE FROM FOOTER / NAV — ON ANY PAGE', 22, sy);
  doc.save().strokeColor(C.grayBorder).lineWidth(0.5).moveTo(22, 622).lineTo(573, 622).stroke().restore();
  roundedBox(doc, 22, 628, 260, 28, 6, '#f1f5f9', C.grayBorder, 0.7);
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(6).text('Static Pages', 22, 633, { width: 260, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5.3).text('About  •  Blog (listing)  •  Careers  •  Contact  •  FAQ  •  404', 22, 642, { width: 260, align: 'center' });
  roundedBox(doc, 293, 628, 260, 28, 6, '#f1f5f9', C.grayBorder, 0.7);
  doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(6).text('Policy Pages', 293, 633, { width: 260, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5.3).text('/policy/privacy  •  /policy/terms  •  /policy/cancellation', 293, 642, { width: 260, align: 'center' });

  // Global bar
  roundedBox(doc, 22, 665, 531, 22, 6, '#0f172a', '#0f172a', 0.5);
  doc.fillColor('white').font('Helvetica-Bold').fontSize(5.5).text('ON EVERY PAGE  →  Header (logo • nav • search • wishlist badge • theme • auth)  +  Footer (links • contact • social)', 22, 673, { width: 531, align: 'center' });

  // Bottom stats bar
  roundedBox(doc, 22, 695, 531, 26, 6, C.navy, C.navy, 0.5);
  doc.fillColor('white').font('Helvetica-Bold').fontSize(6).text('18 Pages   •   31 Components   •   8 Services (17 functions)   •   15 API Endpoints   •   Zustand Persist Store', 22, 705, { width: 531, align: 'center' });
  doc.fillColor('#93c5fd').font('Helvetica').fontSize(5).text('Stack: Next.js 15 • React 19 • Tailwind v4 • Express • SQLite • Framer Motion • Swiper • Zustand', 22, 714, { width: 531, align: 'center' });

  // Legend
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(5).text('Legend:', 22, 730);
  const legs = [
    { c: C.blue, t: 'Browse/Packages' },
    { c: C.purple, t: 'Explore' },
    { c: C.green, t: 'Past Trips / Booking' },
    { c: C.orange, t: 'Detail' },
    { c: C.teal, t: 'Auth' },
    { c: C.pink, t: 'Wishlist' },
    { c: '#475569', t: 'Static/Policy' },
  ];
  let lx = 52;
  for (const l of legs) {
    doc.save().roundedRect(lx, 730, 8, 8, 2).fill(l.c).restore();
    doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text(l.t, lx + 10, 732);
    lx += doc.widthOfString(l.t) + 22;
  }

  // ================= PAGE 2 =================
  doc.addPage({ size: 'A4', margin: 0 });
  headerBar(doc, 'Bharath Treks & Tales', 'Main Pages & Implemented Functions  •  Page 2 of 3  •  Following User-Flow Order');
  footerBar(doc, 2);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9).text('2. MAIN PAGES — WHAT EXISTS & WHAT IT DOES (Implemented)', 22, 56);
  doc.save().strokeColor(C.blue).lineWidth(0.7).moveTo(22, 68).lineTo(330, 68).stroke().restore();
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('Ordered exactly as user travels: Landing → Home → Browse → Detail → Explore → Past Trips → Auth → Wishlist → Static.   Green = fully implemented  •  Amber = partially implemented', 22, 71, { width: 551 });

  // Table header - full width 551
  const t2x = 22, t2w = 551;
  const t2h = 16;
  // columns: # (22), Page (98), Route (88), Functions (245), Status (98)
  const t2Cols = [
    { w: 22, l: '#' },
    { w: 98, l: 'Page' },
    { w: 92, l: 'Route' },
    { w: 241, l: 'Implemented Functions (what user can do)' },
    { w: 98, l: 'Status / API' },
  ];
  let tx = t2x;
  doc.save().roundedRect(t2x, 82, t2w, t2h, 3).fill(C.navy).restore();
  doc.save().rect(t2x, 82 + 8, t2w, 8).fill(C.navy).restore();
  for (const c of t2Cols) {
    doc.fillColor('white').font('Helvetica-Bold').fontSize(6).text(c.l, tx + 3, 87, { width: c.w - 6, align: 'center' });
    tx += c.w;
  }

  const rows2 = [
    ['1', 'Landing — Hero3DIntro', '— (intro overlay)', 'Scroll parallax (5 layers), 3D mouse tilt, temple/moon scene, 60 stars, scroll hint. First-time only (hasEnteredSite).', 'Done  •  decor only'],
    ['2', 'Landing — Category Pick', '— (intro overlay)', '8 CategoryCards (Trek/Spiritual/Solo/Group…), Skip → enterSite(). Sets selectedCategory for Home filters.', 'Done  •  Zustand'],
    ['3', 'Home', '/', 'HeroSection: search (dest/date/travelers) + category chips; PopularDestinations (5 states); TrendingPackages ×4; Stats; WhyUs; Testimonials; Gallery; FAQ accordion; Newsletter.', 'Done  •  GET /packages + POST /newsletter'],
    ['4', 'Packages Listing', '/packages', 'SSR + client filters: text search, category/state/difficulty, duration (1/Wkd/4+d), budget ₹500–10k, weekend toggle. Grid PackageCard (discount badge, wishlist ♥, share, low-seats). Reset.', 'Done  •  GET /api/packages'],
    ['5', 'Package Detail', '/packages/[slug]', 'Hero gallery, quick facts (duration/altitude/weather), highlights/temples, day-by-day itinerary, inclusions/excl., packing list, difficulty meter, 3 related cards. 404 if missing.', 'Done  •  GET /:slug + /related'],
    ['6a', '↳ Booking Sidebar', 'inside [slug]', 'Sticky: date (5 options) • pickup dropdown • seats +/− (cap seatsLeft) • coupon validate • live price (base/savings/discount/total) • Book Now → modal.', 'Done  •  POST /coupons/validate'],
    ['6b', '↳ Booking Modal', 'inside [slug]', 'Form: name, email, phone [6-9][0-9]{9}, requests → Confirm POST /api/bookings → ref BTT-… + amount + date/pickup/seats. Cancel/Done.', 'Done  •  POST /bookings'],
    ['7', 'Explore Map', '/explore', 'Interactive India SVG (by @svg-maps/india), color-coded by availability, hover tooltip (count/dates/temples/treks), click state or quick-jump → StateResultsPanel (summary + package grid).', 'Done  •  GET /explore/states'],
    ['8', 'Past Trips', '/past-trips', 'SSR grid of completed-trip reports (PastTripCard 1/2/3 cols). Click → detail. API + local fallback.', 'Done  •  GET /completed-trips'],
    ['9', 'Past Trip Detail', '/past-trips/[slug]', 'Hero + gallery (3), facts (duration/groups/cost), highlights/temples, full day-by-day border-l timeline, related ×3, CTA “Browse Upcoming → /packages”. 404 if missing.', 'Done  •  GET /:slug'],
    ['10', 'Login', '/login', 'Email + password form, validation, POST /api/auth/login → setAuth(user+JWT) Zustand persist → redirect /. Link to /signup. Error banner.', 'Done  •  POST /auth/login'],
    ['11', 'Signup', '/signup', '2-step: (1) name/email/password+confirm (6ch+, match) → Continue; (2) role Traveller/Vendor/Guide grid, phone digits-only ≤10, city, bio → POST /api/auth/register → auto-login.', 'Done  •  POST /auth/register'],
    ['12', 'Profile', '/profile', 'Auth-guarded (client). View/edit: role buttons, phone (validate 10-d), location, bio → Save PUT /api/auth/profile Bearer → updateUser + 3s success toast. Back button.', 'Done*  •  PUT /profile'],
    ['13', 'Wishlist', '/dashboard/wishlist', 'Shows hearted packages (store.wishlist string[] persisted). Empty state → “Explore Trips → /packages”. Cards have same ♥/share as PackageCard.', 'Done*  •  local only'],
    ['14', 'Static & Policy', '/about /blog /careers /contact /faq /policy/*', 'About (mission/values), Blog (4 cards), Careers (3 + mailto), Contact (form+hours), FAQ (7 accordion), Privacy/Terms/Cancellation (100/50/0% 72h). Footer/Header global.', 'Done*  •  static'],
  ];

  let ry = 98;
  const rowGap = 3;
  function statusDot(color) { return color; }
  for (let i = 0; i < rows2.length; i++) {
    const r = rows2[i];
    // calc height needed for functions column (longest)
    doc.font('Helvetica').fontSize(5.4);
    const funcH = doc.heightOfString(r[3], { width: t2Cols[3].w - 8 });
    const apiH = doc.heightOfString(r[4], { width: t2Cols[4].w - 8 });
    const h = Math.max(22, Math.ceil(Math.max(funcH, apiH)) + 8, 18);
    const isAlt = i % 2 === 0;
    const bg = isAlt ? '#f8fafc' : 'white';
    const border = '#e2e8f0';
    // row bg
    doc.save().roundedRect(t2x, ry, t2w, h, 3).fillAndStroke(bg, border).lineWidth(0.4).restore();
    if (i === 0) doc.save().roundedRect(t2x, ry, t2w, 4, 3).fill(bg).restore();
    // vertical dividers
    let cx = t2x;
    for (let ci = 0; ci < t2Cols.length; ci++) {
      if (ci > 0) doc.save().strokeColor('#e2e8f0').lineWidth(0.5).moveTo(cx, ry).lineTo(cx, ry + h).stroke().restore();
      cx += t2Cols[ci].w;
    }
    // text cells
    let cxx = t2x;
    for (let ci = 0; ci < r.length; ci++) {
      const w = t2Cols[ci].w;
      const align = ci === 0 ? 'center' : (ci === 1 ? 'left' : (ci === 2 ? 'left' : (ci === 3 ? 'left' : 'center')));
      const colText = r[ci];
      let font = 'Helvetica';
      let fcol = '#1e293b';
      let fsize = 5.4;
      if (ci === 0) { font = 'Helvetica-Bold'; fcol = C.navy; fsize = 5.6; }
      if (ci === 1) { font = 'Helvetica-Bold'; fcol = '#1e293b'; fsize = 5.6; }
      if (ci === 2) { font = 'Helvetica'; fcol = '#2563eb'; fsize = 5; }
      if (ci === 4) { font = 'Helvetica'; fcol = isAlt ? C.grayText : '#334155'; fsize = 5; }
      // special styling for * rows
      if ((r[0] === '12' || r[0] === '13' || r[0] === '14') && ci === 4) fcol = '#b45309';
      doc.fillColor(fcol).font(font).fontSize(fsize).text(colText, cxx + 4, ry + 5, { width: w - 8, align });
      cxx += w;
    }
    // status dot
    const dotColor = (r[0] === '12' || r[0] === '13' || r[0] === '14') ? '#f59e0b' : '#16a34a';
    // find status cell x
    let sx = t2x + t2Cols[0].w + t2Cols[1].w + t2Cols[2].w + t2Cols[3].w + 6;
    doc.save().circle(sx, ry + 9, 2.2).fill(dotColor).restore();
    ry += h + 2;
    if (ry > 795) break; // safety
  }
  // footnote
  doc.fillColor(C.lightText).font('Helvetica').fontSize(5).text('* 12 Profile = client guard only (no middleware) • 13 Wishlist = localStorage, no server sync • 14 Blog listing renders but detail 404, Contact is simulated, others fully static.  Header search button & footer social (#) still decorative.', 22, ry + 2, { width: 551 });
  // legend
  doc.save().roundedRect(22, ry + 12, 551, 18, 4).fill('#f1f5f9').stroke('#e2e8f0').restore();
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5.2).text('Reading guide:  Rows 1→14 follow the journey a user actually takes.  implemented = you can click/use it now.  Amber dot = works but needs hardening (see Page 3).  Blue routes are deep-links (?category, ?state).', 28, ry + 18, { width: 539, align: 'center' });

  // ================= PAGE 3 =================
  doc.addPage({ size: 'A4', margin: 0 });
  headerBar(doc, 'Bharath Treks & Tales', 'Gaps, Fixes & New Pages — What To Build Next  •  Page 3 of 3  •  In User-Flow Order');
  footerBar(doc, 3);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9).text('3. WHAT STILL NEEDS WORK — GAPS & NEW PAGES (In User-Flow Order)', 22, 56);
  doc.save().strokeColor('#dc2626').lineWidth(0.7).moveTo(22, 68).lineTo(420, 68).stroke().restore();
  doc.fillColor(C.grayText).font('Helvetica').fontSize(6).text('Red = missing/broken   •   Amber = partial/stub   •   Build order = follow the journey top→down so earliest friction is fixed first.', 22, 71, { width: 551 });

  // --- TABLE A: Existing pages needing fixes ---
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(7).text('A. EXISTING PAGES — FUNCTIONS TO IMPLEMENT / FIX', 22, 84);
  doc.fillColor('#dc2626').font('Helvetica').fontSize(5.5).text('Follow user journey: if the first search is broken, users never reach booking.', 280, 86);

  const ax = 22, aw = 551;
  const aCols = [
    { w: 28, l: '#', a: 'center' },
    { w: 78, l: 'Page (Route)', a: 'center' },
    { w: 205, l: 'Gap / What Is Broken or Stubbed', a: 'left' },
    { w: 160, l: 'Fix Required', a: 'left' },
    { w: 80, l: 'Priority', a: 'center' },
  ];
  let axx = ax;
  doc.save().roundedRect(ax, 93, aw, 13, 3).fill('#991b1b').restore();
  axx = ax;
  for (const c of aCols) {
    doc.fillColor('white').font('Helvetica-Bold').fontSize(5.8).text(c.l, axx + 2, 97, { width: c.w - 4, align: c.a });
    axx += c.w;
  }

  const rowsA = [
    ['1', 'Home\nHero search', 'Destination ✓ but date & travelers params are pushed (/packages?query & date & travelers) and then ignored. PackagesExplorer + backend packages.ts ignore them. User sees unfiltered results.', 'Wire date/travelers: add date availability + group-size to DB/API filter (or remove fields if not needed). Update PackagesExplorer to read URLSearchParams.', 'High'],
    ['2', 'Header\n(all pages)', 'Search magnifier button aria-label="Search" has no onClick — decorative. Footer social (Instagram/Facebook/YouTube) href="#" and InstagramGallery “#” — dead links.', 'Add global search modal (reuse Packages search) + real social URLs or hide until ready. File Header.tsx:79, Footer.tsx:58.', 'High'],
    ['3', 'Packages\nDetail — Booking', 'Booking works end-to-end but: (a) no payment gateway (“Secure payments UPI/Cards” is copy), status instantly CONFIRMED; (b) 5 departure dates hardcoded in BookingSidebar.tsx:12, not from package/DB.', 'Integrate Razorpay / Stripe / UPI intent + webhook; change status to PENDING→CONFIRMED on payment. Load dates from package.departures.', 'High'],
    ['4', 'Contact\n/contact', '“Send Message” is simulated — handleSubmit does setTimeout 1000 → setSent(true), no fetch, no validation beyond required, no API row in backend.', 'Create POST /api/contact, store in DB + email notify, add Zod validation, rate limit.', 'Medium'],
    ['5', 'Blog\n/blog', 'Listing renders 4 hardcoded posts, but every “Read more →” links to /blog/[slug] which does not exist (glob shows no src/app/blog/[slug]/page.tsx) → 404.', 'Build /blog/[slug] (Markdown/MDX or CMS) + generateStaticParams; or disable links until ready.', 'Medium'],
    ['6', 'Wishlist\n/dashboard/wishlist', 'Persisted to Zustand localStorage only (store.ts:49). Filtering uses local lib/data.ts not API, so server-sourced packages never appear. No sync across devices.', 'Add backend wishlist table + GET/POST /api/wishlist (JWT), hydrate on login, optimistic UI.', 'Medium'],
    ['7', 'Profile & Auth\nguards', 'No src/middleware.ts. /profile & /dashboard/wishlist use client if(!user) return “Please log in” — direct navigation not protected server-side; JWT exists backend but not enforced by Next.', 'Add middleware.ts auth guard + GET /api/auth/me hydration; protect dashboard routes; add /forgot-password.', 'Medium'],
    ['8', 'Global\n(categories)', 'categoriesService GET /api/categories exists (backend mounted) but is never imported on frontend — dead code. Also GET /api/auth/me & GET /bookings/:ref unused.', 'Either wire categories to filters or remove service; wire “View booking by ref” page.', 'Low'],
  ];

  let ry3 = 106;
  const priColors = { High: '#dc2626', Medium: '#d97706', Low: '#475569' };
  const priBg = { High: '#fef2f2', Medium: '#fffbeb', Low: '#f8fafc' };

  for (let i = 0; i < rowsA.length; i++) {
    const r = rowsA[i];
    // compute height: longest of gap/fix
    doc.font('Helvetica').fontSize(5.2);
    const gapH = doc.heightOfString(r[2], { width: aCols[2].w - 6 });
    const fixH = doc.heightOfString(r[3], { width: aCols[3].w - 6 });
    const h = Math.max(28, Math.ceil(Math.max(gapH, fixH)) + 12);
    const bg = i % 2 === 0 ? '#ffffff' : '#fff7ed';
    doc.save().rect(ax, ry3, aw, h).fill(bg).stroke('#e2e8f0').lineWidth(0.4).stroke().restore();
    // vertical lines
    let cx = ax;
    for (let ci = 0; ci < aCols.length; ci++) {
      if (ci > 0) doc.save().strokeColor('#e2e8f0').lineWidth(0.4).moveTo(cx, ry3).lineTo(cx, ry3 + h).stroke().restore();
      cx += aCols[ci].w;
    }
    // page/route cell
    let cxx = ax;
    for (let ci = 0; ci < r.length; ci++) {
      const w = aCols[ci].w;
      let fcol = '#1e293b', font = 'Helvetica', fsize = 5.2;
      if (ci === 0) { font = 'Helvetica-Bold'; fcol = C.navy; }
      if (ci === 1) { font = 'Helvetica-Bold'; fcol = '#1e293b'; }
      if (ci === 4) {
        const c = priColors[r[4]] || '#475569';
        const bgc = priBg[r[4]] || '#f8fafc';
        const bw = w - 10, bx = cxx + 5, by = ry3 + h / 2 - 7;
        doc.save().roundedRect(bx, by, bw, 14, 7).fillAndStroke(bgc, c).lineWidth(0.7).restore();
        doc.fillColor(c).font('Helvetica-Bold').fontSize(5.5).text(r[ci], bx, by + 4.5, { width: bw, align: 'center' });
        cxx += w; continue;
      }
      doc.fillColor(fcol).font(font).fontSize(fsize).text(r[ci], cxx + 3, ry3 + 4, { width: w - 6, align: aCols[ci].a === 'center' ? 'center' : 'left' });
      cxx += w;
    }
    ry3 += h + 1;
  }

  // --- TABLE B: New pages ---
  ry3 += 4;
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(7).text('B. NEW PAGES TO CREATE — FOR A COMPLETE WORKFLOW', 22, ry3);
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5.5).text('Added in user-journey order — build top rows first, bottom rows last.  Endpoint hints in Fix column.', 300, ry3 + 2);
  ry3 += 10;

  const bx = 22, bw = 551;
  const bCols = [
    { w: 32, l: 'Flow #', a: 'center' },
    { w: 110, l: 'New Page (Route)', a: 'left' },
    { w: 225, l: 'Purpose — Why It Improves the Journey', a: 'left' },
    { w: 104, l: 'Depends On / API', a: 'left' },
    { w: 80, l: 'Priority', a: 'center' },
  ];
  let bxx = bx;
  doc.save().roundedRect(bx, ry3, bw, 13, 3).fill(C.navy).restore();
  bxx = bx;
  for (const c of bCols) {
    doc.fillColor('white').font('Helvetica-Bold').fontSize(5.8).text(c.l, bxx + 2, ry3 + 4, { width: c.w - 4, align: c.a });
    bxx += c.w;
  }
  ry3 += 14;

  const rowsB = [
    ['3→4', '/blog/[slug]', 'Article detail so Blog cards stop 404ing. SEO long-form content drives discovery → packages CTA.', 'MDX/CMS + GET /api/posts/:slug', 'High'],
    ['6b→', '/checkout/payment', 'Real payment before CONFIRMED. Replace copy with Razorpay Checkout / UPI collect + webhook status.', 'POST /api/checkout + webhook', 'High'],
    ['6b→', '/dashboard/bookings\n/bookings/[ref]', '“My bookings” list + detail by ref. Backend GET /api/bookings/:ref already exists but unused.', 'GET /api/bookings (list) + /:ref', 'High'],
    ['6b→', '/dashboard/orders', 'Order history, invoices, cancellation (policy tiers 100/50/0% <72h). Link from confirmation email.', 'GET /api/orders + PUT /cancel', 'Medium'],
    ['Any', '/search (global)', 'Header magnifier currently dead. Dedicated search with autocomplete (packages + blogs).', 'GET /api/search?q=', 'Medium'],
    ['10→', '/forgot-password\n/reset', 'Auth recovery — login page has no “Forgot?” link.', 'POST /api/auth/forgot', 'Medium'],
    ['Admin', '/admin/packages\n/admin/bookings', 'Vendor/Guide/Admin role dashboards — currently roles are only a label on signup.', 'Role-based middleware', 'Low'],
    ['—', 'Email/WhatsApp\nnotification', 'Booking confirmation, payment receipt, trip reminders — currently only on-screen ref.', 'Queue + templates', 'Low'],
  ];

  for (let i = 0; i < rowsB.length; i++) {
    const r = rowsB[i];
    doc.font('Helvetica').fontSize(5.2);
    const purpH = doc.heightOfString(r[2], { width: bCols[2].w - 6 });
    const h = Math.max(20, Math.ceil(purpH) + 10);
    const bg = i % 2 === 0 ? '#f8fafc' : 'white';
    doc.save().rect(bx, ry3, bw, h).fill(bg).stroke('#e2e8f0').lineWidth(0.4).stroke().restore();
    let cx = bx;
    for (let ci = 0; ci < bCols.length; ci++) {
      if (ci > 0) doc.save().strokeColor('#e2e8f0').lineWidth(0.4).moveTo(cx, ry3).lineTo(cx, ry3 + h).stroke().restore();
      cx += bCols[ci].w;
    }
    let cxx = bx;
    for (let ci = 0; ci < r.length; ci++) {
      const w = bCols[ci].w;
      if (ci === 4) {
        const c = priColors[r[4]] || '#475569';
        const bgc = priBg[r[4]] || '#f8fafc';
        const bw2 = w - 10, bx2 = cxx + 5, by2 = ry3 + h / 2 - 7;
        doc.save().roundedRect(bx2, by2, bw2, 14, 7).fillAndStroke(bgc, c).lineWidth(0.7).restore();
        doc.fillColor(c).font('Helvetica-Bold').fontSize(5.5).text(r[ci], bx2, by2 + 4.5, { width: bw2, align: 'center' });
        cxx += w; continue;
      }
      let fcol = '#1e293b', font = 'Helvetica';
      if (ci === 0) { font = 'Helvetica-Bold'; fcol = C.navy; }
      if (ci === 1) { font = 'Helvetica-Bold'; fcol = '#2563eb'; }
      doc.fillColor(fcol).font(font).fontSize(5.2).text(r[ci], cxx + 3, ry3 + 4, { width: w - 6, align: bCols[ci].a === 'center' ? 'center' : 'left' });
      cxx += w;
    }
    ry3 += h + 1;
  }

  // bottom recommendation box
  ry3 += 3;
  doc.save().roundedRect(22, ry3, 551, 30, 6).fill('#eff6ff').stroke(C.blueBorder).lineWidth(0.6).restore();
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(5.8).text('Recommended build order (respecting user flow):  1) Fix header search + wire Hero date/travelers  2) Build /blog/[slug]  3) Add payment gateway  4) Ship /dashboard/bookings (reuse existing GET /:ref)  5) Real Contact API + Wishlist sync  6) Middleware + forgot-password  →  then polish offline coup fallback & static policy copy.', 28, ry3 + 6, { width: 539, align: 'center' });
  doc.fillColor(C.grayText).font('Helvetica').fontSize(5).text('Sources:  src/app/**/page.tsx  •  src/components/**  •  src/services/**  •  backend/src/routes/**  •  Verified stub locations in code comments above.', 22, ry3 + 22, { width: 551, align: 'center' });

  doc.end();
  stream.on('finish', () => {
    const stat = fs.statSync(outPath);
    console.log('PDF generated:', outPath, (stat.size / 1024).toFixed(1) + ' KB');
  });
}

gen();
