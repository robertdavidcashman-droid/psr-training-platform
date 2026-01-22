import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy - PSR Training Academy",
  description: "Privacy policy for PSR Training Academy",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        description="How we handle your data"
      />
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
            <p className="text-muted-foreground">
              PSR Training Academy operates as a public training platform. We do not require user registration or sign-in at this time.
            </p>
            <p className="text-muted-foreground mt-2">
              Any progress data (practice scores, streaks, etc.) is stored locally in your browser using localStorage. This data is never transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may use analytics services to understand how the platform is used. These services may collect anonymized usage data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies</h2>
            <p className="text-muted-foreground">
              We use minimal cookies for essential functionality. No personal data is collected through cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              For privacy-related questions, please contact us through the <a href="/legal/contact" className="text-primary hover:underline">contact page</a>.
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
