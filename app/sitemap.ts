import type { MetadataRoute } from "next";

const SITE_URL = "https://mferns.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/work", changeFrequency: "monthly", priority: 0.9 },
    { path: "/work/covid-forecasting", changeFrequency: "yearly", priority: 0.8 },
    { path: "/work/uncertainty-displays-for-transit", changeFrequency: "yearly", priority: 0.8 },
    { path: "/projects/interactive-dots", changeFrequency: "yearly", priority: 0.5 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/collaborate", changeFrequency: "monthly", priority: 0.6 },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: "2026-07-15",
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
