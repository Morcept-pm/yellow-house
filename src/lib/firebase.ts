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

export const app = createApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
