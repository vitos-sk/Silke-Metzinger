import { HONEYPOT_FIELD } from "@/lib/honeypot";

// Unsichtbares Feld gegen Bots. Kein display:none, weil viele Bots genau
// solche Felder ueberspringen - stattdessen aus dem sichtbaren Bereich
// geschoben und aus Tab-Reihenfolge sowie Screenreader ausgenommen.
export function HoneypotField() {
  return (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Bitte dieses Feld leer lassen</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
