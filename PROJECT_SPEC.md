# Vital & Frei — Website für Silke Metzinger

Technisches & inhaltliches Lastenheft für den Aufbau der Website. Dieses Dokument ist die Referenz für alle folgenden Entwicklungsschritte in diesem Projekt.

## 🎯 Projektübersicht

Vollständige, produktionsreife persönliche Website für **Silke Metzinger** — lizenzierte Ernährungsberaterin, Resilienzcoach, Mentorin und seelsorgerische Begleiterin mit Sitz in der Schweiz und Deutschland.

**Tech Stack:**

- Framework: **Next.js** (aktuellste stabile Version, App Router — aktuell 16.x, React 19)
- Styling: **Tailwind CSS** (aktuellste Version — aktuell v4, CSS-basierte Theme-Konfiguration in `app/globals.css` via `@theme`)
- Deployment: **Vercel**
- Sprache: **Deutsch** (durchgehend)
- Kontaktformular: **Resend** oder **Nodemailer** (API-Route)

---

## 🧭 Seitenstruktur

Single-Page-Design (ein langer Scroll) mit sticky Navigation, die zu jedem Abschnitt springt. Abschnitte:

1. `#home` — Hero
2. `#leistungen` — Leistungen (Vital / Frei / Lebe dein bestes Leben)
3. `#ueber-mich` — Über mich
4. `#wie-ich-arbeite` — Wie ich arbeite
5. `#news-events` — News & Events (Platzhalter-Karten)
6. `#kontakt` — Kontakt

Navigationslinks: **Home · Über mich · Leistungen · News/Events · Kontakt**

---

## 🎨 Design-Richtung

**Stil:** Warm & persönlich — NICHT corporate, NICHT klinisch. Wie eine vertraute Freundin, die zugleich Expertin ist.

### Referenz 1 — marion-koerner.com (primär)

