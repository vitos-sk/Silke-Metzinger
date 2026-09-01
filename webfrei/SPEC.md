# WebFrei.com — Projektspezifikation

> Portfolio-Website von Vitaliy | Webentwickler aus Freiburg  
> Dokument: Vollständige Planung vor Entwicklungsstart

---

## 1. Identität & Branding

| Eigenschaft | Wert |
|---|---|
| **Name** | WebFrei |
| **Domain** | webfrei.com |
| **Inhaber** | Vitaliy |
| **Standort** | Freiburg im Breisgau, Deutschland |
| **Sprache** | Deutsch (primär) |
| **Zielgruppe** | Kleine und mittlere Unternehmen in DE + international |
| **Positionierung** | Freelance Full-Stack Webentwickler — schneller, persönlicher und günstiger als Agenturen |

---

## 2. Tech-Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS
Backend/DB:   Supabase (PostgreSQL)
Deployment:   Vercel
```

### Supabase-Tabellen

```sql
-- Kontaktanfragen (Formular)
leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  first_name  text NOT NULL,
  last_name   text,
  email       text NOT NULL,
  phone       text,
  site_types  text[],        -- Ausgewählte Kategorien (Landing Page, Shop, etc.)
  description text,
  budget      text,
  timeline    text,
  source      text
)

-- Blog-Posts (später)
posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  excerpt     text,
  content     text,
  published   boolean DEFAULT false,
  cover_url   text
)
```

### Umgebungsvariablen (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

---

## 3. Design-System

### Farbpalette

| Token | Hex | Verwendung |
|---|---|---|
| `cream` | `#F4EFE3` | Haupthintergrund |
| `dark` | `#111111` | Dunkle Sektionen, Text |
| `orange` | `#E8451E` | Akzentfarbe, CTA-Buttons |
| `muted` | `#6B6B65` | Subtexte, Labels |
| `white` | `#FFFFFF` | Karten auf dunklem Hintergrund |

### Typographie

| Rolle | Font | Gewicht |
|---|---|---|
| Überschriften | **Bebas Neue** | 400 (wirkt durch Schriftart sehr bold) |
| Body / UI | **Inter** | 400 / 500 / 600 / 700 |

### Schriftgrößen

```
display-xl → clamp(4rem, 12vw, 10rem) | line-height: 0.92
display-lg → clamp(3rem, 8vw, 7rem)   | line-height: 0.92
display-md → clamp(2rem, 5vw, 4rem)   | line-height: 0.95
```

### Design-Prinzipien

- **Dark Editorial** — großflächige Typografie als visuelles Element
- Sektionsnummern im Format `01 / SECTION NAME`
- Buttons: **rechteckig, UPPERCASE** (kein Border-Radius)
- Keine Dekorationen — Inhalt und Typografie tragen das Design
- Wechsel zwischen Cream- und Dark-Sektionen für Rhythmus
- Karten: weiß auf dunkel, subtile Border

---

## 4. Seitenstruktur (Einseiter)

```
/            ← Hauptseite (alle Sektionen)
/blog        ← Blog (Phase 2 — später)
/blog/[slug] ← Einzelner Artikel (Phase 2)
```

### Sektionsreihenfolge

| # | Sektion | Hintergrund | Zweck |
|---|---|---|---|
| — | **Header / Nav** | Transparent → Cream | Navigation, Logo, CTA |
| 1 | **Hero** | Cream | Hauptaussage + zwei CTAs |
| 2 | **Portfolio** | Dark | 3 Referenzprojekte |
| 3 | **Leistungen** | Cream | 5 Service-Karten |
| 4 | **Prozess** | Dark | 4 Schritte |
| 5 | **Ergebnisse** | Orange | Stats: Perf / Mobile / SEO |
| 6 | **Preise** | Cream | 3 Pakete |
| 7 | **Anfrage-Formular** | Dark | 3-stufiger Wizard → Supabase |
| 8 | **FAQ** | Cream | 5 häufige Fragen |
| 9 | **CTA-Banner** | Dark | Letzter Push zur Anfrage |
| — | **Footer** | Dark | Links, Kontakt, Legal |

---

## 5. Komponenten-Architektur

