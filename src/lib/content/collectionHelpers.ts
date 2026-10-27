import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import type { PublishStatus } from "../../types/content";

type WithStatus = { status: PublishStatus; slug?: string };

export async function listPublished<T extends WithStatus>(collectionName: string): Promise<(T & { id: string })[]> {
  const q = query(collection(db, collectionName), where("status", "==", "published"), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getPublishedBySlug<T extends WithStatus>(
  collectionName: string,
  slug: string
): Promise<(T & { id: string }) | null> {
  const q = query(collection(db, collectionName), where("status", "==", "published"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as T) };
}






/**
 * Wraps a public-facing read with a bundled fallback value, so a broken or
 * unconfigured Firebase connection still renders demo content instead of an
 * empty section. Triggers on a thrown error, but also on a read that's still
 * pending after `timeoutMs` — a bad project id/API key doesn't reject the
 * Firestore SDK's call, it retries the realtime channel forever, so a plain
 * try/catch never sees a rejection to catch. A successful read that's
 * genuinely empty (no published docs yet) is left as-is.
 */
export async function withFallback<T>(read: () => Promise<T>, fallback: T, timeoutMs = 2500): Promise<T> {
  try {
    return await Promise.race([
      read(),
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore read timed out")), timeoutMs)),
    ]);
  } catch {
    return fallback;
  }
}

