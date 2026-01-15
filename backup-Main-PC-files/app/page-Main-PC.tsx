import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/layout/Footer';
import { BookOpen, Target, TrendingUp, Shield, Award, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-navy-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PSR ACADEMY</h1>
              <p className="text-xs text-white/80 font-medium">POLICE STATION REP TRAINING</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/legal/about" className="text-white/90 hover:text-white transition-colors text-sm font-semibold">
              About
            </Link>
            <Link href="/legal/contact" className="text-white/90 hover:text-white transition-colors text-sm font-semibold">
              Contact
            </Link>
            <Link href="/dashboard">
              <Button variant="accent" size="default">Go to App</Button>
            </Link>
          </nav>
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient hero-pattern">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fff;stop-opacity:0.1'/%3E%3Cstop offset='100%25' style='stop-color:%23fff;stop-opacity:0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='200' height='300'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
          }}
        />
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in">
              <Award className="w-4 h-4" />
              <span>#1 Rated PSR Training Platform</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
              Master the Art of{' '}
              <span className="text-accent">Police Station</span>{' '}
              <span className="text-accent">Defence</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Complete your Police Station Representative Accreditation Scheme (PSRAS) training with our AI-powered platform. Real-world simulations, expert-verified content, and instant feedback.{' '}
              <span className="text-accent font-bold underline">Completely Free.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/signup">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  Start Free Training
                </Button>
              </Link>
              <Link href="/legal/about">
                <Button variant="outline" size="xl" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50">
                  Learn About PSR Role
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-30">
          <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 50L350 150V350L200 450L50 350V150L200 50Z" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M200 100L300 170V330L200 400L100 330V170L200 100Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <circle cx="200" cy="250" r="80" stroke="white" strokeWidth="1" fill="none" opacity="0.5"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources for your PSRAS accreditation journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-sky-600" />
                </div>
                <CardTitle className="text-xl">Comprehensive Training</CardTitle>
                <CardDescription className="text-base">
                  Cover all areas required for accreditation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Access interactive learning materials, practice questions, and scenario simulations covering all PSRAS modules.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Practice</CardTitle>
                <CardDescription className="text-base">
                  Realistic scenario simulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Practice with AI-powered simulations that replicate real police station scenarios and interview situations.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Track Your Progress</CardTitle>
                <CardDescription className="text-base">
                  Analytics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor your progress with detailed analytics, performance tracking, and personalized study recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground font-medium">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">4</div>
              <div className="text-muted-foreground font-medium">Core Modules</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">100%</div>
              <div className="text-muted-foreground font-medium">Free Access</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">AI</div>
              <div className="text-muted-foreground font-medium">Powered Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-6">
              Ready to start your career in criminal defence?
            </h2>
            <p className="text-lg text-navy-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of legal professionals who trust our platform for their accreditation training.
            </p>
            <Link href="/signup">
              <Button variant="navy" size="xl">
                Create Free Account
              </Button>
            </Link>
            <p className="mt-6 text-navy-600 font-medium">No credit card required. 100% Free.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
