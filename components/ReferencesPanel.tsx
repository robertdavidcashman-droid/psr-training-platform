import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/schemas";

function isCheckRef(cite: string): boolean {
  const s = cite.toLowerCase();
  return s.startsWith("check:") || s.includes("(check:");
}

export function ReferencesPanel({
  references,
  className,
}: {
  references: Question["references"];
  className?: string;
}) {
  const count = references?.length ?? 0;

  return (
    <details className={cn("rounded-xl border bg-muted/20", className)} data-testid="references-details">
      <summary
        className={cn(
          "cursor-pointer list-none select-none px-4 py-3",
          "flex items-center justify-between gap-3",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        data-testid="references-toggle"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">References</span>
          <Badge variant="outline">{count}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">Click to expand</span>
      </summary>

      <div className="px-4 pb-4" data-testid="references-panel">
        {count === 0 ? (
          <div className="text-sm text-muted-foreground">
            No references available for this question.
          </div>
        ) : (
          <ul className="mt-1 space-y-2">
            {references.map((r, idx) => (
              <li key={`${r.instrument}-${r.cite}-${idx}`} className="rounded-lg border bg-background p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{r.instrument}</Badge>
                  {isCheckRef(r.cite) ? (
                    <Badge variant="warning">Check</Badge>
                  ) : null}
                  <span className="text-sm font-medium">{r.cite}</span>
                </div>
                {r.note ? (
                  <div className="mt-1 text-sm text-muted-foreground">{r.note}</div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}

