import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div>
          <span className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>PSR Train</span>
          <p className="text-slate-300 mt-2">Practice, learn, and prepare for PSRAS accreditation.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <h3 className="font-semibold mb-2">Explore</h3>
            <Link href="/modules" className="block text-slate-400 hover:text-white">Modules</Link>
            <Link href="/portfolio" className="block text-slate-400 hover:text-white">Portfolio Guide</Link>
            <Link href="/critical-incidents" className="block text-slate-400 hover:text-white">Critical Incidents</Link>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <Link href="/legal/privacy" className="block text-slate-400 hover:text-white">Privacy</Link>
            <Link href="/legal/terms" className="block text-slate-400 hover:text-white">Terms</Link>
            <Link href="/legal/contact" className="block text-slate-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} PSR Train. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
