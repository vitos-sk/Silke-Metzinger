import { getDb } from "@/lib/firebaseAdmin";
import type {
  ContactSubmissionInput,
  LeadMagnetSubmissionInput,
  Submission,
} from "@/types/submission";

const COLLECTION = "submissions";

export async function listSubmissions(): Promise<Submission[]> {
  const snapshot = await getDb().collection(COLLECTION).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, read: false, questionsSentAt: null, ...doc.data() }) as Submission)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const doc = await getDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, read: false, questionsSentAt: null, ...doc.data() } as Submission;
}

export async function createSubmission(
  input: ContactSubmissionInput | LeadMagnetSubmissionInput,
): Promise<string> {
  const doc = await getDb()
    .collection(COLLECTION)
    .add({ ...input, read: false, createdAt: Date.now() });
  return doc.id;
}

export async function markSubmissionRead(id: string, read: boolean): Promise<void> {
  await getDb().collection(COLLECTION).doc(id).update({ read });
}

export async function markQuestionsSent(id: string, sentAt: number): Promise<void> {
  await getDb().collection(COLLECTION).doc(id).update({ questionsSentAt: sentAt, read: true });
}

export async function deleteSubmission(id: string): Promise<void> {
  await getDb().collection(COLLECTION).doc(id).delete();
}
