import { getQuestionnaire } from "@/lib/questionnaire";
import { questionLabel } from "@/lib/questionnaireLabel";
import LeadMagnetSectionView from "./LeadMagnetSectionView";

// Die Anzahl der Fragen kommt aus dem Admin: So viele Fragen Silke dort
// angelegt hat, so viele nennt die Website. Nach dem Speichern baut
// /api/admin/questionnaire die Startseite neu (revalidatePath("/")).
export default async function LeadMagnetSection() {
  const { questions } = await getQuestionnaire();
  const count = questions.length;

  return <LeadMagnetSectionView count={count} label={questionLabel(count)} />;
}
