import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
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

export async function listAllAdmin<T extends WithStatus>(collectionName: string): Promise<(T & { id: string })[]> {
  const q = query(collection(db, collectionName), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getById<T extends WithStatus>(collectionName: string, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as T) } : null;
}

export async function createDoc<T extends WithStatus>(collectionName: string, data: T): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateDocById<T extends WithStatus>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  const patch: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  if (data.status === "published") patch.publishedAt = serverTimestamp();
  await updateDoc(doc(db, collectionName, id), patch);
}

export async function deleteDocById(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
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

/** Checks whether `slug` is already used by another document in the collection. */
export async function slugExists(collectionName: string, slug: string, excludeId?: string): Promise<boolean> {
  const q = query(collection(db, collectionName), where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}
