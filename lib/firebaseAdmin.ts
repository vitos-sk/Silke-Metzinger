import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  let projectId: string | undefined;
  let clientEmail: string | undefined;
  let privateKey: string | undefined;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const sa = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"),
    );
    projectId = sa.project_id;
    clientEmail = sa.client_email;
    privateKey = sa.private_key;
  } else {
    projectId = process.env.FIREBASE_PROJECT_ID;
    clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    privateKey = process.env.FIREBASE_PRIVATE_KEY_BASE64
      ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8")
      : process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin: fehlende Umgebungsvariablen (FIREBASE_SERVICE_ACCOUNT_BASE64 oder FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY)");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getDb(): Firestore {
  return getFirestore(getAdminApp());
}
