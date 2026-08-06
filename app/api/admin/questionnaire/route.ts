import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getQuestionnaire, normalizeQuestionnaire, saveQuestionnaire } from "@/lib/questionnaire";

export async function GET() {
  const questionnaire = await getQuestionnaire();
  return NextResponse.json(questionnaire);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const input = normalizeQuestionnaire(body);

  if (input.questions.every((question) => !question.trim())) {
    return NextResponse.json(
      { error: "Bitte formuliere mindestens eine Frage." },
      { status: 400 },
    );
  }

  try {
    const saved = await saveQuestionnaire(input);
    revalidatePath("/admin");
    return NextResponse.json(saved);
  } catch (err) {
    console.error("Reflexionsfragen: Speichern fehlgeschlagen", err);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
