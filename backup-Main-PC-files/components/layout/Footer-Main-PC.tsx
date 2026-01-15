import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-navy-800" />
              </div>
              <span className="font-bold text-lg">PSR ACADEMY</span>
            </div>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              The premier training platform for aspiring Police Station Representatives. Fully accredited content, AI-powered simulations, and expert guidance.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a 
                href="https://policestationagent.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent-400 transition-colors inline-flex items-center gap-1"
              >
                policestationagent.com
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://policestationrepuk.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:text-accent-400 transition-colors inline-flex items-center gap-1"
              >
                policestationrepuk.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/legal/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/legal/faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-white/70 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="text-white/70 hover:text-white transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Training Links */}
          <div>
            <h3 className="font-bold mb-4 text-white">Training</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/modules" className="text-white/70 hover:text-white transition-colors">
                  Learning Modules
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-white/70 hover:text-white transition-colors">
                  Practice Questions
                </Link>
              </li>
              <li>
                <Link href="/scenarios" className="text-white/70 hover:text-white transition-colors">
                  Scenario Simulations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} PSR ACADEMY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
