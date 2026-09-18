import { collection, addDoc, getDocs, doc, updateDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { FormSubmission, FormSubmissionDoc, SubmissionStatus } from "../../types/content";

const COLLECTION = "form_submissions";
const RATE_LIMIT_KEY = "yh_last_submit_at";
const RATE_LIMIT_MS = 30_000;

export interface ContactFormInput {
  company: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  propertySlug?: string | null;
  consent: boolean;
  /** Honeypot field: must arrive empty. A filled value means a bot filled every field. */
  website: string;
}

export class SpamRejectedError extends Error {}
export class RateLimitedError extends Error {}

/**
 * Public write only (Firestore rules allow create, deny read/update/delete for
 * non-admins). Anti-spam: honeypot field + a soft client-side cooldown. For
 * stronger protection, wire up Firebase App Check with a reCAPTCHA key — see
 * README "表單防灌水" section (requires a credential we don't have yet).
 */
export async function submitContactForm(input: ContactFormInput): Promise<void> {
  if (input.website.trim().length > 0) {
    throw new SpamRejectedError("honeypot triggered");
  }

  try {
    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? "0");
    if (Date.now() - last < RATE_LIMIT_MS) {
      throw new RateLimitedError("submitted too recently");
    }
  } catch {
    // localStorage unavailable — skip the soft rate limit, rely on honeypot only.
  }

  const payload: Omit<FormSubmissionDoc, "createdAt" | "updatedAt"> = {
    company: input.company.trim(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    type: input.type,
    message: input.message.trim(),
    propertySlug: input.propertySlug ?? null,
    consent: input.consent,
    status: "new",
  };

  await addDoc(collection(db, COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

export async function listSubmissionsAdmin(): Promise<FormSubmission[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as FormSubmissionDoc) }));
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
}
