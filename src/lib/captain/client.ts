"use client";

/** Calls one of our API routes and returns its JSON, or throws an Error with the server's message. */
export async function api<T = Record<string, unknown>>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: isForm || body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status})`);
  return data;
}

/** Shrinks a phone photo of a bill (long side 1800px, JPEG) so uploads are quick. PDFs pass through. */
export async function compressBill(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;
    return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file; // e.g. a format this browser can't read; the server will say if it isn't allowed
  }
}

/** Today's date in India as YYYY-MM-DD. */
export const todayInIndia = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
