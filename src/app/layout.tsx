import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SenpaiSucks",
  description: "A Next.js 15 app configured with TypeScript, ESLint, Tailwind CSS, src directory, App Router, and Turbopack.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
