import { getDb } from "@/lib/firebaseAdmin";
import {
  NAME_PLACEHOLDER,
  QUESTION_COUNT,
  type Questionnaire,
  type QuestionnaireInput,
} from "@/types/questionnaire";

const COLLECTION = "settings";
const DOC_ID = "reflexionsfragen";

// Startvorlage: Silke kann jede Zeile im Admin überschreiben, muss aber nicht
// bei null anfangen.
export const DEFAULT_QUESTIONNAIRE: Questionnaire = {
  subject: "Deine 15 Reflexionsfragen",
  intro:
    `Liebe/r ${NAME_PLACEHOLDER},\n\n` +
    "schön, dass du dir Zeit für dich nimmst. Hier sind deine 15 Reflexionsfragen.\n\n" +
    "Nimm dir für jede Frage einen ruhigen Moment und schreibe auf, was dir spontan " +
    "in den Sinn kommt — es gibt kein richtig oder falsch.",
  questions: [
    "Wie fühlt sich mein Körper an, wenn ich morgens aufwache?",
    "Wann hatte ich zuletzt über einen ganzen Tag hinweg richtig viel Energie?",
    "Welche Mahlzeit am Tag tut mir am meisten gut — und welche weniger?",
    "Wie oft esse ich, weil ich Hunger habe, und wie oft aus Gewohnheit oder Stress?",
    "Wie viel Wasser trinke ich an einem normalen Tag wirklich?",
    "Welche Lebensmittel esse ich fast täglich, ohne darüber nachzudenken?",
    "Wie gut schlafe ich — und was beeinflusst meinen Schlaf am stärksten?",
    "Wo im Alltag spüre ich Anspannung in meinem Körper?",
    "Welche Bewegung macht mir Freude, statt sich nach Pflicht anzufühlen?",
    "Was tue ich für mich, wenn ein Tag anstrengend war?",
    "Welche Beschwerden begleiten mich schon so lange, dass ich sie kaum noch bemerke?",
    "Was habe ich in Sachen Gesundheit schon versucht — und was hat mir gefehlt?",
    "Wer oder was unterstützt mich auf meinem Weg?",
    "Was möchte ich in drei Monaten anders spüren als heute?",
    "Was ist der eine kleine Schritt, den ich schon morgen gehen könnte?",
  ],
  outro:
    "Wenn du magst, schreib mir gern, was dir beim Beantworten aufgefallen ist — " +
    "ich freue mich auf deine Gedanken.\n\nHerzliche Grüsse\nSilke Metzinger",
  updatedAt: 0,
};

function toText(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

// Immer genau 15 Einträge zurückgeben, damit das Formular und der Versand
// nicht auf Lücken in alten Dokumenten stolpern.
function normalizeQuestions(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [];
  return Array.from({ length: QUESTION_COUNT }, (_, index) =>
    typeof list[index] === "string" ? (list[index] as string) : "",
  );
}

export function normalizeQuestionnaire(value: unknown): QuestionnaireInput {
  const data = (value ?? {}) as Record<string, unknown>;
  return {
    subject: toText(data.subject, DEFAULT_QUESTIONNAIRE.subject).trim() ||
      DEFAULT_QUESTIONNAIRE.subject,
    intro: toText(data.intro, ""),
    questions: normalizeQuestions(data.questions),
    outro: toText(data.outro, ""),
  };
}

export async function getQuestionnaire(): Promise<Questionnaire> {
  const doc = await getDb().collection(COLLECTION).doc(DOC_ID).get();
  if (!doc.exists) return DEFAULT_QUESTIONNAIRE;

  const data = doc.data() ?? {};
  return {
    ...normalizeQuestionnaire(data),
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
  };
}

export async function saveQuestionnaire(input: QuestionnaireInput): Promise<Questionnaire> {
  const value: Questionnaire = { ...normalizeQuestionnaire(input), updatedAt: Date.now() };
  await getDb().collection(COLLECTION).doc(DOC_ID).set(value);
  return value;
}

function fillName(text: string, name: string): string {
  return text.split(NAME_PLACEHOLDER).join(name);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;line-height:1.65;color:#4a4a45;">${escapeHtml(block).replace(
          /\n/g,
          "<br />",
        )}</p>`,
    )
    .join("");
}

export function renderQuestionnaireEmail(questionnaire: Questionnaire, name: string) {
  const intro = fillName(questionnaire.intro, name).trim();
  const outro = fillName(questionnaire.outro, name).trim();
  const questions = questionnaire.questions.map((q) => q.trim()).filter(Boolean);

  const text = [
    intro,
    questions.map((question, index) => `${index + 1}. ${question}`).join("\n\n"),
    outro,
  ]
    .filter(Boolean)
    .join("\n\n");

  const listItems = questions
    .map(
      (question) =>
        `<li style="margin:0 0 12px;line-height:1.6;color:#4a4a45;">${escapeHtml(question)}</li>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="de">
  <body style="margin:0;padding:24px;background:#faf8f4;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 24px;font-size:22px;font-weight:normal;color:#8faf8a;">${escapeHtml(
        fillName(questionnaire.subject, name),
      )}</h1>
      ${paragraphs(intro)}
      <ol style="margin:0 0 24px;padding-left:20px;">${listItems}</ol>
      ${paragraphs(outro)}
    </div>
  </body>
</html>`;

  return {
    subject: fillName(questionnaire.subject, name),
    text,
    html,
  };
}
