// PLACEHOLDER photos (stock images already used elsewhere on the site).
// Replace with real trip photos: put files in public/past-trips/<slug>/ and point `image` / `gallery` at them.
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;

export const PLACEHOLDER = {
  temple: unsplash("photo-1590050752117-238cb0fb12b1"),
  mountain: unsplash("photo-1464822759023-fed622ff2c3b"),
  mist: unsplash("photo-1519681393784-d120267933ba"),
  waterfall: unsplash("photo-1500534623283-312aade485b7"),
  camp: unsplash("photo-1476514525535-07fb3b4ae5f1"),
  kerala: unsplash("photo-1608889825205-eebdb9fc5806"),
};

type Kind = keyof typeof PLACEHOLDER;

/** Cover + 3-photo gallery built from the placeholder pool. */
export function placeholderPhotos(cover: Kind, ...gallery: [Kind, Kind, Kind]) {
  return { image: PLACEHOLDER[cover], gallery: gallery.map((k) => PLACEHOLDER[k]) };
}
