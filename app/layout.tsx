import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://momentum-os.local"),
  title: {
    default: "Momentum OS - Think Less. Execute More.",
    template: "%s | Momentum OS",
  },
  description:
    "An AI-powered productivity operating system for goals, tasks, calendar planning, reviews, journaling, and progress tracking.",
  keywords: [
    "Momentum OS",
    "productivity",
    "AI planning",
    "task management",
    "goals",
    "calendar",
  ],
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
