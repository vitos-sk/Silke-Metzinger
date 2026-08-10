import { getDb } from "@/lib/firebaseAdmin";
import {
  MAX_QUESTIONS,
  NAME_PLACEHOLDER,
  type Questionnaire,
  type QuestionnaireInput,
} from "@/types/questionnaire";

const COLLECTION = "settings";
const DOC_ID = "reflexionsfragen";

// Startvorlage: Silke kann jede Zeile im Admin überschreiben, muss aber nicht
// bei null anfangen.
export const DEFAULT_QUESTIONNAIRE: Questionnaire = {
  subject: "Deine Reflexionsfragen",
  intro:
    `Liebe/r ${NAME_PLACEHOLDER},\n\n` +
    "schön, dass du dir Zeit für dich nimmst. Hier sind deine Reflexionsfragen.\n\n" +
    "Nimm dir für jede Frage einen ruhigen Moment und schreibe auf, was dir spontan " +
    "in den Sinn kommt — es gibt kein richtig oder falsch.",
  questions: [
    "Wie fühlt sich mein Körper an, wenn ich morgens aufwache?",
    "Wann hatte ich zuletzt über einen ganzen Tag hinweg richtig viel Energie?",
    "Wie oft esse ich, weil ich Hunger habe, und wie oft aus Gewohnheit oder Stress?",
    "Wie gut schlafe ich — und was beeinflusst meinen Schlaf am stärksten?",
    "Welche Bewegung macht mir Freude, statt sich nach Pflicht anzufühlen?",
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

// Die Liste ist so lang, wie Silke sie im Admin anlegt. Leere Zeilen fliegen
// raus, damit questions.length überall die echte Anzahl ist — auf der Website,
// im Admin und in der E-Mail.
function normalizeQuestions(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [];
  return list
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_QUESTIONS);
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
  const stored = normalizeQuestionnaire(data);
  return {
    ...stored,
    // Ein leerer Dokumentstand kann über das Formular nicht entstehen. Falls er
    // doch einmal auftaucht, ist die Startvorlage besser als eine leere Liste.
    questions: stored.questions.length > 0 ? stored.questions : DEFAULT_QUESTIONNAIRE.questions,
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
