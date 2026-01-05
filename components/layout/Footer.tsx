import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="mt-auto w-full"
      style={{ 
        backgroundColor: '#1a1a2e',
        borderTop: '1px solid #2d2d44',
        position: 'relative',
        zIndex: 10,
        paddingBottom: '2rem'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: '#3b82f6' }}
              >
                PSR
              </div>
              <span 
                className="font-bold text-white text-lg"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif'
                }}
              >
                PSR Train
              </span>
            </div>
            <p className="text-sm mb-4 text-gray-300">
              Professional Police Station Representative training platform.
            </p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} PSR Train. All rights reserved.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 
              className="font-semibold mb-4 text-sm text-white"
            >
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://policestationagent.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  PoliceStationAgent.com
                </a>
              </li>
              <li>
                <a 
                  href="https://policestationrepuk.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  PoliceStationRepUK.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 
              className="font-semibold mb-4 text-sm text-white"
            >
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/legal-advice" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white font-medium"
                >
                  Legal Advice Hub
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/privacy" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/terms" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/disclaimer" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 
              className="font-semibold mb-4 text-sm text-white"
            >
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/legal/faq" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/contact" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/about" 
                  className="transition-colors hover:underline text-gray-300 hover:text-white"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
