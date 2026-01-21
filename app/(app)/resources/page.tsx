import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  BookOpen,
  Scale,
  FileText,
  GraduationCap,
  Shield,
} from "lucide-react";

const resources = [
  {
    category: "Official Codes & Guidance",
    icon: Scale,
    items: [
      {
        title: "PACE Codes of Practice",
        description: "Official codes governing police powers and procedures",
        url: "https://www.gov.uk/guidance/police-and-criminal-evidence-act-1984-pace-codes-of-practice",
        type: "Official",
      },
      {
        title: "PACE Code C - Detention",
        description: "Code of practice for detention, treatment and questioning",
        url: "https://www.gov.uk/government/publications/pace-code-c-2019",
        type: "Official",
      },
      {
        title: "PACE Code G - Arrest",
        description: "Code of practice for statutory power of arrest",
        url: "https://www.gov.uk/government/publications/pace-code-g-2012",
        type: "Official",
      },
      {
        title: "PACE Code H - Terrorism",
        description: "Code for detention under Terrorism Act 2000",
        url: "https://www.gov.uk/government/publications/pace-code-h-2019",
        type: "Official",
      },
    ],
  },
  {
    category: "Professional Standards",
    icon: Shield,
    items: [
      {
        title: "SRA Standards & Regulations",
        description: "Solicitors Regulation Authority professional standards",
        url: "https://www.sra.org.uk/solicitors/standards-regulations/",
        type: "Regulatory",
      },
      {
        title: "SRA Code of Conduct",
        description: "Core professional conduct requirements",
        url: "https://www.sra.org.uk/solicitors/standards-regulations/code-conduct-solicitors/",
        type: "Regulatory",
      },
      {
        title: "Criminal Litigation Accreditation",
        description: "Information about the accreditation scheme",
        url: "https://www.lawsociety.org.uk/career-advice/individual-accreditations/criminal-litigation",
        type: "Accreditation",
      },
    ],
  },
  {
    category: "Educational Resources",
    icon: GraduationCap,
    items: [
      {
        title: "Crown Prosecution Service",
        description: "Guidance on charging standards and procedures",
        url: "https://www.cps.gov.uk/legal-guidance",
        type: "Guidance",
      },
      {
        title: "Sentencing Council",
        description: "Sentencing guidelines for criminal offences",
        url: "https://www.sentencingcouncil.org.uk/",
        type: "Guidance",
      },
      {
        title: "Youth Justice Board",
        description: "Youth justice resources and guidance",
        url: "https://www.gov.uk/government/organisations/youth-justice-board-for-england-and-wales",
        type: "Guidance",
      },
    ],
  },
  {
    category: "Vulnerability & Safeguards",
    icon: BookOpen,
    items: [
      {
        title: "Appropriate Adult Guidance",
        description: "NPCC guidance on appropriate adult role",
        url: "https://www.gov.uk/government/publications/pace-code-c-2019",
        type: "Guidance",
      },
      {
        title: "Mental Health Act 1983",
        description: "Legislation on mental health provisions",
        url: "https://www.legislation.gov.uk/ukpga/1983/20/contents",
        type: "Legislation",
      },
      {
        title: "Liaison & Diversion Services",
        description: "NHS services for vulnerable suspects",
        url: "https://www.england.nhs.uk/commissioning/health-just/liaison-and-diversion/",
        type: "Service",
      },
    ],
  },
];

const typeColors: Record<string, "default" | "secondary" | "outline"> = {
  Official: "default",
  Regulatory: "secondary",
  Guidance: "outline",
  Legislation: "secondary",
  Accreditation: "default",
  Service: "outline",
};

export default function ResourcesPage() {
  return (
    <div data-testid="resources-page">
      <PageHeader
        title="Resources"
        description="Official guidance, legislation, and educational materials for PSR practitioners."
      />

      <div className="space-y-8">
        {resources.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">{section.category}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid={`resource-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="h-full hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant={typeColors[item.type] || "outline"}>
                          {item.type}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Resource Disclaimer</h3>
              <p className="text-base text-muted-foreground">
                These links are provided for educational reference. Always verify you are accessing
                the most current versions of legislation and guidance. This platform does not
                guarantee the accuracy or currency of external resources. For official guidance,
                always refer to primary sources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
