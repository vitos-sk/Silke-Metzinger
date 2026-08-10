// Bei genau einer Frage darf im Text nicht "1 Reflexionsfragen" stehen.
export function questionLabel(count: number): string {
  return count === 1 ? "Reflexionsfrage" : "Reflexionsfragen";
}

export function questionWord(count: number): string {
  return count === 1 ? "Frage" : "Fragen";
}
