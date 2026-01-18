import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Brain, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const featureList = [
  {
    label: 'Practice Questions',
    copy: 'Hundreds of exam-style questions with detailed explanations.',
    icon: <Brain className="w-6 h-6 text-blue-600" />,
    color: 'bg-blue-100',
  },
  {
    label: 'PACE Codes',
    copy: 'Searchable, annotated references for every PACE code.',
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
    color: 'bg-emerald-100',
  },
  {
    label: 'Mock Exams',
    copy: 'Timed simulations that mirror the real accreditation test.',
    icon: <Shield className="w-6 h-6 text-amber-600" />,
    color: 'bg-amber-100',
  },
  {
    label: 'Certificates',
    copy: 'Track your achievements as you progress through the syllabus.',
    icon: <GraduationCap className="w-6 h-6 text-rose-600" />,
    color: 'bg-rose-100',
  },
];

const highlights = [
  'Comprehensive question bank covering all PSR accreditation topics',
  'Interactive PACE Code reference with quick search',
  'Track your progress with detailed performance analytics',
  'Flashcards and scenario simulations for deeper learning',
  'Mobile-friendly experience so you can study anywhere',
  'Trusted by aspiring Police Station Representatives across the UK',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              PSR
            </div>
            <span className="font-bold text-xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
              PSR Train
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/modules">
              <Button variant="outline" size="sm">
                Explore Modules
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="navy" size="sm">
                View Portfolio Guide
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Become a qualified<br />
              <span className="text-primary">Police Station Representative</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              PSR Train is the complete resource for PSRAS accreditation prep. Practice exam-quality questions, master PACE codes, and learn the scenario skills that examiners expect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/modules">
                <Button variant="navy" size="lg" className="w-full sm:w-auto gap-2">
                  Start Training Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn About the Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
              Everything you need for PSR accreditation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureList.map((feature) => (
                <Card key={feature.label} className="border-0 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.label}</h3>
                    <p className="text-sm text-slate-600">{feature.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
              Why aspiring PSRs train with us
            </h2>
            <div className="space-y-4">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-primary">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to start your PSR journey?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join hundreds of aspiring Police Station Representatives who trust PSR Train to stay exam-ready.
            </p>
            <Link href="/modules">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 gap-2">
                Explore Modules
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                PSR
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>PSR Train</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-white">Terms</Link>
              <Link href="/legal/contact" className="hover:text-white">Contact</Link>
              <a href="https://policestationagent.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Jobs
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            © {new Date().getFullYear()} PSR Train. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
