import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Practice</h1>
        <p className="text-muted-foreground">Start a daily practice session.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily practice</CardTitle>
          <CardDescription>
            Mixed questions (published only). Review + weak topics comes next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/practice/start">
            <Button>Start daily practice</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
