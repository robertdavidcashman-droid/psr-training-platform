"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  BookOpen,
  FileText,
  Target,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { questions as seededQuestions } from "@/content/questions";
import standardsData from "@/content/psras/standards.json";
import type { Question } from "@/lib/schemas";

interface CriterionCoverage {
  criterionId: string;
  label: string;
  summary: string;
  questionCount: number;
  hasAuthorities: boolean;
  tags: string[];
  expectedAuthorities: Array<{ instrument: string; cite: string; url?: string }>;
}

interface OutcomeCoverage {
  outcomeId: string;
  title: string;
  criteria: CriterionCoverage[];
  totalQuestions: number;
  coveredCriteria: number;
}

interface UnitCoverage {
  unitId: string;
  title: string;
  outcomes: OutcomeCoverage[];
  totalQuestions: number;
  coveredCriteria: number;
  totalCriteria: number;
}

interface PartCoverage {
  partId: string;
  title: string;
  units: UnitCoverage[];
  totalQuestions: number;
  coveredCriteria: number;
  totalCriteria: number;
}

function getCoverageStatus(questionCount: number): "green" | "amber" | "red" {
  if (questionCount >= 5) return "green";
  if (questionCount >= 2) return "amber";
  return "red";
}

function CoverageStatusBadge({ count }: { count: number }) {
  const status = getCoverageStatus(count);
  
  if (status === "green") {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        {count} questions
      </Badge>
    );
  }
  
  if (status === "amber") {
    return (
      <Badge variant="warning" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        {count} questions
      </Badge>
    );
  }
  
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      {count === 0 ? "No questions" : `${count} question`}
    </Badge>
  );
}

