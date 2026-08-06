// Schriften für die generierten Vorschaubilder (opengraph-image).
// Google Fonts liefert bei einem "text"-Parameter nur die tatsächlich benötigten
// Zeichen — das hält die Bilder klein und den Build schnell.
//
// Schlägt der Abruf fehl (kein Netz im Build), rendert next/og mit seiner
// eingebauten Schrift weiter. Ein fehlendes Vorschaubild wäre schlimmer als
// eines in der falschen Schrift.
export async function loadGoogleFont(
  family: string,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}&text=${encodeURIComponent(text)}`;

    const css = await (await fetch(url)).text();
    const source = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!source) return null;

    const response = await fetch(source[1]);
    if (!response.ok) return null;

    return await response.arrayBuffer();
  } catch {
    return null;
  }
}
