import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function PortfolioPage() {
  await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Portfolio Guidance</h1>
        <p className="text-muted-foreground text-lg">
          Information about the SRA PSRAS Portfolio requirements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Requirements</CardTitle>
          <CardDescription>
            SRA PSRAS Portfolio guidance for police station representatives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The portfolio is a key component of the PSRAS accreditation process.
            It requires you to document your practical experience and demonstrate
            competence in police station representation.
          </p>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Portfolio Structure</h3>
            <p className="text-foreground mb-4">
              The portfolio typically consists of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Part A: Case studies and practical examples</li>
              <li>Part B: Reflective practice and professional development</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Number of Cases</h3>
            <p className="text-foreground">
              You are required to include 9 cases in your portfolio, covering
              a range of different scenarios and demonstrating competency across
              various areas of police station representation.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Timeframe</h3>
            <p className="text-foreground">
              Cases should be collected over a 12-month period, demonstrating
              ongoing development and practical experience.
            </p>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/critical-incidents"
              className="text-primary hover:underline font-medium"
            >
              Learn more about the Critical Incidents Test →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
