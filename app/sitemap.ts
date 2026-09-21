import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/work", changeFrequency: "monthly", priority: 0.9 },
    { path: "/work/covid-forecasting", changeFrequency: "yearly", priority: 0.8 },
    { path: "/work/uncertainty-displays-for-transit", changeFrequency: "yearly", priority: 0.8 },
    { path: "/projects/interactive-dots", changeFrequency: "yearly", priority: 0.5 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    // /collaborate is noindex while its copy is still placeholder.
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: "2026-09-20",
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
