export const QUESTION_COUNT = 15;

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
