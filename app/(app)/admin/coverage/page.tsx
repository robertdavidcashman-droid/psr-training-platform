"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Plus } from "lucide-react";
import { questions as seededQuestions } from "@/content/questions";
import standardsData from "@/content/psras/standards.json";
import type { Question } from "@/lib/schemas";

interface CriterionStatus {
  criterionId: string;
  label: string;
  tags: string[];
  currentCount: number;
  targetCount: number;
  status: "Missing" | "Partial" | "OK";
}

export default function AdminCoveragePage() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTopup = async (criterionId: string) => {
    setLoading((prev) => ({ ...prev, [criterionId]: true }));
    setMessage(null);

    try {
      const response = await fetch("/api/admin/coverage/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Questions topped up successfully" });
        // Reload page after a short delay
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to top up questions" });
      }
    } catch {
      setMessage({ type: "error", text: "Error topping up questions" });
    } finally {
      setLoading((prev) => ({ ...prev, [criterionId]: false }));
    }
  };

  const handleRegenerate = async (criterionId: string) => {
    if (!confirm(`Regenerate all questions for this criterion? This will replace existing questions.`)) {
      return;
    }

    setLoading((prev) => ({ ...prev, [criterionId]: true }));
    setMessage(null);

    try {
      const response = await fetch("/api/admin/coverage/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criterionId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Questions regenerated successfully" });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to regenerate questions" });
      }
    } catch {
      setMessage({ type: "error", text: "Error regenerating questions" });
    } finally {
      setLoading((prev) => ({ ...prev, [criterionId]: false }));
    }
  };

  const coverage = useMemo(() => {
    const questions = seededQuestions as Question[];
    
    // Build tag-to-questions map
    const tagToQuestions = new Map<string, Question[]>();
    for (const q of questions) {
      for (const tag of q.tags ?? []) {
        const list = tagToQuestions.get(tag) ?? [];
        list.push(q);
        tagToQuestions.set(tag, list);
      }
    }

    const criteria: CriterionStatus[] = [];

    for (const part of standardsData.parts) {
      for (const unit of part.units) {
        for (const outcome of unit.outcomes) {
          for (const criterion of outcome.criteria) {
            // Count questions matching this criterion's tags
            const matchingQuestions = new Set<string>();
            for (const tag of criterion.tags ?? []) {
              for (const q of tagToQuestions.get(tag) ?? []) {
                matchingQuestions.add(q.id);
              }
            }

            const currentCount = matchingQuestions.size;
            const targetCount = 30;
            let status: "Missing" | "Partial" | "OK";
            if (currentCount === 0) {
              status = "Missing";
            } else if (currentCount < targetCount) {
              status = "Partial";
            } else {
              status = "OK";
            }

            criteria.push({
              criterionId: criterion.id,
              label: criterion.label,
              tags: criterion.tags ?? [],
              currentCount,
              targetCount,
              status,
            });
          }
        }
      }
    }

    // Sort: Missing first, then Partial, then OK
    criteria.sort((a, b) => {
      const order = { Missing: 0, Partial: 1, OK: 2 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return a.currentCount - b.currentCount;
    });

    return criteria;
  }, []);

  const missing = coverage.filter((c) => c.status === "Missing").length;
  const partial = coverage.filter((c) => c.status === "Partial").length;
  const ok = coverage.filter((c) => c.status === "OK").length;

  return (
    <div>
      <PageHeader
        title="Coverage Tooling"
        description="Internal tool for tracking question coverage by criterion"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold">{missing}</div>
                <div className="text-sm text-muted-foreground">Missing (0 questions)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">{partial}</div>
                <div className="text-sm text-muted-foreground">Partial (1-29 questions)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{ok}</div>
                <div className="text-sm text-muted-foreground">OK (30+ questions)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      {message && (
        <Card className={`mb-4 ${message.type === "success" ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"}`}>
          <CardContent className="p-4">
            <p className={message.type === "success" ? "text-success" : "text-destructive"}>
              {message.text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Backlog Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Backlog (sorted by priority)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Criterion</th>
                  <th className="text-left p-2">Tags</th>
                  <th className="text-right p-2">Current</th>
                  <th className="text-right p-2">Target</th>
                  <th className="text-right p-2">Gap</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coverage.map((criterion) => (
                  <tr key={criterion.criterionId} className="border-b">
                    <td className="p-2">
                      {criterion.status === "Missing" && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Missing
                        </Badge>
                      )}
                      {criterion.status === "Partial" && (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Partial
                        </Badge>
                      )}
                      {criterion.status === "OK" && (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          OK
                        </Badge>
                      )}
                    </td>
                    <td className="p-2 font-medium">{criterion.label}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {criterion.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {criterion.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{criterion.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-right">{criterion.currentCount}</td>
                    <td className="p-2 text-right">{criterion.targetCount}</td>
                    <td className="p-2 text-right font-medium">
                      {Math.max(0, criterion.targetCount - criterion.currentCount)}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTopup(criterion.criterionId)}
                          disabled={loading[criterion.criterionId]}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Top-up
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegenerate(criterion.criterionId)}
                          disabled={loading[criterion.criterionId]}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
