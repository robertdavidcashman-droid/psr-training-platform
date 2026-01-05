import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "PSR Train - Police Station Representative Training",
    template: "%s | PSR Train"
  },
  description: "Professional training platform for Police Station Representatives. Practice questions, mock exams, PACE codes, flashcards, and comprehensive study materials for PSR accreditation.",
  keywords: ["PSR", "Police Station Representative", "PACE", "Training", "Legal Training", "Police Station", "Accreditation", "Mock Exam"],
  authors: [{ name: "PSR Train" }],
  creator: "PSR Train",
  publisher: "PSR Train",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PSR Train - Police Station Representative Training",
    description: "Professional training platform for Police Station Representatives",
    url: '/',
    siteName: "PSR Train",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

