import type { Metadata } from "next";
import { LandingPage } from "./components/LandingPage";

export const metadata: Metadata = {
  title: "Momentum OS - Think Less. Execute More.",
  description:
    "An AI-powered productivity operating system that transforms goals into actionable plans, organizes tasks, tracks progress, and helps you build momentum every day.",
  openGraph: {
    title: "Momentum OS",
    description:
      "Think Less. Execute More. Plan goals, schedule tasks, review progress, and build momentum.",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}