Fast identische Nische (Ernährungsberatung + Coaching + „Vital & Frei" als Tagline).

Zu übernehmende Elemente:

- Split-Hero: großer Headline-Text links, professionelles Portraitfoto rechts
- Drei-Säulen-Struktur (Vital / Frei / Selbstbestimmt) mit Icons und kurzen Texten
- „Warum du hier richtig bist" — Checkliste von Pain Points mit 👉 Emoji-Pfeilen
- Statistik-Zeile (z. B. Jahre Erfahrung / begleitete Menschen / Individualität)
- Testimonials mit echtem Foto + Name + Rolle
- Sticky Navbar, die beim Scrollen weiß/opak wird
- Weiche Sektionsabwechslung: Ivory ↔ wärmeres Beige, nie harte Kontraste
- CTA „Erstgespräch buchen" durchgehend sichtbar (Nav + mehrere Sektionen)
- Farbpalette: warmes Weiß, sanftes Grün, goldene Typografie für Zitate

### Referenz 2 — letsflourish.ch (sekundär, Ton & Seele)

Christliche psychosoziale Beraterin für Frauen in der Schweiz — nah an Silkes spiritueller Dimension.

Zu übernehmende Elemente:

- Persönlicher, gesprächsartiger Ton — wie ein Brief einer Freundin
- Schlichtes Layout, viel Weißraum, kein komplexes Grid
- Herzmotiv / Gold-Akzent als dezentes Logo-Icon
- Blog als Vertrauensaufbau (falls später gewünscht): kurz, authentisch, wöchentlich
- Instagram-Feed eingebettet für Community-Gefühl
- Minimale Farbpalette: v. a. Weiß + ein warmer Akzent + schwarzer Text
- „Hej!"-Begrüßungsstil — sehr menschlicher Opener
- Einfache, kurze Navigation ohne Dropdowns

### Zu vermeiden

- Keine Stockfotos — nur echte, persönliche Fotos
- Kein Corporate-Blau, kein klinisches Grün
- Nicht zu viele Leistungen auf einen Blick pressen
- Keine generischen Coaching-Klischees ohne Silkes persönliche Geschichte dahinter

### Farbpalette

| Zweck              | Wert                                      |
| ------------------ | ----------------------------------------- |
| Hintergrund primär | `#FAF7F2` (warmes Ivory/Creme)            |
| Akzent 1           | `#8FAF8A` (Salbeigrün)                    |
| Akzent 2           | `#C8A96A` (warmes Gold)                   |
| Text primär        | `#2C2C2C` (sanftes Fast-Schwarz)          |
| Text sekundär      | `#6B6B6B` (warmes Grau)                   |
| CTA-Button         | Salbeigrün, Ivory-Text, abgerundete Ecken |

### Typografie

- Headings: `Playfair Display` (Serif, elegant, warm)
- Fließtext: `Lato` oder `Inter` (klar, gut lesbar)
- Beide über Google Fonts laden

### Visuelle Sprache

- Weiche, abgerundete Sektionen mit sanften Hintergrundfarbverläufen
- Naturmotive (See, Licht, Pflanzen, Wärme)
- Persönliche Fotos von Silke prominent platziert
- Großzügiger Weißraum
- Dezente Fade-in-Animationen beim Scrollen (Framer Motion oder CSS)
- Keine harten Kanten, kein Dark Mode

---

## 📄 Inhalte nach Abschnitt

### 1. Navigation (sticky)

Logo links (Platzhalter: `/public/logo.png`), Nav-Links rechts. Mobile: Hamburger-Menü. Beim Scrollen: dezenter weißer/ivoryfarbener Hintergrund mit Schatten.

### 2. Hero (`#home`)

**Headline:**

> Vital & Frei – lebe dein bestes Leben

**Subheadline:**

> Du spürst, dass mehr möglich ist. Mehr Energie. Mehr Leichtigkeit. Mehr Klarheit darüber, was du wirklich willst – und wie du deinen eigenen Weg dorthin findest.

**Fließtext:**

> Ich bin Silke Metzinger – und ich begleite dich ein Stück auf diesem Weg. Mit offenem Herzen, einem ganzheitlichen Blick auf den Menschen und dem Vertrauen, dass Veränderung möglich ist. Ohne Druck. Ohne starre Konzepte. Sondern mit alltagstauglichen Impulsen, ehrlichen Gesprächen und einer persönlichen Begleitung – in deinem Tempo.

**CTA-Button:**

> „Lass uns gemeinsam den ersten Schritt gehen →" (scrollt zu `#kontakt`)

**Layout:** Text links, großes Portraitfoto rechts. Mobile: Foto oben, Text darunter.

### 3. Drei-Säulen-Sektion (`#leistungen`)

Drei Karten/Spalten nebeneinander (mobile: gestapelt):

**Karte 1 — VITAL**

> Dein Körper ist dein Zuhause. Wenn er in seiner Kraft ist, spürst du es überall – in deiner Energie, deiner Ausstrahlung, deinem Alltag.
>
> Gemeinsam finden wir heraus, was deinen Körper wirklich nährt und stärkt. Kein Verzicht. Keine Diät. Kein Stress. Sondern ein Weg, der zu dir und deinem Leben passt.
>
> _„Wenn du dich von innen stark fühlst, strahlt das nach außen."_

**Karte 2 — FREI**

> Frei sein bedeutet nicht, alles perfekt zu machen. Es bedeutet, aufzuhören, dich ständig zu fragen: Mache ich es richtig? Was soll ich wählen? Wo fange ich an?
>
> Gemeinsam bringen wir Klarheit in das Gedankenchaos – mit einfachen Schritten, die sich gut anfühlen und wirklich in deinen Alltag passen.
>
> _„Freiheit beginnt im Kopf – und zeigt sich im Leben."_

**Karte 3 — LEBE DEIN BESTES LEBEN**

> Dein bestes Leben wartet nicht bis irgendwann. Es beginnt mit dem nächsten Schritt – genau dort, wo du heute stehst.
>
> Ich begleite dich persönlich und in deinem eigenen Tempo. Als der Mensch, der du wirklich bist.
>
> _„Dein Leben. Dein Tempo. Dein Weg."_

### 4. Leistungen im Detail (weiterhin `#leistungen`)

**Sektionstitel:** „Dein Weg zu mehr Gesundheit & Energie"

Zwei Spalten mit Icons (Lucide React):

**Spalte 1 — Körper & Gesundheit:**

- 🌿 Mikronährstoffe & Zellgesundheit — deinen Körper optimal unterstützen und Versorgungslücken erkennen
- 🌿 Darmgesundheit & Immunsystem — die Basis für Wohlbefinden und innere Balance stärken
- 🌿 Stoffwechsel & Energie — neue Vitalität und Leistungsfähigkeit entwickeln
- 🌿 Natürliche Ausstrahlung & Wohlbefinden — Gesundheit von innen nach außen sichtbar machen
- 🌿 Prävention & Longevity — heute die Grundlage für ein gesundes, bewusstes Leben von morgen schaffen

**Spalte 2 — Persönliche Entwicklung:**

- ✨ Selbstbewusstsein und Vertrauen
- ✨ Mentale Stärke und Resilienz
- ✨ Persönliche Entwicklung und Entfaltung deines Potenzials
- ✨ Mehr Freiheit und Klarheit für deinen eigenen Lebensweg

### 5. Über mich (`#ueber-mich`)

**Sektionstitel:** „Ich glaube an die Kraft der Veränderung."

**Einleitung:**

> Nicht, weil das Leben immer einfach ist. Sondern weil ich erlebt habe, dass selbst herausfordernde Zeiten neue Möglichkeiten eröffnen können.
>
> Ich bin **Silke Metzinger** und begleite Menschen, die tief in sich spüren, dass ihr Leben leichter, gesünder und freier sein darf.

**Persönliche Geschichte (emotionaler Kern — hervorheben):**

> Manchmal verändert ein einziger Moment ein ganzes Leben. Dieser kam 2019, als ich mit 47 Jahren die Diagnose Bauchspeicheldrüsenkrebs erhielt. Plötzlich war nichts mehr selbstverständlich. Angst, Zweifel und Ungewissheit wurden meine Begleiter – aber tief in mir war diese eine Stimme: _Ich gebe nicht auf._
>
> Mein Weg war geprägt von Operationen, Therapien, Hoffnung, aber auch von Angst, Tränen und vielen Momenten des Zweifelns. Mut bedeutet nicht, keine Angst zu haben. Mut bedeutet, trotz der Angst weiterzugehen.
>
> Diese Erfahrung hat meine Sicht auf Gesundheit für immer verändert. Heute ist es meine Herzensaufgabe, Menschen auf ihrem Weg zu mehr Gesundheit, Lebensfreude, innerer Balance und neuen Möglichkeiten zu begleiten. Nicht aus Theorie, sondern aus eigener Erfahrung.

**Persönliches:**

> Ich lebe mit meinem Lebenspartner am wunderschönen Sempachersee. Wir sind eine Patchwork-Familie mit vier erwachsenen Kindern. Die Natur ist mein Kraftort – beim Schwimmen im See, auf dem Stand-up-Paddle, beim Joggen oder beim Tennis.

**Qualifikationen (Liste oder Badge-Design):**

- Lizenzierte Ernährungsberaterin
- Lizenzierter Resilienzcoach
- Dreijährige Ausbildung an der Lifeschool Bibelschule
- Mehrjährige Tätigkeit im sozialen Bereich

### 6. Wie ich arbeite (`#wie-ich-arbeite`)

**Sektionstitel:** „Wie ich arbeite"

> Gesundheit ist so individuell wie der Mensch selbst. Deshalb glaube ich nicht an Standardlösungen, sondern an eine persönliche Begleitung, die dich dort abholt, wo du gerade stehst.
>
> Ich verbinde fundiertes Wissen über Mikronährstoffe mit meiner eigenen Erfahrung und einem ganzheitlichen Blick auf deine Bedürfnisse. Dabei steht nicht ein Produkt im Mittelpunkt – sondern du.
>
> Ich höre zu, bevor ich Empfehlungen gebe. Meine Begleitung endet nicht mit einer ersten Analyse. Ich bin an deiner Seite, beantworte deine Fragen und unterstütze dich dabei, deinen Körper besser zu verstehen.
>
> Mein Ziel ist es, deine Eigenverantwortung zu stärken – nicht sie zu ersetzen.

3-Schritte-Visual: **Zuhören → Begleiten → Stärken**

### 7. News & Events (`#news-events`)

**Sektionstitel:** „News & Events"

3 Platzhalter-Eventkarten (Grid). Jede Karte:

- Datum-Platzhalter
- Titel-Platzhalter
- Kurzbeschreibung-Platzhalter
- „Mehr erfahren →" Link

Stil: Ivory-Karte, Salbeigrün-Datumsbadge, sanfter Schatten.

### 8. Kontakt (`#kontakt`)

**Sektionstitel:** „Lass uns gemeinsam ins Gespräch kommen"

**Einleitung:**

> Du möchtest mehr über meine Begleitung, Gesundheit, Vitalstoffe oder deinen persönlichen Weg zu mehr Energie und Balance erfahren? Ich freue mich darauf, von dir zu hören.

**Formularfelder:**

- Vorname & Nachname (Text)
- E-Mail-Adresse (Email)
- Deine Nachricht (Textarea)
- Checkbox: „Ich stimme der Datenschutzerklärung zu." (Pflichtfeld)
- Submit-Button: „Senden"

Formular sendet an Next.js API-Route `/api/contact`, die eine E-Mail an `info@silke-metzinger.ch` verschickt.

**Direktkontakt (neben dem Formular anzeigen):**

- 📱 WhatsApp Deutschland: +49 173 340 1477
- 📱 WhatsApp Schweiz: +41 76 630 3682
- ✉️ E-Mail: info.silke-metzinger@gmx.ch

**Social Media:**

- Facebook
- Instagram
- LinkedIn

### 9. Footer

- Name: Silke Metzinger
- Adresse CH: Luzernerstr. 17b, 6204 Hildisrieden
- Adresse DE: Falkensteinerstrasse 1, 79369 Wyhl
- Links: Impressum · Datenschutz
- Copyright: © 2025 Silke Metzinger

---

## 📁 Dateistruktur

```
/
├── app/
│   ├── layout.tsx          # Root-Layout mit Fonts + Metadata
│   ├── page.tsx            # Hauptseite — importiert alle Sektionen
│   └── api/
│       └── contact/
│           └── route.ts    # Kontaktformular-Handler
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Pillars.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── HowIWork.tsx
│   ├── NewsEvents.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
└── public/
    ├── logo.png            # Platzhalter — Kunde liefert
    └── ASSETS_TODO.md      # Liste offener Bild-Assets
```

---

## ⚙️ Tailwind Config (Custom Colors)

Tailwind v4 nutzt CSS-basierte Konfiguration statt `tailwind.config.ts`. Definiert in `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ivory: #faf7f2;
  --color-sage: #8faf8a;
  --color-gold: #c8a96a;
  --color-text-primary: #2c2c2c;
  --color-text-secondary: #6b6b6b;

  --font-serif: var(--font-playfair), serif;
  --font-sans: var(--font-inter), sans-serif;
}
```

Nutzung in Komponenten wie gewohnt über Utility-Klassen: `bg-ivory`, `text-sage`, `bg-gold`, `text-text-primary`, `text-text-secondary`, `font-serif`, `font-sans`.

---

## ✅ Anforderungs-Checkliste

- [ ] Vollständig responsive (mobile-first)
- [ ] Sticky Navbar mit Smooth Scroll
- [ ] Fade-in-Animationen beim Scrollen
- [ ] Kontaktformular mit Validierung + Erfolgs-/Fehlerstatus
- [ ] DSGVO-Checkbox Pflicht vor Absenden
- [ ] SEO: Meta-Title, Description, og:image
- [ ] `lang="de"` im html-Tag
- [ ] Platzhalter für Logo-Bild (Kunde liefert)
- [ ] Platzhalter-Fotoslots (Kunde liefert Fotos)
- [ ] Alle Texte auf Deutsch wie oben — nicht übersetzen oder verändern
- [ ] Kein Lorem Ipsum
- [ ] Deploy-ready für Vercel (keine externe DB nötig)

---

## 🗂 Status

- [x] Spezifikation dokumentiert (dieses Dokument)
- [x] Projekt-Grundgerüst (Next.js + App Router + TypeScript + Tailwind) aufgesetzt
- [ ] Komponenten mit finalem Inhalt füllen (nächster Schritt, im selben Chat, als eine zusammenhängende Aufgabe)
- [ ] Kontaktformular-API-Route implementieren (Resend/Nodemailer)
- [ ] Assets (Logo, Fotos) einbinden, sobald vom Kunden geliefert
- [ ] Deployment auf Vercel