```
components/
├── header/
│   ├── header.tsx          ← Nav-Bar (fixed, transparent → opaque on scroll)
│   └── nav-link.tsx        ← Einzelner Nav-Link mit hover state
│
├── hero/
│   ├── hero.tsx            ← Sektion 1
│   └── hero-cta.tsx        ← CTA-Buttons (orange + dark)
│
├── portfolio/
│   ├── portfolio.tsx       ← Sektion 2 (dark bg)
│   └── portfolio-card.tsx  ← Einzelne Projektkarte
│
├── services/
│   ├── services.tsx        ← Sektion 3
│   └── service-card.tsx    ← Einzelne Leistungskarte mit →
│
├── process/
│   ├── process.tsx         ← Sektion 4 (dark bg)
│   └── process-step.tsx    ← 01 DISCOVERY / 02 DESIGN etc.
│
├── results/
│   └── results.tsx         ← Sektion 5 (orange bg) — Stats
│
├── pricing/
│   ├── pricing.tsx         ← Sektion 6
│   └── price-card.tsx      ← Starter / Pro / Custom
│
├── contact/
│   ├── contact.tsx         ← Sektion 7 (dark bg) — Wrapper
│   ├── inquiry-form.tsx    ← 3-stufiger Formular-Wizard
│   └── form-step.tsx       ← Einzelne Formular-Stufe
│
├── faq/
│   ├── faq.tsx             ← Sektion 8
│   └── faq-item.tsx        ← Akkordeon-Item
│
├── cta-banner/
│   └── cta-banner.tsx      ← Sektion 9 (dark bg)
│
├── footer/
│   └── footer.tsx          ← Footer
│
└── ui/
    ├── button.tsx          ← Wiederverwendbare Buttons (variants: primary/secondary/ghost)
    ├── section-tag.tsx     ← "01 / SECTION NAME" Label
    └── chip.tsx            ← Formular-Auswahl-Chips
```

---

## 6. Sektionen — Inhalt (Deutsch)

### Hero
```
Tag:        "● VERFÜGBAR FÜR PROJEKTE"
H1:         "WEBSITE,
             DIE VERKAUFT."
Subtext:    WEB DESIGN / ENTWICKLUNG / DIGITAL
Body:       Ich entwickle schnelle, moderne Websites für Unternehmen,
            die professionell wirken und Besucher in Kunden verwandeln.
CTA 1:      [PROJEKT BESPRECHEN →]   ← orange
CTA 2:      [ARBEITEN ANSEHEN ↓]     ← dark
```

### Portfolio
```
Tag:        "01 / SELECTED WORK"
H2:         "ARBEITEN,
             DIE FÜR SICH
             SPRECHEN."
Karten:     3 Projekte mit Bild, Kategorie, Titel, Ort, Tech-Stack, Pfeil →
```

### Leistungen
```
Tag:        "02 / WHAT I DO"
H2:         "VON DER IDEE
             ZUM FERTIGEN
             SITE."
Karten (5):
  1. WEB DESIGN          — Design der Marke entspricht, Vertrauen weckt.
  2. ENTWICKLUNG         — Sauberer Code. Schnell. Skalierbar.
  3. LANDING PAGES       — Conversion-optimiert, auf Performance ausgelegt.
  4. UNTERNEHMENSWEBSITE — Professioneller Auftritt, mehr Anfragen.
  5. SEO & PERFORMANCE   — Google-sichtbar, Core Web Vitals optimiert.
```

### Prozess
```
Tag:        "03 / PROCESS"
H2:         "OHNE UNNÖTIGE
             BÜROKRATIE."
Schritte:
  01 DISCOVERY   — Ziele, Zielgruppe, Strategie
  02 DESIGN      — Entwurf, Struktur, Freigabe
  03 ENTWICKLUNG — Umsetzung, sauber und schnell
  04 LAUNCH      — Go Live + 30 Tage Support
```

### Ergebnisse
```
Tag:        "04 / RESULT"
H2:         "NICHT NUR
             SCHÖN."
Claim:      "Eine Website die hilft, Kunden zu gewinnen."
Stats:
  90+   PERFORMANCE
  100%  MOBILE READY
  ✓     SEARCH OPTIMIZED
```