function CriterionRow({ criterion }: { criterion: CriterionCoverage }) {
  return (
    <div className="border-l-2 border-muted pl-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base">{criterion.label}</p>
          <p className="text-base text-muted-foreground mt-1">{criterion.summary}</p>
          {criterion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {criterion.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {criterion.tags.length > 5 && (
                <Badge variant="outline" className="text-xs">+{criterion.tags.length - 5}</Badge>
              )}
            </div>
          )}
        </div>
        <CoverageStatusBadge count={criterion.questionCount} />
      </div>
      
      {criterion.expectedAuthorities.length > 0 && (
        <details className="mt-3">
          <summary className="text-base text-muted-foreground cursor-pointer hover:text-foreground">
            Expected authorities ({criterion.expectedAuthorities.length})
          </summary>
          <ul className="mt-2 space-y-1 text-base">
            {criterion.expectedAuthorities.map((auth, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{auth.instrument}</Badge>
                <span className="text-muted-foreground">{auth.cite}</span>
                {auth.url && (
                  <a
                    href={auth.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function OutcomeSection({ outcome }: { outcome: OutcomeCoverage }) {
  return (
    <details className="group" open>
      <summary className="flex items-center gap-2 cursor-pointer py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        <span className="font-medium">{outcome.title}</span>
        <Badge variant="outline" className="ml-auto">
          {outcome.coveredCriteria}/{outcome.criteria.length} criteria
        </Badge>
      </summary>
      <div className="mt-2 space-y-2 ml-6">
        {outcome.criteria.map((criterion) => (
          <CriterionRow key={criterion.criterionId} criterion={criterion} />
        ))}
      </div>
    </details>
  );
}

function UnitCard({ unit }: { unit: UnitCoverage }) {
  const coveragePercent = unit.totalCriteria > 0
    ? Math.round((unit.coveredCriteria / unit.totalCriteria) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{unit.title}</CardTitle>
            <p className="text-base text-muted-foreground mt-1">
              {unit.totalQuestions} seeded questions · {unit.outcomes.length} outcomes · {unit.totalCriteria} criteria
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{coveragePercent}%</div>
            <div className="text-xs text-muted-foreground">coverage</div>
          </div>
        </div>
        <Progress value={coveragePercent} className="mt-2" variant={coveragePercent >= 80 ? "gradient" : coveragePercent >= 50 ? "warning" : "default"} />
      </CardHeader>
      <CardContent className="space-y-4">
        {unit.outcomes.map((outcome) => (
          <OutcomeSection key={outcome.outcomeId} outcome={outcome} />
        ))}
      </CardContent>
    </Card>
  );
}

function PartSection({ part }: { part: PartCoverage }) {
  const coveragePercent = part.totalCriteria > 0
    ? Math.round((part.coveredCriteria / part.totalCriteria) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold">{part.title}</h2>
          <p className="text-base text-muted-foreground">
            {part.units.length} units · {part.totalCriteria} criteria · {part.totalQuestions} questions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold">{coveragePercent}%</div>
            <div className="text-base text-muted-foreground">overall</div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {part.units.map((unit) => (
          <UnitCard key={unit.unitId} unit={unit} />
        ))}
      </div>
    </div>
  );
}

export default function CoverageMatrixPage() {
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

    // Build topic-to-questions map
    const topicToQuestions = new Map<string, Question[]>();
    for (const q of questions) {
      const list = topicToQuestions.get(q.topicId) ?? [];
      list.push(q);
      topicToQuestions.set(q.topicId, list);
    }

    // Process standards data
    const parts: PartCoverage[] = [];

    for (const part of standardsData.parts) {
      const units: UnitCoverage[] = [];
      let partQuestions = 0;
      let partCoveredCriteria = 0;
      let partTotalCriteria = 0;

      for (const unit of part.units) {
        const outcomes: OutcomeCoverage[] = [];
        let unitQuestions = 0;
        let unitCoveredCriteria = 0;
        let unitTotalCriteria = 0;

        for (const outcome of unit.outcomes) {
          const criteria: CriterionCoverage[] = [];
          let outcomeQuestions = 0;
          let outcomeCoveredCriteria = 0;

          for (const criterion of outcome.criteria) {
            // Count questions matching this criterion's tags
            const matchingQuestions = new Set<string>();
            for (const tag of criterion.tags ?? []) {
              for (const q of tagToQuestions.get(tag) ?? []) {
                matchingQuestions.add(q.id);
              }
            }

            const questionCount = matchingQuestions.size;
            const hasAuthorities = criterion.expectedAuthorities?.length > 0;

            criteria.push({
              criterionId: criterion.id,
              label: criterion.label,
              summary: criterion.summary,
              questionCount,
              hasAuthorities,
              tags: criterion.tags ?? [],
              expectedAuthorities: criterion.expectedAuthorities ?? [],
            });

            outcomeQuestions += questionCount;
            unitTotalCriteria++;
            partTotalCriteria++;

            if (questionCount >= 2) {
              outcomeCoveredCriteria++;
              unitCoveredCriteria++;
              partCoveredCriteria++;
            }
          }

          outcomes.push({
            outcomeId: outcome.id,
            title: outcome.title,
            criteria,
            totalQuestions: outcomeQuestions,
            coveredCriteria: outcomeCoveredCriteria,
          });

          unitQuestions += outcomeQuestions;
        }

        units.push({
          unitId: unit.id,
          title: unit.title,
          outcomes,
          totalQuestions: unitQuestions,
          coveredCriteria: unitCoveredCriteria,
          totalCriteria: unitTotalCriteria,
        });

        partQuestions += unitQuestions;
      }

      parts.push({
        partId: part.id,
        title: part.title,
        units,
        totalQuestions: partQuestions,
        coveredCriteria: partCoveredCriteria,
        totalCriteria: partTotalCriteria,
      });
    }

    return {
      parts,
      totalQuestions: questions.length,
      totalCriteria: parts.reduce((sum, p) => sum + p.totalCriteria, 0),
      coveredCriteria: parts.reduce((sum, p) => sum + p.coveredCriteria, 0),
    };
  }, []);

  const overallPercent = coverage.totalCriteria > 0
    ? Math.round((coverage.coveredCriteria / coverage.totalCriteria) * 100)
    : 0;

  return (
    <div data-testid="coverage-page">
      <PageHeader
        title="Coverage Matrix"
        description="Question coverage mapped to SRA PSRAS assessment criteria"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{coverage.totalQuestions}</div>
              <div className="text-base text-muted-foreground">Seeded Questions</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{coverage.totalCriteria}</div>
              <div className="text-base text-muted-foreground">Assessment Criteria</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{coverage.coveredCriteria}</div>
              <div className="text-base text-muted-foreground">Criteria Covered (2+)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              overallPercent >= 80 ? "bg-success/10" : overallPercent >= 50 ? "bg-warning/10" : "bg-destructive/10"
            }`}>
              <span className={`text-xl font-bold ${
                overallPercent >= 80 ? "text-success" : overallPercent >= 50 ? "text-warning" : "text-destructive"
              }`}>
                {overallPercent}%
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold">Overall</div>
              <div className="text-base text-muted-foreground">Coverage Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parts */}
      <div className="space-y-12">
        {coverage.parts.map((part) => (
          <PartSection key={part.partId} part={part} />
        ))}
      </div>

      {/* Legend */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Coverage Status Legend</h3>
          <div className="flex flex-wrap gap-4 text-base">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                5+ questions
              </Badge>
              <span className="text-muted-foreground">Well covered</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                2-4 questions
              </Badge>
              <span className="text-muted-foreground">Partial coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                0-1 questions
              </Badge>
              <span className="text-muted-foreground">Needs content</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
