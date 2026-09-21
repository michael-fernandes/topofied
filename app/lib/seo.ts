// Single source of truth for site identity and structured data.
// Pure data + builders — no React, no DOM, so it's trivially unit-testable.

export const SITE_URL = "https://mferns.com";
export const SITE_NAME = "Michael Fernandes";

/** The role phrasing recruiters actually search. Used in titles and JSON-LD. */
export const ROLE = "Data Visualization Developer & Design Engineer";
export const LOCALITY = "Seattle";
export const REGION = "WA";

export const SITE_TITLE = `${SITE_NAME} — ${ROLE}`;

export const SITE_DESCRIPTION =
  "Michael Fernandes is a Seattle-based data visualization developer and design engineer — D3, React, and TypeScript. Case studies include the IHME COVID-19 forecast dashboard and a CHI-published uncertainty display for transit.";

/** Alternate job titles Google can match against a recruiter's query. */
export const JOB_TITLES = [
  "Data Visualization Developer",
  "Data Visualization Design Engineer",
  "Data Viz Developer",
  "Design Engineer",
  "UX Engineer",
  "Front-End Engineer",
];

export const KNOWS_ABOUT = [
  "Data visualization",
  "Information design",
  "D3.js",
  "React",
  "TypeScript",
  "Uncertainty visualization",
  "Interactive data applications",
  "Design systems",
  "Front-end engineering",
  "Human-computer interaction",
];

/** Profiles that let search engines resolve this site to one person. */
export const SAME_AS = ["https://github.com/michael-fernandes"];

export type JsonLdObject = Record<string, unknown>;

export function personJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: JOB_TITLES,
    description: SITE_DESCRIPTION,
    email: "m.fern93@gmail.com",
    knowsAbout: KNOWS_ABOUT,
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressRegion: REGION,
      addressCountry: "US",
    },
  };
}

export function webSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${SITE_NAME} — ${ROLE}`,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#person` },
  };
}

/** Case-study markup: a page about a project, authored by the Person. */
export function caseStudyJsonLd(args: {
  path: string;
  name: string;
  description: string;
  datePublished: string;
  keywords: string[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}${args.path}#work`,
    url: `${SITE_URL}${args.path}`,
    name: args.name,
    description: args.description,
    datePublished: args.datePublished,
    keywords: args.keywords.join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
