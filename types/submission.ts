export interface ContactSubmission {
  id: string;
  type: "contact";
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface LeadMagnetSubmission {
  id: string;
  type: "lead-magnet";
  fullName: string;
  email: string;
  read: boolean;
  createdAt: number;
  // Zeitpunkt, an dem die Reflexionsfragen verschickt wurden — null,
  // solange sie noch offen sind.
  questionsSentAt: number | null;
}

export type Submission = ContactSubmission | LeadMagnetSubmission;

export type ContactSubmissionInput = Omit<ContactSubmission, "id" | "read" | "createdAt">;
export type LeadMagnetSubmissionInput = Omit<
  LeadMagnetSubmission,
  "id" | "read" | "createdAt" | "questionsSentAt"
>;
