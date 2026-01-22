import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BookOpen, Clock, Target, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "PSR Training Academy - Police Station Representative Accreditation Training",
  description: "Master the skills and knowledge for PSR accreditation. Practice questions, mock exams, and scenario-based training aligned to SRA PSRAS standards.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[hsl(var(--gold))]">
                <GraduationCap className="h-8 w-8 text-[hsl(var(--gold-foreground))]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">PSR Training Academy</h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Master the skills and knowledge for Police Station Representative accreditation
            </p>
            <p className="text-lg text-muted-foreground mb-10">
              Practice questions, mock exams, and scenario-based training aligned to SRA PSRAS standards.
              Start training immediately—no sign-in required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/practice">
                <Button size="lg" className="text-lg px-8 py-6 h-auto gap-2" data-testid="start-training-cta">
                  <Play className="h-5 w-5" />
                  Start Training
                </Button>
              </Link>
              <Link href="/syllabus">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto gap-2">
                  <BookOpen className="h-5 w-5" />
                  View Syllabus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Questions</h3>
              <p className="text-muted-foreground">
                Interactive practice sessions with instant feedback and detailed explanations.
              </p>
              <Link href="/practice" className="inline-flex items-center gap-1 text-primary hover:underline mt-4">
                Start practicing <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mock Exam</h3>
              <p className="text-muted-foreground">
                Timed exam simulation to test your knowledge under exam conditions.
              </p>
              <Link href="/mock-exam" className="inline-flex items-center gap-1 text-primary hover:underline mt-4">
                Take mock exam <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Critical Incidents</h3>
              <p className="text-muted-foreground">
                Scenario-based training for real-world police station situations.
              </p>
              <Link href="/incidents" className="inline-flex items-center gap-1 text-primary hover:underline mt-4">
                View scenarios <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coverage Matrix</h3>
              <p className="text-muted-foreground">
                Track question coverage across all SRA PSRAS assessment criteria.
              </p>
              <Link href="/coverage" className="inline-flex items-center gap-1 text-primary hover:underline mt-4">
                View coverage <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/syllabus">
              <Button variant="outline">Syllabus Map</Button>
            </Link>
            <Link href="/coverage">
              <Button variant="outline">Coverage Matrix</Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline">Practice</Button>
            </Link>
            <Link href="/mock-exam">
              <Button variant="outline">Mock Exam</Button>
            </Link>
            <Link href="/incidents">
              <Button variant="outline">Critical Incidents</Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline">Resources</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
