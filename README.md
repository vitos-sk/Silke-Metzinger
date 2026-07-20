# 🌿 Silke Metzinger — Vital & Frei

Werbewebsite und Mini-CMS für die Praxis von Silke Metzinger (Ernährungsberatung & Resilienzcoaching). Der öffentliche Bereich ist eine statische One-Page-Website auf Deutsch mit Animationen; der private Bereich ist ein zweifach abgesichertes Admin-Panel zur Verwaltung des News/Events-Bereichs, ohne dass dafür eine Entwicklerin gebraucht wird.

## 📋 Inhaltsverzeichnis

- [Projektbeschreibung](#-projektbeschreibung)
- [Hauptfunktionen](#-hauptfunktionen)
- [Technologie-Stack](#-technologie-stack)
- [Architektur](#-architektur)
- [Schnellstart](#-schnellstart)
- [Umgebungsvariablen](#-umgebungsvariablen)
- [Deployment](#-deployment)
- [Projektstruktur](#-projektstruktur)

## 🎯 Projektbeschreibung

Das Projekt besteht aus zwei Bereichen:

**Öffentliche Website** — eine One-Page-Site (`/`) mit den Sektionen Hero, Pillars, About, HowIWork, Qualifications, Services, News/Events und Contact. Sanftes Scrollen, Viewport-Animationen und ein Fortschrittsbalken im Header werden mit `motion` (Framer Motion) umgesetzt. Das Kontaktformular verschickt eine E-Mail an die Praxisinhaberin über Resend.

**Privates Admin-Panel** (`/admin`) — ein schlankes CMS für News/Events-Karten: Anlegen, Bearbeiten, Löschen, Bildupload. Der Bereich ist für Unbefugte physisch nicht erreichbar: Ohne gültigen Gate-Key in der URL liefert jede Anfrage an `/admin/*` und `/api/admin/*` ein `404`, als gäbe es die Route gar nicht.

## ✨ Hauptfunktionen

### Für Besucher der Website
- 🎨 One-Page-Layout mit sanfter Sektionsnavigation und aktiver Menü-Hervorhebung (Intersection Observer)
- 🎬 Scroll-Animationen und Lesefortschritts-Balken
- 📅 News/Events-Block mit Eventkarten (Bild, Datum, Beschreibung, Link)
- ✉️ Kontaktformular mit serverseitiger Validierung und E-Mail-Versand
- 📱 Vollständig responsives Layout, optimierte Fonts (next/font)

### Für die Administratorin
- 🔒 Zweistufiger Zugriff: ein geheimer Gate-Link verbirgt die Existenz von `/admin`, ein separates Passwort öffnet danach die Session
- 🛡️ Rate-Limiting bei Login-Versuchen (5 Versuche / 15 Minuten) sowie zeitkonstante Vergleiche von Passwort und Gate-Key
- 🗓️ CRUD für News/Events-Karten (Titel, Datum, Beschreibung, Bild, Link, Sortierreihenfolge)
- 🖼️ Bild-Upload für Events per Klick in einen Cloud-Speicher
- 🚪 Session-Verwaltung (Login/Logout) über JWT-Cookies mit begrenzter Lebensdauer (12 Stunden)

## 🛠 Technologie-Stack

### Frontend
- **Next.js 16** (App Router) — Framework, SSR/Route Handlers, Edge Middleware
- **React 19** — UI-Bibliothek
- **TypeScript 5** — statische Typisierung
- **Tailwind CSS 4** — Utility-First-Styling
- **Motion (Framer Motion) 12** — Animationen, Scroll-Effekte
- **Lucide React** — Icons
- **next/font** — Google Fonts (Playfair Display, Inter, Cormorant), lokal optimiert

### Backend / API
- **Next.js Route Handlers** — REST-ähnliche API-Endpunkte (`/api/admin/*`, `/api/contact`)
- **Edge Middleware** — zweistufiger Schutz des Admin-Bereichs (Gate + Session)
- **jose** — Signierung/Verifizierung von JWTs (HS256) für Gate- und Session-Cookies
- **Node.js `crypto`** (`timingSafeEqual`) — zeitkonstanter Vergleich des Admin-Passworts

### Daten & Integrationen
- **Firebase Admin SDK + Firestore** — Datenbank für die Collection `events`
- **Vercel Blob** — Speicher für hochgeladene Event-Bilder
- **Resend** — transaktionaler Versand der Kontaktformular-E-Mails

### Infrastruktur
- **Vercel** — Hosting, Deployment, Serverless/Edge Runtime, Blob Storage, OIDC
- **ESLint 9** (`eslint-config-next`) — Linting

## 🏗 Architektur

```
                         ┌───────────────────────────┐
                         │         Besucher            │
                         └─────────────┬─────────────┘
                                        │ HTTPS
                                        ▼
                         ┌───────────────────────────┐
                         │   Next.js App Router       │
                         │   (Vercel, Edge + Node)    │
                         └─────────────┬─────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                ▼                       ▼                       ▼
     ┌───────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐
     │  Öffentliche Site   │  │   Edge Middleware     │  │  API Route Handlers  │
     │  app/page.tsx +     │  │  Gate-Cookie (JWT)     │  │  /api/contact         │
     │  Sektions-Komponenten│ │  Session-Cookie (JWT)  │  │  /api/admin/*         │
     └───────────────────┘  │  → 404 ohne Gate-Key    │  └──────────┬────────────┘
                             └──────────┬───────────┘             │
                                        ▼                         │
                             ┌─────────────────────┐              │
                             │   /admin (React)      │              │
                             │  News/Events CRUD-UI   │              │
                             └──────────┬───────────┘              │
                                        └─────────────┬─────────────┘
                                                       ▼
                       ┌───────────────────┬───────────────────┬───────────────────┐
                       ▼                   ▼                   ▼
             ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
             │ Firebase         │ │ Vercel Blob      │ │ Resend           │
             │ Firestore        │ │ (Event-Bilder)   │ │ (Kontaktformular-│
             │ (Collection      │ │                  │ │  E-Mails)        │
             │  events)         │ │                  │ │                  │
             └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Zentrale Mechanismen

**Gate + Session (doppeltes Schloss über `/admin`)**
`middleware.ts` fängt alle Anfragen an `/admin/:path*` und `/api/admin/:path*` ab. Ohne gültiges `admin_gate`-Cookie oder `?key=` in der URL liefert der Bereich ein `404` — er ist für zufällige Besucher und Scanner „unsichtbar“. Nach einem gültigen Gate-Key wird ein eigenes JWT ausgestellt (`lib/gate.ts`), ein vollständiger Login per Passwort (`/api/admin/login`) erzeugt zusätzlich eine zweite JWT-Session (`lib/session.ts`) — beide auf Basis von `jose`/HS256, beide Cookies `httpOnly`, `sameSite=lax`, mit begrenzter TTL.

**News/Events als Mini-CMS**
`lib/events.ts` kapselt die gesamte Firestore-Logik (`listEvents`, `getEvent`, `createEvent`, `updateEvent`, `deleteEvent`). Das Admin-Panel (`app/admin/**`) besteht aus Next.js Server Components, die Daten direkt beim Rendern laden, sowie Client-Formularen, die gegen `/api/admin/events` sprechen.

**Bild-Upload**
`/api/admin/upload` nimmt `multipart/form-data` entgegen und legt die Datei mit öffentlichem Zugriff in Vercel Blob ab; die zurückgegebene CDN-URL wird direkt in der Event-Karte gespeichert.

**Kontaktformular**
`/api/contact` validiert die Felder serverseitig und verschickt die Nachricht über Resend mit `replyTo` auf die Adresse der Absenderin — die Kommunikation läuft direkt weiter, ohne dass Nachrichten in einer Datenbank gespeichert werden.

## 🚀 Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

Weitere Befehle:

```bash
npm run build   # Production-Build
npm run start   # Production-Build starten
npm run lint    # ESLint-Prüfung
```

## 🔑 Umgebungsvariablen

Lege eine `.env.local` mit folgenden Schlüsseln an:

```bash
# Zugriff auf /admin
ADMIN_PASSWORD=
SESSION_SECRET=
ADMIN_GATE_KEY=
ADMIN_GATE_SECRET=

# Vercel Blob (Event-Bilder)
BLOB_READ_WRITE_TOKEN=

# Firebase Admin SDK (Firestore)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Resend (Kontaktformular)
RESEND_API_KEY=
CONTACT_EMAIL_TO=
CONTACT_EMAIL_FROM=
```

## ☁️ Deployment

Das Projekt ist für das Deployment über **Vercel** eingerichtet (siehe `.vercel/`):

1. Repository mit Vercel verbinden.
2. Alle Umgebungsvariablen aus dem Abschnitt oben in den Projekteinstellungen hinterlegen.
3. Sicherstellen, dass **Vercel Blob** verknüpft ist (für den Bild-Upload) — das Token wird beim Verknüpfen des Storage automatisch gesetzt.
4. Ein Push auf den Hauptbranch löst automatisch Build und Deployment aus.

## 📁 Projektstruktur

```
├── app/
│   ├── page.tsx              # Öffentliche Website (Zusammensetzung der Sektionen)
│   ├── layout.tsx            # Root-Layout, Fonts, Metadaten
│   ├── admin/                # Privates CMS (durch Middleware geschützt)
│   │   ├── page.tsx          # Event-Liste
│   │   ├── login/            # Login-Formular
│   │   └── events/           # Event anlegen/bearbeiten
│   ├── api/
│   │   ├── contact/          # Verarbeitung des Kontaktformulars (Resend)
│   │   └── admin/            # login / logout / upload / events CRUD
│   ├── datenschutz/          # Datenschutzerklärung
│   └── impressum/            # Impressum
├── components/
│   ├── Hero, Pillars, About, HowIWork,
│   │   Qualifications, Services,
│   │   NewsEvents, Contact, Footer, Navbar   # Sektionen der Website
│   ├── motion/                # Animations-Wrapper (Framer Motion)
│   └── ui/                    # Wiederverwendbare UI-Elemente
├── lib/
│   ├── firebaseAdmin.ts      # Initialisierung des Firebase Admin SDK
│   ├── events.ts             # Firestore-Repository für Events
│   ├── gate.ts                # JWT-Gate-Token für /admin
│   └── session.ts             # JWT-Session-Token für /admin
├── middleware.ts               # Edge-Schutz für /admin und /api/admin
├── types/event.ts              # Typen NewsEvent / NewsEventInput
└── public/                     # Statische Assets (Fotos, Logo)
```

---

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Firebase Firestore · Vercel Blob · Resend
