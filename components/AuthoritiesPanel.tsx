import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, Scale, AlertTriangle, Info } from "lucide-react";
import type { Question } from "@/lib/schemas";
import {
  getAuthorityUrl,
  isCheckCitation,
  type AuthorityInstrument,
} from "@/lib/authorities";

interface AuthorityEntry {
  instrument: string;
  cite: string;
  url?: string;
  note?: string;
}

function getInstrumentColor(instrument: string): string {
  switch (instrument) {
    case "PACE":
      return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "Code C":
    case "Code D":
    case "Code E":
    case "Code F":
    case "Code G":
      return "bg-purple-500/10 text-purple-700 border-purple-200";
    case "Bail Act":
    case "CPIA":
    case "LASPO":
    case "CJPOA":
      return "bg-green-500/10 text-green-700 border-green-200";
    case "SRA Standard":
    case "LAA Arrangements":
    case "LAA Guidance":
      return "bg-amber-500/10 text-amber-700 border-amber-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function AuthorityItem({ authority }: { authority: AuthorityEntry }) {
  const isCheck = isCheckCitation(authority.cite);
  const url = authority.url || getAuthorityUrl(authority.instrument as AuthorityInstrument, authority.cite);

  return (
    <li className="rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <Badge className={cn("font-medium", getInstrumentColor(authority.instrument))}>
            {authority.instrument}
          </Badge>
          {isCheck && (
            <Badge variant="warning" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Verify
            </Badge>
          )}
          <span className="text-base font-medium break-words min-w-0">
            {authority.cite}
          </span>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Button>
          </a>
        )}
      </div>
      {authority.note && (
        <p className="mt-2 text-base text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{authority.note}</span>
        </p>
      )}
    </li>
  );
}

export interface AuthoritiesPanelProps {
  references: Question["references"];
  className?: string;
  defaultOpen?: boolean;
  showHeader?: boolean;
  whyItMatters?: string;
  commonPitfalls?: string[];
}

export function AuthoritiesPanel({
  references,
  className,
  defaultOpen = false,
  showHeader: _showHeader = true,
  whyItMatters,
  commonPitfalls,
}: AuthoritiesPanelProps) {
  const count = references?.length ?? 0;

  // Enrich references with URLs
  const enrichedRefs: AuthorityEntry[] = (references ?? []).map((ref) => ({
    instrument: ref.instrument,
    cite: ref.cite,
    url: getAuthorityUrl(ref.instrument as AuthorityInstrument, ref.cite),
    note: ref.note,
  }));

  const hasCheckRefs = enrichedRefs.some((r) => isCheckCitation(r.cite));

  return (
    <div
      className={cn("rounded-xl border bg-muted/20", className)}
      data-testid="authorities-panel"
    >
      <details open={defaultOpen || count > 0} data-testid="references-details">
        <summary
          className={cn(
            "cursor-pointer list-none select-none px-4 py-3",
            "flex items-center justify-between gap-3",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          data-testid="references-toggle"
        >
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-semibold">Authorities</span>
            <Badge variant="outline">{count}</Badge>
          </div>
          <span className="text-base text-muted-foreground">
            {count > 0 ? "Click to collapse" : "Click to expand"}
          </span>
        </summary>

        <div className="px-4 pb-4 space-y-4" data-testid="references-panel">
          {count === 0 ? (
            <div className="text-base text-muted-foreground py-2">
              No authorities available for this question.
            </div>
          ) : (
            <>
              {hasCheckRefs && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-base text-warning-foreground">
                    Some citations are marked for verification. Always check the current
                    Act/Code for the exact paragraph or section number.
                  </p>
                </div>
              )}

              <ul className="space-y-2">
                {enrichedRefs.map((ref, idx) => (
                  <AuthorityItem
                    key={`${ref.instrument}-${ref.cite}-${idx}`}
                    authority={ref}
                  />
                ))}
              </ul>
            </>
          )}

          {whyItMatters && (
            <div className="pt-2 border-t">
              <h4 className="text-base font-semibold mb-1">Why this matters</h4>
              <p className="text-base text-muted-foreground">{whyItMatters}</p>
            </div>
          )}

          {commonPitfalls && commonPitfalls.length > 0 && (
            <div className="pt-2 border-t">
              <h4 className="text-base font-semibold mb-2">Common pitfalls</h4>
              <ul className="space-y-1">
                {commonPitfalls.map((pitfall, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-base text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/70 shrink-0" />
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

// Re-export the old name for backward compatibility
export { AuthoritiesPanel as ReferencesPanel };
