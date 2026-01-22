import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto" data-testid="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">PSR Training Academy</h3>
            <p className="text-sm text-muted-foreground">
              Police Station Representative Accreditation Training Platform
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Training</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/practice" className="text-muted-foreground hover:text-foreground">
                  Practice
                </Link>
              </li>
              <li>
                <Link href="/mock-exam" className="text-muted-foreground hover:text-foreground">
                  Mock Exam
                </Link>
              </li>
              <li>
                <Link href="/incidents" className="text-muted-foreground hover:text-foreground">
                  Critical Incidents
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="text-muted-foreground hover:text-foreground">
                  Syllabus
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/coverage" className="text-muted-foreground hover:text-foreground">
                  Coverage Matrix
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PSR Training Academy. Training purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
