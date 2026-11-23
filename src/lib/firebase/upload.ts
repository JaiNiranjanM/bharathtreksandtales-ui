"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { clientAuth, clientStorage } from "./client";
import type { UploadedFileRef } from "../trip-schema";

function safeName(name: string) {
  return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(-80);
}

function ensureSignedIn() {
  if (!clientAuth().currentUser) {
    throw new Error("Your login session expired. Please sign in again.");
  }
}

/** Uploads an itinerary file for AI processing (kept private, read by the server). */
export async function uploadSourceFile(tripId: string, file: File): Promise<UploadedFileRef> {
  ensureSignedIn();
  const path = `trips/${tripId}/source/${Date.now()}-${safeName(file.name)}`;
  await uploadBytes(ref(clientStorage(), path), file, { contentType: file.type });
  return { path, name: file.name, contentType: file.type || "application/octet-stream" };
}

/** Uploads a trip photo and returns its public download URL. */
export async function uploadPhoto(tripId: string, file: File): Promise<string> {
  ensureSignedIn();
  const path = `trips/${tripId}/photos/${Date.now()}-${safeName(file.name)}`;
  const snapshot = await uploadBytes(ref(clientStorage(), path), file, {
    contentType: file.type,
    cacheControl: "public, max-age=31536000",
  });
  return getDownloadURL(snapshot.ref);
}

export function newTripId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
}
