import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CertificatePageProps {
  params: {
    id: string;
  };
}

const certificateNotes = [
  'Official PDF available for download and printing.',
  'Includes grid of completion dates and covered modules.',
  'Designed for employers and examiners to verify readiness.',
];

export default function CertificateDetailPage({ params }: CertificatePageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Certificate {params.id}</h1>
        <p className="text-muted-foreground">Static preview of the certificate details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-navy-800 mb-2">Certificate of Completion</div>
              <div className="text-xl text-muted-foreground mb-6">This certifies that</div>
              <div className="text-3xl font-bold text-primary mb-6">PSR Trainee</div>
              <div className="text-lg text-muted-foreground mb-6">
                has successfully completed the Police Station Representative training journey.
              </div>
              <div className="text-2xl font-semibold text-navy-800 mb-8">PSR Accreditation Programme</div>
              <div className="text-sm text-muted-foreground">
                Issued: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-slate-600">
            {certificateNotes.map((note) => (
              <li key={note} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button
              variant="navy"
              className="flex-1 gap-2"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Back to Certificates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
