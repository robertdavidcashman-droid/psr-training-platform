import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function CriticalIncidentsPage() {
  await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Critical Incidents Test (CIT)</h1>
        <p className="text-muted-foreground text-lg">
          Information about the SRA PSRAS Critical Incidents Test
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is the Critical Incidents Test?</CardTitle>
          <CardDescription>
            Understanding the CIT requirement for PSRAS accreditation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The Critical Incidents Test (CIT) is a mandatory assessment component 
            of the Police Station Representatives Accreditation Scheme (PSRAS). 
            It evaluates your ability to handle challenging and complex situations 
            that may arise during police station representation.
          </p>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Assessment Purpose</h3>
            <p className="text-foreground mb-4">
              The CIT assesses your competence in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Identifying and responding to critical legal issues</li>
              <li>Making appropriate decisions under pressure</li>
              <li>Applying legal knowledge to complex scenarios</li>
              <li>Demonstrating professional judgment</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Test Format</h3>
            <p className="text-foreground">
              The Critical Incidents Test typically involves scenario-based 
              assessments where you must identify critical issues and demonstrate 
              appropriate responses and decision-making.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Preparation</h3>
            <p className="text-foreground mb-4">
              To prepare for the CIT, you should:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Complete all required training modules</li>
              <li>Practice with scenario-based questions</li>
              <li>Familiarize yourself with relevant legal procedures</li>
              <li>Review PACE Codes and related legislation</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/portfolio"
              className="text-primary hover:underline font-medium"
            >
              Learn more about the Portfolio requirement &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
















