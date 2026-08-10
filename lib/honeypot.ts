// Name des versteckten Formularfelds. Liegt bewusst in einem eigenen Modul
// ohne Server-Abhaengigkeiten, damit auch Client-Komponenten es importieren
// koennen (lib/formGuard.ts zieht Firestore und node:crypto nach).
export const HONEYPOT_FIELD = "website";
