import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Disclaimer - PSR Training Academy",
  description: "Disclaimer for PSR Training Academy",
};

export default function DisclaimerPage() {
  return (
    <div>
      <PageHeader
        title="Disclaimer"
        description="Important information about this training platform"
      />
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Training Purposes Only</AlertTitle>
        <AlertDescription>
          This platform provides educational content aligned to PSR accreditation standards. It does not provide legal advice.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-3">Not Legal Advice</h2>
            <p className="text-muted-foreground">
              The content, questions, and scenarios on this platform are for educational and training purposes only. They do not constitute legal advice, and should not be relied upon as such in actual police station work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">No Guarantee of Accreditation</h2>
            <p className="text-muted-foreground">
              Use of this platform does not guarantee success in PSR accreditation assessments or exams. The content is designed to support learning but cannot replace formal training, supervision, or practical experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Accuracy and Currency</h2>
            <p className="text-muted-foreground">
              While we strive to keep content accurate and aligned with current SRA PSRAS standards, laws and regulations may change. Always verify current requirements through official sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Professional Responsibility</h2>
            <p className="text-muted-foreground">
              Users are responsible for ensuring their own competence and compliance with professional standards. This platform is a supplementary learning tool, not a substitute for proper training and supervision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Official Sources</h2>
            <p className="text-muted-foreground">
              For authoritative information, always refer to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>SRA PSRAS Standards and Assessment Guidelines</li>
              <li>LAA Police Station Register Arrangements</li>
              <li>Official PACE Codes and legislation</li>
              <li>Your supervising solicitor or training provider</li>
            </ul>
          </section>

          <section>
            <p className="text-sm text-muted-foreground mt-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
