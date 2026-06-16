import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Momentum - Productivity OS",
  description:
    "Daily planner, monthly goals, annual objectives, analytics, and streaks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
