import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Env values pasted into a hosting dashboard sometimes keep the `KEY=` line's
 * "=" or surrounding whitespace — the production build once shipped with
 * projectId "=yellow-house-site", which silently pointed every read at a
 * project that doesn't exist and left the site on bundled demo content.
 * Strip that here and say so loudly, rather than failing invisibly again.
 */
function clean(name: string, raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const value = raw.trim().replace(/^=+/, "").trim();
  if (value !== raw) {
    // eslint-disable-next-line no-console
    console.warn(`[firebase] ${name} had stray "=" or whitespace; fix the value in the hosting env settings.`);
  }
  return value;
}

const env = import.meta.env;
const firebaseConfig = {
  apiKey: clean("VITE_FIREBASE_API_KEY", env.VITE_FIREBASE_API_KEY),
  authDomain: clean("VITE_FIREBASE_AUTH_DOMAIN", env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean("VITE_FIREBASE_PROJECT_ID", env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean("VITE_FIREBASE_STORAGE_BUCKET", env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean("VITE_FIREBASE_MESSAGING_SENDER_ID", env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean("VITE_FIREBASE_APP_ID", env.VITE_FIREBASE_APP_ID),
};

/** True once real Firebase project values (not the .env.example placeholders) are present. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function createApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length) return existing[0];
  if (!isFirebaseConfigured) {
    // eslint-disable-next-line no-console
    console.error(
      "[firebase] Missing VITE_FIREBASE_* environment variables. Copy .env.example to .env, fill in your Firebase project's Web SDK config, and restart the dev server."
    );
  }
  return initializeApp(firebaseConfig);
}

// The public site only reads Firestore (and writes contact-form submissions);
// login and uploads live in the separate yellow-house-admin app.
export const app = createApp();
export const db = getFirestore(app);
