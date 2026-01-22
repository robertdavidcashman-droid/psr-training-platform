import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Contact - PSR Training Academy",
  description: "Contact information for PSR Training Academy",
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact"
        description="Get in touch with us"
      />
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-3">General Inquiries</h2>
            <p className="text-muted-foreground">
              For general questions about the platform, content suggestions, or technical issues, please reach out through the appropriate channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Content Feedback</h2>
            <p className="text-muted-foreground">
              We welcome feedback on questions, explanations, or coverage gaps. If you notice any inaccuracies or have suggestions for improvement, please let us know.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Technical Support</h2>
            <p className="text-muted-foreground">
              For technical issues or bugs, please report them with as much detail as possible, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Browser and version</li>
              <li>Steps to reproduce the issue</li>
              <li>Screenshots if applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Official Resources</h2>
            <p className="text-muted-foreground mb-3">
              For official information about PSR accreditation, please refer to:
            </p>
            <div className="space-y-2">
              <a
                href="https://www.sra.org.uk/solicitors/resources/specific-areas-of-practice/standards/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                SRA PSRAS Standards
              </a>
              <a
                href="https://guidance.sra.org.uk/solicitors/resources/specific-areas-of-practice/assessment-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                SRA Assessment Guidelines
              </a>
              <a
                href="https://assets.publishing.service.gov.uk/media/68dcf841ef1c2f72bc1e4c9f/Police_Station_Register_Arrangements_2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                LAA Police Station Register Arrangements
              </a>
            </div>
          </section>

          <section className="pt-4 border-t">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <p className="text-sm">
                For urgent matters, please use the official SRA or LAA contact channels.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
