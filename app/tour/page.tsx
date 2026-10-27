import type { Metadata } from "next";
import SkiTour from "../components/ski-tour/ski-tour";

export const metadata: Metadata = {
  title: "Ski tour",
  description:
    "Skin up a contour-lined mountain range with your arrow keys. Each summit hides a different part of Michael Fernandes's portfolio.",
  alternates: { canonical: "/tour" },
};

export default function TourPage() {
  return <SkiTour />;
}
