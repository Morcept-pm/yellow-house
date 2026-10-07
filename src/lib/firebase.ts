import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** True once real Firebase project values (not the .env.example placeholders) are present. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/**
 * Stand-in config used when no VITE_FIREBASE_* values are present (preview
 * mode). The SDK validates the API key shape eagerly — `getAuth()` on an app
 * with an empty `apiKey` throws `auth/invalid-api-key` at module load, which
 * used to take the whole site down with a blank page instead of just leaving
 * the content layer without a backend. Nothing here ever reaches the network:
 * every read is short-circuited to bundled demo content while
 * `isFirebaseConfigured` is false.
 */
const PREVIEW_CONFIG = {
  apiKey: "preview-mode-no-backend",
  authDomain: "preview.invalid",
  projectId: "yellow-house-preview",
  storageBucket: "preview.invalid",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:preview",
};

function createApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length) return existing[0];
  if (!isFirebaseConfigured) {
    // eslint-disable-next-line no-console
    console.info(
      "[firebase] Preview mode: no VITE_FIREBASE_* environment variables found, so the site renders bundled demo content and /admin is disabled. To connect a real backend, copy .env.example to .env, fill in your Firebase project's Web SDK config, and restart the dev server."
    );
    return initializeApp(PREVIEW_CONFIG);
  }
  return initializeApp(firebaseConfig);
}

export const app = createApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/** Thrown by write paths (contact form, admin sign-in) while running without a backend. */
export class PreviewModeError extends Error {
  constructor(message = "Firebase is not configured — running in preview mode.") {
    super(message);
    this.name = "PreviewModeError";
  }
}
