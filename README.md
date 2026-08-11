# 🌿 Silke Metzinger — Vital & Frei

Website und Mini-CMS für die Praxis von Silke Metzinger (Ernährungsberatung & Resilienzcoaching). Der öffentliche Bereich ist eine animierte One-Page-Website auf Deutsch mit angeschlossenem Blog; der private Bereich ist ein zweifach abgesichertes Admin-Panel, in dem Silke Beiträge schreibt, Anfragen beantwortet und ihre Reflexionsfragen verschickt — ohne dass dafür eine Entwicklerin gebraucht wird.

## 📋 Inhaltsverzeichnis

- [Projektbeschreibung](#-projektbeschreibung)
- [Hauptfunktionen](#-hauptfunktionen)
- [Technologie-Stack](#-technologie-stack)
- [Architektur](#-architektur)
- [Zentrale Mechanismen](#-zentrale-mechanismen)
- [Schnellstart](#-schnellstart)
- [Umgebungsvariablen](#-umgebungsvariablen)
- [Datenmodell](#-datenmodell)
- [Deployment](#-deployment)
- [Projektstruktur](#-projektstruktur)

## 🎯 Projektbeschreibung

Das Projekt besteht aus drei Bereichen:

**Öffentliche Startseite** (`/`) — eine One-Page-Site mit den Sektionen Hero, Pillars, About, HowIWork, Services, Lead-Magnet, CallToAction, Qualifications, News/Events und Contact. Sanftes Scrollen, Viewport-Animationen und ein Fortschrittsbalken im Header werden mit `motion` (Framer Motion) umgesetzt. Das Kontaktformular speichert die Nachricht in Firestore und schickt sie zusätzlich per Resend an Silke.

**Blog** (`/blog`, `/blog/[slug]`) — Beiträge, Ankündigungen und Events aus demselben Bestand. Übersicht mit Filter und Volltextsuche, Detailseite mit Teilen-Buttons und verwandten Beiträgen, dazu RSS-Feed, Sitemap, JSON-LD und automatisch erzeugte Vorschaubilder für jeden Link.

**Privates Admin-Panel** (`/admin`) — vier Bereiche: Posteingang, Blog-Verwaltung mit Block-Editor, Vorlage der Reflexionsfragen und Zugangsdaten. Der Bereich ist für Unbefugte physisch nicht erreichbar: Ohne gültigen Gate-Key in der URL liefert jede Anfrage an `/admin/*` und `/api/admin/*` ein `404`, als gäbe es die Route gar nicht.

## ✨ Hauptfunktionen

### Für Besucherinnen der Website
- 🎨 One-Page-Layout mit sanfter Sektionsnavigation und aktiver Menü-Hervorhebung (Intersection Observer)
- 🎬 Scroll-Animationen, Lesefortschritts-Balken, „Nach oben“-Button — alle respektieren `prefers-reduced-motion`
- 📅 News/Events-Block mit den drei aktuellsten Beiträgen; vergangene Events werden ausgeblendet
- 📰 Blog mit Filter (Alle / Events / Beiträge) und Volltextsuche über Titel, Kurzbeschreibung und Inhalt
- 🔗 Teilen per WhatsApp, Facebook, E-Mail und „Link kopieren“
- ✉️ Kontaktformular mit serverseitiger Validierung, Speicherung und E-Mail-Versand
- 🎁 Lead-Magnet: Anforderung der Reflexionsfragen über ein Modal (Name, E-Mail, Einwilligung)
- 📞 Telefon- und WhatsApp-Nummern mit Kopier-Button (inkl. Fallback für ältere Browser)
- 📱 Vollständig responsives Layout, optimierte Fonts (`next/font`), eigene 404-Seite

### Für die Administratorin
- 🔒 Zweistufiger Zugriff: ein geheimer Gate-Link verbirgt die Existenz von `/admin`, ein separates Passwort öffnet danach die Session
- 📥 **Briefe:** Kontaktanfragen und Lead-Magnet-Anfragen in einer Liste, Zähler für Ungelesenes, gelesen/ungelesen markieren, löschen
- ✍️ **Blog:** Beiträge anlegen, bearbeiten, löschen — mit Block-Editor (Absatz, Überschrift, Bild, Zitat, Liste, Button, Trenner), Titelbild-Upload, Entwurf/Veröffentlicht, Veröffentlichungsdatum, „Oben anheften“ und Vorschau
- 🧭 **Fragen:** Vorlage der Reflexionsfragen frei bearbeiten (Betreff, Intro, beliebig viele Fragen, Schluss); `{name}` wird beim Versand durch den Namen der Empfängerin ersetzt
- 📧 Versand der Reflexionsfragen per Klick an eine Anfrage, mit Datum der Zustellung in der Liste
- 🔑 **Zugang:** E-Mail und Passwort selbst ändern; „Passwort vergessen“ per E-Mail-Link
- 🛡️ Rate-Limiting bei Login (5 Versuche / 15 Min.) und Passwort-Reset (3 / 15 Min.), zeitkonstante Vergleiche von Passwort und Gate-Key
- 👁️ Entwurfs-Vorschau unter `/blog/<slug>?preview=1` — sichtbar nur mit gültiger Admin-Session

## 🛠 Technologie-Stack

### Frontend
- **Next.js 16** (App Router) — Framework, Server Components, Route Handlers, Middleware
- **React 19** — UI-Bibliothek
- **TypeScript 5** — statische Typisierung
- **Tailwind CSS 4** — Utility-First-Styling, Design-Tokens in `app/globals.css`
- **Motion (Framer Motion) 12** — Animationen, Scroll-Effekte
- **Lucide React** — Icons
- **next/font** — Google Fonts (Playfair Display, Inter, Cormorant), lokal optimiert

### Backend / API
- **Next.js Route Handlers** — API-Endpunkte (`/api/contact`, `/api/lead-magnet`, `/api/admin/*`)
- **Middleware** — zweistufiger Schutz des Admin-Bereichs (Gate + Session)
- **jose** — Signierung/Verifizierung von JWTs (HS256) für Gate-, Session- und Reset-Token
- **Node.js `crypto`** — `scrypt` für den Passwort-Hash, `timingSafeEqual` für den Vergleich
- **next/og** — dynamisch erzeugte Vorschaubilder für Startseite und Beiträge

### Daten & Integrationen
- **Firebase Admin SDK + Firestore** — Collections `posts`, `submissions`, `settings`, `rateLimits`
- **Vercel Blob** — Speicher für Titelbilder und Bilder im Beitragstext
- **Resend** — Kontaktformular, Lead-Magnet-Benachrichtigung, Reflexionsfragen, Passwort-Reset

### Infrastruktur
- **Vercel** — Hosting, Deployment, Fluid Compute, Blob Storage
- **Vercel Analytics + Speed Insights** — Reichweite und Core Web Vitals, beides ohne Cookies
- **ESLint 9** (`eslint-config-next`) — Linting

## 🏗 Architektur

```
                         ┌───────────────────────────┐
                         │        Besucherin         │
                         └─────────────┬─────────────┘
                                       │ HTTPS
                                       ▼
                         ┌───────────────────────────┐
                         │    Next.js App Router     │
                         │        (Vercel)           │
                         └─────────────┬─────────────┘
                                       │
       ┌───────────────────┬───────────┴───────────┬───────────────────┐
       ▼                   ▼                       ▼                   ▼
┌─────────────┐  ┌──────────────────┐  ┌────────────────────┐  ┌──────────────┐
│ Startseite  │  │ Blog             │  │ Middleware         │  │ API-Routen   │
│ app/page    │  │ /blog, /blog/... │  │ Gate-JWT + Session │  │ /api/contact │
│ + Sektionen │  │ Feed, Sitemap,   │  │ → 404 ohne Gate    │  │ /api/lead-…  │
│             │  │ OG-Bilder, JSON-LD│ └─────────┬──────────┘  │ /api/admin/* │
└──────┬──────┘  └────────┬─────────┘            │             └──────┬───────┘
       │                  │                      ▼                    │
       │                  │           ┌────────────────────┐          │
       │                  │           │ /admin (4 Tabs)    │          │
       │                  │           │ Briefe · Blog ·    │          │
       │                  │           │ Fragen · Zugang    │          │
       │                  │           └─────────┬──────────┘          │
       └──────────────────┴────────────┬────────┴─────────────────────┘
                                       ▼
       ┌────────────────────┬────────────────────┬────────────────────┐
       ▼                    ▼                    ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Firestore    │  │ Vercel Blob  │  │ Resend       │  │ Vercel Analytics │
│ posts        │  │ Beitrags-    │  │ 4 Mail-Arten │  │ + Speed Insights │
│ submissions  │  │ bilder       │  │              │  │                  │
│ settings     │  │              │  │              │  │                  │
│ rateLimits   │  │              │  │              │  │                  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘
```

## 🔍 Zentrale Mechanismen

**Gate + Session (doppeltes Schloss über `/admin`)**
`middleware.ts` fängt alle Anfragen an `/admin/:path*` und `/api/admin/:path*` ab. Ohne gültiges `admin_gate`-Cookie oder `?key=` in der URL liefert der Bereich ein `404` — er ist für zufällige Besucher und Scanner „unsichtbar“. Nach einem gültigen Gate-Key wird ein eigenes JWT ausgestellt (`lib/gate.ts`) und der Key aus der Adresszeile entfernt; ein vollständiger Login per E-Mail und Passwort (`/api/admin/login`) erzeugt zusätzlich eine zweite JWT-Session (`lib/session.ts`). Beide auf Basis von `jose`/HS256, beide Cookies `httpOnly`, `sameSite=lax`, Laufzeit 12 Stunden. Login, Passwort-vergessen und Passwort-Reset brauchen keine Session — sonst käme man an ein vergessenes Passwort nie heran.

**Admin-Konto in Firestore**
Solange kein Konto existiert, wird eines aus `ADMIN_EMAIL`/`ADMIN_PASSWORD` angelegt (`lib/adminAccount.ts`); ab dann zählt nur noch Firestore und Silke ändert E-Mail und Passwort selbst. Der Hash ist `scrypt` mit Zufallssalz, verglichen wird mit `timingSafeEqual`. Der Reset-Link (30 Minuten gültig) trägt einen Fingerabdruck des aktuellen Passwort-Hashes: Sobald das Passwort geändert wurde, ist der Link automatisch verbraucht.

**Blog als Mini-CMS**
`lib/posts.ts` kapselt die Firestore-Logik, `lib/postContent.ts` validiert und normalisiert eingehende Blöcke. Ein Beitrag ist eine Liste typisierter Blöcke (Absatz, Überschrift, Bild, Zitat, Liste, Button, Trenner), die im Admin per Block-Editor zusammengestellt wird. Sortiert wird bewusst im Code statt per `orderBy`: Firestore schliesst Dokumente ohne das sortierte Feld stillschweigend aus dem Ergebnis aus — so verschwindet kein Beitrag. Nach jedem Speichern werden Startseite, Blog-Übersicht und Beitragsseite über `revalidatePath` neu gebaut.

**Bilder und Aufräumen**
`/api/admin/upload` prüft Typ (JPG, PNG, WebP, AVIF) und Grösse (max. 8 MB), liest die Bildmasse ohne zusätzliche Abhängigkeit direkt aus dem Datei-Header (`lib/imageSize.ts`) und legt die Datei öffentlich in Vercel Blob ab. Wird ein Titelbild ausgetauscht, ein Bildblock entfernt oder ein Beitrag gelöscht, räumt `lib/blobCleanup.ts` die verwaisten Dateien weg — aber nur, wenn sie in keinem anderen Beitrag mehr vorkommen, und nur im eigenen Blob Store. `npm run blob:orphans` listet übrig gebliebene Dateien auf und löscht sie mit `-- --delete`.

**Rate-Limiting (`lib/rateLimit.ts`)**
Alle Zähler liegen in Firestore, nicht im Arbeitsspeicher: Auf Vercel laufen mehrere Funktionsinstanzen parallel und werden ständig neu gestartet — ein Zähler im Speicher würde pro Instanz einzeln zählen, aus „5 Versuche“ würden bei zehn Instanzen faktisch 50, und ein Neustart setzte alles zurück. Der Schlüssel (meist die IP) wird nur als Hash gespeichert. Wer gesperrt ist, wird zusätzlich kurz im Speicher der Instanz vermerkt, damit ein laufender Angriff keine Datenbankzugriffe mehr kostet. Fällt Firestore aus, gehen Anfragen bewusst durch — ein blockiertes Kontaktformular oder eine gesperrte Anmeldung wären schlimmer als ein paar ungebremste Anfragen.

Zwei Betriebsarten:
- **Kontingent verbrauchen** (`consumeQuota`) — jeder Aufruf zählt. Für die öffentlichen Formulare und für „Passwort vergessen“, weil dort jeder Aufruf eine Mail kostet.
- **Nur Fehlversuche zählen** (`isRateLimited` + `recordFailure` + `clearFailures`) — für den Login. Eine erfolgreiche Anmeldung löscht den Zähler, sonst würde sich Silke mit fünf ganz normalen Anmeldungen selbst aussperren.

**Schutz der öffentlichen Formulare**
`lib/formGuard.ts` prüft vor jeder Datenbank- oder Mail-Aktion: ein unsichtbares Honeypot-Feld (Bots bekommen eine ganz normale Erfolgsantwort), 20 Anfragen pro Stunde und Absender sowie 80 pro Stunde für die ganze Seite als Notbremse gegen verteilte Angriffe. Das Limit pro Absender ist bewusst grosszügig: Hinter einer IP können viele Menschen stehen (Mobilfunk, Büro, Hotel-WLAN), und eine verlorene echte Anfrage wiegt schwerer als ein paar zusätzliche Mails. Wer trotzdem anläuft, bekommt in der Fehlermeldung die direkte E-Mail-Adresse genannt.

**Kontakt und Lead-Magnet**
Beide Formulare speichern die Anfrage in der Collection `submissions` und schicken parallel eine Benachrichtigung per Resend, mit `replyTo` auf die Adresse der Absenderin. Im Admin lassen sich Anfragen als gelesen markieren, löschen und — bei Lead-Magnet-Anfragen — die Reflexionsfragen mit einem Klick versenden. Die Vorlage dafür liegt in `settings/reflexionsfragen`, `{name}` wird beim Versand ersetzt, das Datum der Zustellung landet an der Anfrage.

**E-Mail-Versand**
Resend verschickt ausschliesslich über die verifizierte Domain `silke-metzinger.com` (`MAIL_FROM` in `lib/site.ts`); Antworten landen über `Reply-To` trotzdem im gewohnten Postfach. Solange `TEST_EMAIL_REDIRECT` gesetzt ist, gehen Fragebogen- und Reset-Mails an diese Adresse statt an die Empfängerin, mit `[TEST → …]` im Betreff.

**SEO und Auffindbarkeit**
Strukturierte Daten als zusammenhängender Graph (`Person`, `ProfessionalService` mit beiden Standorten, `WebSite`), pro Beitrag `BlogPosting` bzw. `Event`, dazu Breadcrumbs. Sitemap mit echten Änderungsdaten, RSS-Feed unter `/blog/feed.xml`, `robots.txt` ohne `/admin`, `/api/` und Vorschau-Links. Vorschaubilder erzeugt `next/og` zur Laufzeit — für die Startseite mit eingebettetem Foto, für Beiträge mit Titelbild oder Markenhintergrund; die Schriftgrösse passt sich der Titellänge an.

## 🚀 Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000). Der Admin-Bereich ist nur über `http://localhost:3000/admin?key=<ADMIN_GATE_KEY>` erreichbar.

Weitere Befehle:

```bash
npm run build          # Production-Build
npm run start          # Production-Build starten
npm run lint           # ESLint-Prüfung
npm run blob:orphans   # ungenutzte Bilder im Blob Store auflisten
npm run blob:orphans -- --delete   # und löschen
```

## 🔑 Umgebungsvariablen

Lege eine `.env.local` mit folgenden Schlüsseln an:

```bash
# Zugriff auf /admin (Erstanlage — danach in der Admin-Oberfläche änderbar)
ADMIN_EMAIL=
ADMIN_PASSWORD=
SESSION_SECRET=          # signiert Session- und Passwort-Reset-Token
ADMIN_GATE_KEY=          # der geheime Wert hinter ?key=
ADMIN_GATE_SECRET=       # signiert das Gate-Cookie

# Vercel Blob (Beitragsbilder)
BLOB_READ_WRITE_TOKEN=

# Firebase Admin SDK (Firestore) — entweder das komplette Service-Konto …
FIREBASE_SERVICE_ACCOUNT_BASE64=
# … oder die Einzelwerte:
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=            # alternativ FIREBASE_PRIVATE_KEY_BASE64

# Resend
RESEND_API_KEY=
CONTACT_EMAIL_TO=        # Empfängerin der Kontaktformular-Mails
CONTACT_EMAIL_FROM=      # optional, überschreibt MAIL_FROM aus lib/site.ts
LEAD_MAGNET_EMAIL_TO=    # optional, Empfängerin der Lead-Magnet-Benachrichtigung

# Optional
TEST_EMAIL_REDIRECT=       # leitet Fragebogen- und Reset-Mails zum Testen um
GOOGLE_SITE_VERIFICATION=  # Bestätigungscode der Google Search Console
```

## 🗄 Datenmodell

| Collection / Dokument | Inhalt |
| --- | --- |
| `posts` | Beiträge, Ankündigungen und Events (`types/post.ts`): Typ, Titel, Slug, Kurzbeschreibung, Titelbild, Blockliste, Event-Felder, Status, Veröffentlichungsdatum, `pinned` |
| `submissions` | Kontakt- und Lead-Magnet-Anfragen (`types/submission.ts`): Name, E-Mail, Nachricht, `read`, `questionsSentAt` |
| `settings/admin_account` | E-Mail und `scrypt`-Hash des Admin-Passworts |
| `settings/reflexionsfragen` | Vorlage der Reflexionsfragen (`types/questionnaire.ts`): Betreff, Intro, Fragenliste, Schluss |
| `rateLimits` | Zählerfenster für Formulare, Login und Passwort-Reset, Schlüssel als Hash |

## ☁️ Deployment

Das Projekt ist für das Deployment über **Vercel** eingerichtet (siehe `.vercel/`):

1. Repository mit Vercel verbinden.
2. Alle Umgebungsvariablen aus dem Abschnitt oben in den Projekteinstellungen hinterlegen.
3. Sicherstellen, dass **Vercel Blob** verknüpft ist (für den Bild-Upload) — das Token wird beim Verknüpfen des Storage automatisch gesetzt.
4. Die Absender-Domain bei **Resend** verifizieren und `TEST_EMAIL_REDIRECT` in Produktion weglassen.
5. Ein Push auf den Hauptbranch löst automatisch Build und Deployment aus.

Werden Fotos in `public/` unter gleichem Namen ersetzt, die Zahl in `lib/assetVersion.ts` um 1 erhöhen — sonst liefern Browser- und Bild-Cache weiter das alte Foto aus.

## 📁 Projektstruktur

```
├── app/
│   ├── page.tsx               # Startseite (Zusammensetzung der Sektionen)
│   ├── layout.tsx             # Root-Layout, Fonts, Metadaten
│   ├── opengraph-image.tsx    # Vorschaubild der Startseite
│   ├── sitemap.ts, robots.ts  # Sitemap und robots.txt
│   ├── not-found.tsx          # eigene 404-Seite
│   ├── blog/
│   │   ├── page.tsx           # Übersicht mit Filter und Suche
│   │   ├── feed.xml/          # RSS-Feed
│   │   └── [slug]/            # Beitragsseite + Vorschaubild
│   ├── admin/                 # Privates CMS (durch Middleware geschützt)
│   │   ├── page.tsx           # Übersicht mit vier Tabs
│   │   ├── PostForm.tsx       # Formular für Beiträge
│   │   ├── BlockEditor.tsx    # Block-Editor für den Inhalt
│   │   ├── QuestionnaireForm.tsx, AccountForm.tsx
│   │   ├── login/, reset-password/
│   │   └── posts/new/, posts/[id]/edit/
│   ├── api/
│   │   ├── contact/, lead-magnet/     # öffentliche Formulare
│   │   └── admin/                     # login, logout, forgot/reset-password,
│   │                                  # account, posts, upload, questionnaire,
│   │                                  # submissions
│   ├── datenschutz/, impressum/
├── components/
│   ├── Hero, Pillars, About, HowIWork, Services, Qualifications,
│   │   CallToAction, NewsEvents, Contact, Navbar, Footer   # Sektionen
│   ├── Blog/                  # PostCard, PostArticle, PostBody, BlogIndex, …
│   ├── LeadMagnet/            # Sektion und Modal
│   ├── motion/                # Reveal, ScrollProgress, ScrollToTop
│   └── ui/, icons/            # wiederverwendbare Elemente
├── lib/
│   ├── firebaseAdmin.ts       # Initialisierung des Firebase Admin SDK
│   ├── posts.ts, postContent.ts, postDate.ts, postFilter.ts, slug.ts
│   ├── submissions.ts, questionnaire.ts, questionnaireLabel.ts
│   ├── adminAccount.ts, session.ts, gate.ts, passwordReset.ts
│   ├── rateLimit.ts                     # Zähler in Firestore (Formulare + Login)
│   ├── formGuard.ts, honeypot.ts        # Schutz der öffentlichen Formulare
│   ├── blobCleanup.ts, imageSize.ts     # Bilder
│   └── site.ts, structuredData.ts, ogFont.ts, assetVersion.ts
├── middleware.ts              # Schutz für /admin und /api/admin
├── scripts/blob-orphans.mjs   # Audit ungenutzter Blob-Dateien
├── types/                     # post.ts, submission.ts, questionnaire.ts
└── public/                    # Statische Assets (Fotos, Logo)
```

---

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Firebase Firestore · Vercel Blob · Resend
