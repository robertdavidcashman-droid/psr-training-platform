"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/EmptyState";
import { SectionCard } from "@/components/SectionCard";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  FileText,
  Trash2,
  Save,
  Download,
  AlertTriangle,
  ChevronLeft,
  Calendar,
  Edit,
  Search,
} from "lucide-react";
import {
  getPortfolioDrafts,
  savePortfolioDraft,
  deletePortfolioDraft,
  generateId,
  type PortfolioDraft,
} from "@/lib/storage";

type ViewState = "list" | "edit";

const PORTFOLIO_SECTIONS = [
  {
    id: "clientInstructions",
    label: "Client Instructions Summary",
    description: "Summarize the initial instructions received from your client.",
    placeholder: "What were the key points of your client's account? What did they want to achieve?",
  },
  {
    id: "disclosureSummary",
    label: "Disclosure Summary",
    description: "Document what disclosure was provided and any gaps identified.",
    placeholder: "What disclosure was provided? What additional disclosure did you request? Were there any limitations?",
  },
  {
    id: "adviceGiven",
    label: "Advice Given & Rationale",
    description: "Record the advice you provided and your reasoning.",
    placeholder: "What advice did you give regarding the interview? What was your legal reasoning?",
  },
  {
    id: "interviewStrategy",
    label: "Interview Strategy & Interventions",
    description: "Document your interview strategy and any interventions made.",
    placeholder: "What strategy did you agree with your client? Did you intervene during the interview? Why?",
  },
  {
    id: "vulnerabilitySafeguards",
    label: "Vulnerability Safeguards",
    description: "Note any vulnerability considerations and safeguards applied.",
    placeholder: "Were there any vulnerability concerns? Was an appropriate adult required? What safeguards were in place?",
  },
  {
    id: "postInterview",
    label: "Post-Interview Outcome & Reflections",
    description: "Record the outcome and your reflections on the case.",
    placeholder: "What was the outcome (NFA, charge, bail, RUI)? What would you do differently? What did you learn?",
  },
];

