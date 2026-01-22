import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service - PSR Training Academy",
  description: "Terms of service for PSR Training Academy",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms of Service"
        description="Terms and conditions for using PSR Training Academy"
      />
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using PSR Training Academy, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Educational Purpose</h2>
            <p className="text-muted-foreground">
              This platform is provided for educational and training purposes only. It does not constitute legal advice.
            </p>
            <p className="text-muted-foreground mt-2">
              The content is designed to support preparation for Police Station Representative accreditation but does not guarantee accreditation or exam success.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Use of Content</h2>
            <p className="text-muted-foreground">
              All content on this platform is provided for personal, non-commercial use. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">No Warranty</h2>
            <p className="text-muted-foreground">
              The platform is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, or fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, PSR Training Academy shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform.
            </p>
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
