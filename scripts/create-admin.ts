/**
 * Creates (or promotes) the first admin backend user.
 * Usage: npm run create-admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_DISPLAY_NAME from .env)
 */
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "./firebaseAdmin";
import { requireEnv } from "./env";

async function main() {
  const email = requireEnv("ADMIN_EMAIL");
  const password = requireEnv("ADMIN_PASSWORD");
  const displayName = process.env.ADMIN_DISPLAY_NAME || email;

  let uid: string;
  try {
    const existing = await adminAuth.getUserByEmail(email);
    uid = existing.uid;
    await adminAuth.updateUser(uid, { password, displayName });
    console.log(`Existing Firebase Auth user updated: ${email} (${uid})`);
  } catch {
    const created = await adminAuth.createUser({ email, password, displayName });
    uid = created.uid;
    console.log(`Firebase Auth user created: ${email} (${uid})`);
  }

  await adminDb.collection("admin_users").doc(uid).set({
    email,
    displayName,
    role: "owner",
    active: true,
    createdAt: FieldValue.serverTimestamp(),
  });

  console.log(`admin_users/${uid} provisioned with role "owner", active: true.`);
  console.log(`\nYou can now log in at /admin/login with:\n  Email: ${email}\n  Password: (as set in .env)`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
