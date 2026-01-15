import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Brain, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              PSR
            </div>
            <span className="font-bold text-xl text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
              PSR Train
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="navy" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Become a Qualified<br />
              <span style={{ color: '#1e3a5f' }}>Police Station Representative</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              The complete training platform for PSR accreditation. Practice questions, 
              learn PACE codes, and prepare for your police station representative certification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="navy" size="lg" className="w-full sm:w-auto gap-2">
                  Start Training Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  I Have an Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
              Everything You Need to Pass Your PSR Accreditation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Practice Questions</h3>
                  <p className="text-sm text-slate-600">
                    Hundreds of exam-style questions with detailed explanations.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">PACE Codes</h3>
                  <p className="text-sm text-slate-600">
                    Complete PACE Code navigator with searchable content.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Mock Exams</h3>
                  <p className="text-sm text-slate-600">
                    Timed mock exams that simulate the real accreditation test.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Certificates</h3>
                  <p className="text-sm text-slate-600">
                    Track your progress and earn completion certificates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
              Why Train With PSR Train?
            </h2>
            <div className="space-y-4">
              {[
                'Comprehensive question bank covering all PSR accreditation topics',
                'Interactive PACE Code reference with quick search',
                'Track your progress with detailed performance analytics',
                'Flashcards and scenario simulations for deeper learning',
                'Mobile-friendly - study anywhere, anytime',
                'Trusted by aspiring Police Station Representatives across the UK',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: '#1e3a5f' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your PSR Journey?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of aspiring Police Station Representatives who trust PSR Train for their accreditation preparation.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
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
