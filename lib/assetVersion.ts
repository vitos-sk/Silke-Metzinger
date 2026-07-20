// Cache-Busting fuer statische Fotos in /public (foto1-4, logo, silke-photo-contact).
// Beim Ersetzen einer Datei unter gleichem Namen bleibt die URL sonst identisch,
// wodurch Browser- und Next.js-Image-Cache das alte Foto weiter ausliefern.
// Nach jedem Fotoaustausch diese Zahl um 1 erhoehen.
export const ASSET_V = 1;
