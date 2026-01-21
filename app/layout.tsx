import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PSR Training Academy",
  description:
    "Police Station Representative Accreditation Training Platform - Master the skills and knowledge for PSR accreditation",
  keywords: [
    "PSR",
    "Police Station Representative",
    "Accreditation",
    "Training",
    "PACE",
    "Criminal Law",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="ui-scale-init" strategy="beforeInteractive">
          {`(function(){try{var v=localStorage.getItem("psr_ui_scale");if(!v)return;try{v=JSON.parse(v);}catch(e){}if(v==="sm"||v==="md"||v==="lg"){document.documentElement.dataset.uiScale=v;}}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
