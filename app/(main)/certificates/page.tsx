import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const certificateHighlights = [
  'Earn recognition for each completed module',
  'Download official PSR Train certificates in PDF',
  'Track completion dates and module coverage',
];

const certificateExamples = [
  { title: 'Module 1 - Legal Fundamentals', issued: 'November 2024' },
  { title: 'Module 3 - Interview Simulations', issued: 'December 2024' },
  { title: 'Module 5 - Scenario Writing', issued: 'January 2025' },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificates & Achievement Badges</h1>
        <p className="text-gray-600 mt-2">
          Every milestone you reach is recorded so you can showcase your PSR readiness.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificateHighlights.map((item) => (
          <Card key={item} className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
              <p className="text-sm text-slate-600">Reusable proof of your PSR skills.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificateExamples.map((cert) => (
            <Card key={cert.title} className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">Issued {cert.issued}</p>
                <div className="flex gap-2">
                  <Link href="/certificates/example">
                    <Button className="flex-1">View Certificate</Button>
                  </Link>
                  <Link href="/certificates/example">
                    <Button variant="outline" className="flex-1">
                      Download PDF
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/modules">
          <Button variant="navy" size="lg">
            Continue training to earn more
          </Button>
        </Link>
      </div>
    </div>
  );
}
