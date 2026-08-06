import {
  CONTACT_EMAIL,
  LOCATIONS,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/site";

// Feste IDs, damit die einzelnen Objekte aufeinander verweisen können, statt
// sich gegenseitig zu wiederholen. Google folgt diesen Verweisen.
const PERSON_ID = `${SITE_URL}/#person`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SAME_AS = [
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.instagram,
  SOCIAL_PROFILES.linkedin,
];

function postalAddress(location: (typeof LOCATIONS)[number]) {
  return {
    "@type": "PostalAddress",
    streetAddress: location.street,
    postalCode: location.postalCode,
    addressLocality: location.city,
    addressRegion: location.region,
    addressCountry: location.country,
  };
}

/**
 * Strukturierte Daten der Startseite: Wer ist das, wo sitzt sie, was bietet
 * sie an. Ohne diese Angaben muss Google alles aus dem Fliesstext raten.
 *
 * Die Schweizer Adresse steht zuerst — sie ist der Hauptstandort (Domain .ch).
 */
export function buildHomeJsonLd() {
  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    jobTitle: "Ernährungsberaterin, Resilienz-Coach & Mentorin",
    description:
      "Silke Metzinger begleitet Menschen zu mehr Gesundheit, Energie und innerer Stärke — mit Ernährungsberatung, Vitalstoff-Wissen und Resilienz-Coaching.",
    email: CONTACT_EMAIL,
    telephone: LOCATIONS[0].phone,
    address: postalAddress(LOCATIONS[0]),
    sameAs: SAME_AS,
    knowsLanguage: ["de"],
    worksFor: { "@id": BUSINESS_ID },
  };

  const business = {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    alternateName: "Silke Metzinger — Vital & Frei",
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    description:
      "Ernährungsberatung, Resilienz-Coaching und persönliche Begleitung in Hildisrieden bei Luzern — vor Ort und online.",
    email: CONTACT_EMAIL,
    telephone: LOCATIONS[0].phone,
    address: LOCATIONS.map(postalAddress),
    founder: { "@id": PERSON_ID },
    sameAs: SAME_AS,
    availableLanguage: "de",
    areaServed: [
      { "@type": "AdministrativeArea", name: "Kanton Luzern" },
      { "@type": "Country", name: "Schweiz" },
      { "@type": "Country", name: "Deutschland" },
    ],
    knowsAbout: [
      "Ernährungsberatung",
      "Mikronährstoffe",
      "Darmgesundheit",
      "Resilienz",
      "Stressbewältigung",
      "Persönliche Entwicklung",
    ],
    contactPoint: LOCATIONS.map((location) => ({
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: location.phone,
      email: CONTACT_EMAIL,
      areaServed: location.country,
      availableLanguage: "de",
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "de-CH",
    publisher: { "@id": PERSON_ID },
  };

  return { "@context": "https://schema.org", "@graph": [person, business, website] };
}

/** Startseite → Blog → (optional) Beitrag. */
export function buildBreadcrumbJsonLd(
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Startseite", path: "/" }, ...trail].map(
      (entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        item: `${SITE_URL}${entry.path === "/" ? "" : entry.path}`,
      }),
    ),
  };
}

/** Liste der Beiträge auf der Blog-Übersicht. */
export function buildBlogListJsonLd(posts: { title: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: `Blog — ${SITE_NAME}`,
    inLanguage: "de-CH",
    publisher: { "@id": PERSON_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };
}

/**
 * Kompakte Autor-Angabe für Unterseiten. Die @id ist dieselbe wie auf der
 * Startseite, damit Google beide Vorkommen als eine Person erkennt — Name und
 * URL stehen trotzdem dabei, weil eine Unterseite für sich lesbar bleiben muss.
 */
export function authorPerson() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
  };
}