### Preise
```
Tag:        "05 / PRICING"
H2:         "KLARE PREISE.
             KEINE ÜBERRASCHUNGEN."

Starter   ab 799€   — Landing Page, 1 Seite, SEO-Basis, Kontaktformular, 7 Tage
Pro       ab 1.999€ — bis 6 Seiten, CMS, erweitertes SEO, Animationen, 14 Tage ★
Custom    Auf Anfrage — Shop, Web-App, Backend, API, individuell
```

### Anfrage-Formular
```
Tag:        "05 / LET'S WORK"
H2:         "BEREIT FÜR ETWAS
             STARKES?"

Schritt 1 — Was brauchst du?
  Chips: Landing Page / Unternehmenswebsite / Online-Shop /
         Blog / Web-App / Redesign / Ich weiß noch nicht
  Textarea: Kurze Projektbeschreibung

Schritt 2 — Budget & Zeitplan
  Chips: bis 800€ / 800–2.000€ / 2.000–5.000€ / 5.000€+ / Offen
  Select: Timeline
  Input: Bestehende URL (optional)

Schritt 3 — Kontakt
  Felder: Vorname*, Nachname, E-Mail*, Telefon, Wie gefunden?
  Absenden → speichert in Supabase "leads" Tabelle
```

### FAQ
```
1. Wie lange dauert ein Projekt?
2. Kann ich Inhalte selbst ändern?
3. Was kostet Hosting und Domain?
4. Was wenn mir das Design nicht gefällt?
5. Arbeitest du auch außerhalb Freiburgs?
```

### CTA-Banner
```
H2:         "BEREIT
             ETWAS STARKES
             ZU BAUEN?"
CTA:        [PROJEKT STARTEN →]
Subtext:    Tell me what you're building.
```

---

## 7. SEO-Strategie

### On-Page
- `<title>` und `<meta description>` pro Seite
- H1 nur einmal pro Seite
- `canonical` Tag
- Schema.org `LocalBusiness` JSON-LD
- `alt` Attribute auf allen Bildern
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`

### Technisch
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Next.js `Image` für automatische Bildoptimierung
- Statische Generierung (SSG) wo möglich
- `sitemap.xml` automatisch via next-sitemap
- `robots.txt`

### Lokal (Freiburg)
- Keywords: "Webentwickler Freiburg", "Website erstellen Freiburg"
- Schema.org LocalBusiness mit Adresse und Geo-Koordinaten
- Google Business Profile verknüpfen

### Blog (Phase 2)
- Artikel-Themen: "Webseite für Handwerker Freiburg", "Was kostet eine Website", etc.
- Jeder Artikel = neues SEO-Signal

---

## 8. Deployment-Pipeline

```
Lokal → GitHub → Vercel (Auto-Deploy bei Push auf main)

Vercel Environment Variables:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 9. Phase-Plan

| Phase | Was | Wann |
|---|---|---|
| **Phase 1** | Portfolio-Website komplett (alle Sektionen) | Start |
| **Phase 2** | Blog mit Supabase CMS | Nach Launch |
| **Phase 3** | Admin-Dashboard (Anfragen sehen) | Optional |

---

## 10. Dateien & Konfiguration

```
webfrei/
├── app/
│   ├── layout.tsx       ← SEO Metadata, Fonts
│   ├── page.tsx         ← Alle Sektionen zusammengesetzt
│   ├── globals.css      ← Tailwind + CSS-Variablen
│   ├── blog/
│   │   ├── page.tsx     ← Blog-Übersicht (Phase 2)
│   │   └── [slug]/
│   │       └── page.tsx ← Blog-Artikel (Phase 2)
│   └── api/
│       └── leads/
│           └── route.ts ← POST → Supabase
├── components/          ← (siehe Architektur oben)
├── lib/
│   └── supabase.ts      ← Supabase Client
├── public/
│   ├── favicon.ico
│   └── og-image.jpg     ← Open Graph Bild
├── .env.local           ← Supabase Keys (nicht ins Git!)
├── .env.example         ← Template ohne Keys
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── .gitignore
└── SPEC.md              ← dieses Dokument
```

---

*Dokument erstellt: August 2026 | Version 1.0*
