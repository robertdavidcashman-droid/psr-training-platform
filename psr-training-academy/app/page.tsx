import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="font-semibold">PSR Training Academy</div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">
              Train for PSRAS with structured practice and portfolio support.
            </h1>
            <p className="text-muted-foreground text-lg">
              Duolingo-style daily practice, competency-tagged progress, CIT-style scenarios, and guided
              portfolio building—built for real police station advice work (educational tool, not legal
              advice).
            </p>
            <div className="flex gap-2">
              <Link href="/signup">
                <Button>Start free</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">I already have an account</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily practice</CardTitle>
                <CardDescription>Mixed questions + review queue (coming in Phase 3)</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Build mastery by topic and competency with spaced repetition.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Scenario simulations</CardTitle>
                <CardDescription>CIT-style decision points (coming in Phase 4)</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Practice structured thinking under time pressure with debrief feedback.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Portfolio building</CardTitle>
                <CardDescription>Guided templates + supervisor sign-off (coming in Phase 5)</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Built with privacy-by-design and redaction prompts by default.
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
