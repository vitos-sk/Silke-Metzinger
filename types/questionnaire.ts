// Die Anzahl der Fragen ist nicht mehr fest: Silke legt im Admin an und löscht,
// wie sie mag. Diese Grenzen halten das Formular und die E-Mail in Form.
// Die Startvorlage in lib/questionnaire.ts umfasst 7 Fragen.
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 30;

// Platzhalter, der beim Versand durch den Namen der Empfängerin ersetzt wird.
export const NAME_PLACEHOLDER = "{name}";

export interface Questionnaire {
  subject: string;
  intro: string;
  questions: string[];
  outro: string;
  updatedAt: number;
}

export type QuestionnaireInput = Omit<Questionnaire, "updatedAt">;
