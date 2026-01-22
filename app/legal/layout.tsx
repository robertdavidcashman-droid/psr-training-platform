import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--gold))]">
              <GraduationCap className="h-5 w-5 text-[hsl(var(--gold-foreground))]" />
            </div>
            <span className="font-semibold text-xl">PSR Academy</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/disclaimer" className="text-muted-foreground hover:text-foreground">
              Disclaimer
            </Link>
            <Link href="/legal/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} PSR Training Academy. Training purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
