import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default async function PortfolioPage() {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Portfolio Submission</h1>
        <p className="text-muted-foreground text-lg">
          Information about the SRA PSRAS Portfolio requirement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is the Portfolio Requirement?</CardTitle>
          <CardDescription>
            Understanding the portfolio component for PSRAS accreditation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The Portfolio is a mandatory component of the Police Station Representatives 
            Accreditation Scheme (PSRAS). It demonstrates your practical competence and 
            understanding of police station representation work.
          </p>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Portfolio Contents</h3>
            <p className="text-foreground mb-4">
              Your portfolio should include evidence of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Completed case studies demonstrating your practical experience</li>
              <li>Reflective accounts of police station visits</li>
              <li>Evidence of understanding key legal procedures</li>
              <li>Documentation of client interactions and advice given</li>
              <li>Examples of completed forms and documentation</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Submission Process</h3>
            <p className="text-foreground">
              Portfolios are typically submitted electronically through the SRA portal. 
              Ensure all documents are properly formatted and clearly labeled. Review 
              the SRA guidelines for specific requirements and deadlines.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Preparation Tips</h3>
            <p className="text-foreground mb-4">
              To prepare a strong portfolio:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Keep detailed records of all police station visits</li>
              <li>Document your learning and reflection regularly</li>
              <li>Ensure all case studies are anonymized appropriately</li>
              <li>Review SRA portfolio guidelines regularly</li>
              <li>Seek feedback from supervisors or mentors</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Link
              href="/critical-incidents"
              className="text-primary hover:underline font-medium"
            >
              Learn more about the Critical Incidents Test (CIT) &rarr;
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Checklist</CardTitle>
          <CardDescription>Use this checklist to ensure your portfolio is complete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-foreground">Case studies completed and anonymized</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-foreground">Reflective accounts written</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-foreground">All required forms completed</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-foreground">Portfolio reviewed by supervisor</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-foreground">SRA guidelines followed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
