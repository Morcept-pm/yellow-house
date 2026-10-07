import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, isFirebaseConfigured, PreviewModeError } from "./firebase";
import type { AdminUserDoc } from "../types/content";

interface AuthContextType {
  /** undefined = still resolving initial auth state */
  user: User | null | undefined;
  /** The matching admin_users/{uid} doc. null once resolved if the user has no admin doc or it is inactive. */
  adminProfile: AdminUserDoc | null | undefined;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  adminProfile: undefined,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [adminProfile, setAdminProfile] = useState<AdminUserDoc | null | undefined>(undefined);

  useEffect(() => {
    // Preview mode (no Firebase config): resolve to "signed out" right away
    // instead of attaching listeners that can never succeed, so /admin shows
    // its login screen rather than hanging on the initial auth state.
    if (!isFirebaseConfigured) {
      setUser(null);
      setAdminProfile(null);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setAdminProfile(null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || !isFirebaseConfigured) return;
    const ref = doc(db, "admin_users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => setAdminProfile(snap.exists() ? (snap.data() as AdminUserDoc) : null),
      () => setAdminProfile(null)
    );
    return unsub;
  }, [user]);

  const isAdmin = Boolean(adminProfile?.active);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      throw new PreviewModeError(
        "預覽模式：尚未設定 Firebase，後台登入功能停用。請依 README「四、Firebase 專案設定步驟」填好 .env 後重新啟動。"
      );
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!isFirebaseConfigured) return;
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