export default function PortfolioPage() {
  const [drafts, setDrafts] = useState<PortfolioDraft[]>([]);
  const [view, setView] = useState<ViewState>("list");
  const [currentDraft, setCurrentDraft] = useState<PortfolioDraft | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loaded = getPortfolioDrafts();
    setDrafts(loaded);
    setSelectedId(loaded[0]?.id ?? null);
  }, []);

  const createNewDraft = () => {
    const newDraft: PortfolioDraft = {
      id: generateId(),
      title: `Case Reflection - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: {},
    };
    setCurrentDraft(newDraft);
    setView("edit");
    setHasUnsavedChanges(false);
  };

  const editDraft = (draft: PortfolioDraft) => {
    setCurrentDraft({ ...draft });
    setView("edit");
    setHasUnsavedChanges(false);
  };

  const handleTitleChange = (value: string) => {
    if (!currentDraft) return;
    setCurrentDraft({ ...currentDraft, title: value });
    setHasUnsavedChanges(true);
  };

  const handleSectionChange = (sectionId: string, value: string) => {
    if (!currentDraft) return;
    setCurrentDraft({
      ...currentDraft,
      sections: { ...currentDraft.sections, [sectionId]: value },
    });
    setHasUnsavedChanges(true);
  };

  const saveDraft = () => {
    if (!currentDraft) return;
    const updated = { ...currentDraft, updatedAt: new Date().toISOString() };
    savePortfolioDraft(updated);
    setDrafts(getPortfolioDrafts());
    setCurrentDraft(updated);
    setHasUnsavedChanges(false);
  };

  const deleteDraft = (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    deletePortfolioDraft(id);
    setDrafts(getPortfolioDrafts());
    if (currentDraft?.id === id) {
      setView("list");
      setCurrentDraft(null);
    }
  };

  const exportToPdf = (draft?: PortfolioDraft) => {
    const target = draft ?? currentDraft;
    if (!target) return;
    
    // Create a printable HTML version
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${target.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 24px; }
          p { line-height: 1.6; color: #4b5563; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 24px; }
          .section { margin-bottom: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>${target.title}</h1>
        <div class="meta">
          Created: ${new Date(target.createdAt).toLocaleDateString()}<br/>
          Last updated: ${new Date(target.updatedAt).toLocaleDateString()}
        </div>
        <div class="warning">
          <strong>CONFIDENTIALITY WARNING:</strong> This document is for training and reflective purposes only. 
          Do not include any client-identifying information.
        </div>
        ${PORTFOLIO_SECTIONS.map(section => `
          <div class="section">
            <h2>${section.label}</h2>
            <p>${target.sections[section.id] || "Not completed"}</p>
          </div>
        `).join("")}
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${target.title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBack = () => {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    setView("list");
    setCurrentDraft(null);
    setHasUnsavedChanges(false);
  };

  if (view === "edit" && currentDraft) {
    return (
      <div data-testid="portfolio-edit">
        <div className="mb-6">
          <Button variant="ghost" onClick={goBack} className="gap-2 mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Portfolio
          </Button>
        </div>

        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Confidentiality Warning</AlertTitle>
          <AlertDescription>
            Do NOT enter any client-identifying information, real names, or case-specific details.
            This is for training and reflective purposes only.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={currentDraft.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter a title for this reflection"
                data-testid="portfolio-title"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {PORTFOLIO_SECTIONS.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-lg">{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={currentDraft.sections[section.id] || ""}
                  onChange={(e) => handleSectionChange(section.id, e.target.value)}
                  placeholder={section.placeholder}
                  rows={4}
                  data-testid={`section-${section.id}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="h-20 lg:hidden" />
        <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur lg:static lg:border-0">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 p-3 md:p-4 lg:mt-8 lg:p-0">
            <Button onClick={saveDraft} className="gap-2" data-testid="save-draft-btn">
              <Save className="h-4 w-4" />
              Save Draft
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="ml-2">
                  Unsaved
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToPdf()}
              className="gap-2"
              data-testid="export-pdf-btn"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="flex-1" />
            <Button
              variant="destructive"
              onClick={() => deleteDraft(currentDraft.id)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredDrafts = drafts
    .filter((d) => d.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const selectedDraft = filteredDrafts.find((d) => d.id === selectedId) ?? null;
  const completedCount = (draft: PortfolioDraft) =>
    PORTFOLIO_SECTIONS.filter((s) => draft.sections[s.id]?.trim()).length;

  return (
    <div data-testid="portfolio-page">
      <PageHeader
        title="Portfolio Workbook"
        description="Create structured case reflections for your portfolio evidence. Stored locally in your browser."
      >
        <Button onClick={createNewDraft} className="gap-2" data-testid="new-draft-btn">
          <Plus className="h-4 w-4" />
          New Reflection
        </Button>
      </PageHeader>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Privacy & Professionalism</AlertTitle>
        <AlertDescription>
          Use <strong>generic descriptions</strong> only. Do not include names, dates, locations, or any details that could identify a real client or case.
          Reflections are stored locally in your browser.
        </AlertDescription>
      </Alert>

      {drafts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Left: list */}
          <SectionCard
            title="Your reflections"
            description="Search, review progress, and open a reflection to continue."
            className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]"
            action={
              <Badge variant="outline">{filteredDrafts.length} total</Badge>
            }
          >
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reflections…"
                  className="pl-10"
                  aria-label="Search reflections"
                />
              </div>

              <div className="space-y-2">
                <div className="space-y-2" data-testid="portfolio-drafts-list">
                  {filteredDrafts.map((draft) => {
                  const done = completedCount(draft);
                  const isComplete = done === PORTFOLIO_SECTIONS.length;
                  const isSelected = selectedId === draft.id;

                  return (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => setSelectedId(draft.id)}
                      className={[
                        "w-full rounded-2xl border p-4 text-left transition",
                        "hover:bg-muted/40",
                        isSelected ? "border-[hsl(var(--gold))] bg-muted/30" : "border-border bg-background",
                      ].join(" ")}
                      data-testid={`draft-${draft.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[hsl(var(--navy))]" />
                            <h3 className="truncate text-[16px] font-semibold">{draft.title}</h3>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(draft.updatedAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{done}/{PORTFOLIO_SECTIONS.length} sections</span>
                          </div>
                        </div>
                        <Badge variant={isComplete ? "success" : "secondary"}>
                          {isComplete ? "Complete" : "In progress"}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <Progress value={(done / PORTFOLIO_SECTIONS.length) * 100} variant="gradient" />
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Right: detail */}
          <div className="space-y-6">
            {selectedDraft ? (
              <SectionCard
                title="Reflection details"
                description="Preview your reflection status and continue editing."
                action={
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => editDraft(selectedDraft)}
                      className="gap-2"
                      data-testid="portfolio-edit-selected"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        exportToPdf(selectedDraft);
                      }}
                      className="gap-2"
                      data-testid="portfolio-export-selected"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                }
              >
                <div className="space-y-5">
                  <div className="rounded-2xl border bg-muted/30 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-[14px] text-muted-foreground">Title</div>
                        <div className="truncate text-[18px] font-semibold">{selectedDraft.title}</div>
                      </div>
                      <Badge variant="outline">
                        Updated {new Date(selectedDraft.updatedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[14px] text-muted-foreground">
                      <span>Completion</span>
                      <span className="font-semibold text-foreground">
                        {completedCount(selectedDraft)}/{PORTFOLIO_SECTIONS.length}
                      </span>
                    </div>
                    <Progress
                      value={(completedCount(selectedDraft) / PORTFOLIO_SECTIONS.length) * 100}
                      variant="gradient"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => deleteDraft(selectedDraft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete reflection
                    </Button>
                    <Button
                      className="gap-2"
                      onClick={createNewDraft}
                    >
                      <Plus className="h-4 w-4" />
                      New reflection
                    </Button>
                  </div>
                </div>
              </SectionCard>
            ) : (
              <EmptyState
                icon={FileText}
                title="Select a reflection"
                description="Choose a reflection from the list to view details and continue."
              />
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No reflections yet"
          description="Start your portfolio with a structured reflection template. Everything is stored locally."
          action={{
            label: "Create reflection",
            onClick: createNewDraft,
          }}
        />
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        <Button onClick={createNewDraft} className="w-full gap-2" data-testid="new-draft-btn-mobile">
          <Plus className="h-4 w-4" />
          New reflection
        </Button>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
