import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BookOpen, Clock, Target, GraduationCap } from "lucide-react";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";

export const metadata = {
  title: "PSR Training Academy - Police Station Representative Accreditation Training",
  description: "Master the skills and knowledge for PSR accreditation. Practice questions, mock exams, and scenario-based training aligned to SRA PSRAS standards.",
};

export default async function HomePage() {
  // Check if user is authenticated
  const { userId } = await auth();
  
  // If signed in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

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
            </p>
            <SignedOut>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-6 h-auto gap-2" data-testid="sign-in-cta">
                    <Play className="h-5 w-5" />
                    Sign In to Start
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto gap-2">
                    <BookOpen className="h-5 w-5" />
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
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
            </CardContent>
          </Card>
        </div>

        {/* Sign In Prompt */}
        <div className="border-t pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to access all training materials.
            </p>
            <SignedOut>
              <div className="flex flex-wrap justify-center gap-4">
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline">Create Account</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}
