import type { Metadata } from "next";
import MomentumApp from "../momentum/MomentumApp";

export const metadata: Metadata = {
  title: "Momentum OS App",
  description: "Momentum OS productivity workspace demo.",
};

export default function AppPage() {
  return <MomentumApp />;
}
