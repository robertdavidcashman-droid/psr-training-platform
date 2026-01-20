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

  useEffect(() => {
    setDrafts(getPortfolioDrafts());
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

  const exportToPdf = () => {
    if (!currentDraft) return;
    
    // Create a printable HTML version
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${currentDraft.title}</title>
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
        <h1>${currentDraft.title}</h1>
        <div class="meta">
          Created: ${new Date(currentDraft.createdAt).toLocaleDateString()}<br/>
          Last updated: ${new Date(currentDraft.updatedAt).toLocaleDateString()}
        </div>
        <div class="warning">
          <strong>CONFIDENTIALITY WARNING:</strong> This document is for training and reflective purposes only. 
          Do not include any client-identifying information.
        </div>
        ${PORTFOLIO_SECTIONS.map(section => `
          <div class="section">
            <h2>${section.label}</h2>
            <p>${currentDraft.sections[section.id] || "Not completed"}</p>
          </div>
        `).join("")}
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDraft.title.replace(/\s+/g, "_")}.html`;
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

        <div className="flex gap-4 mt-6 sticky bottom-4 bg-background/95 backdrop-blur p-4 -mx-4 border-t">
          <Button onClick={saveDraft} className="gap-2" data-testid="save-draft-btn">
            <Save className="h-4 w-4" />
            Save Draft
            {hasUnsavedChanges && <Badge variant="secondary" className="ml-2">Unsaved</Badge>}
          </Button>
          <Button variant="outline" onClick={exportToPdf} className="gap-2" data-testid="export-pdf-btn">
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
    );
  }

  return (
    <div data-testid="portfolio-page">
      <PageHeader
        title="Portfolio Workbook"
        description="Create and manage case reflection templates for your portfolio evidence."
      >
        <Button onClick={createNewDraft} className="gap-2" data-testid="new-draft-btn">
          <Plus className="h-4 w-4" />
          New Reflection
        </Button>
      </PageHeader>

      <Alert variant="warning" className="mb-6 max-w-4xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Privacy Notice</AlertTitle>
        <AlertDescription>
          Do not enter any client-identifying information, real names, dates, locations, or
          case-specific details that could identify a real case. Use generic descriptions only.
          Data is stored locally in your browser.
        </AlertDescription>
      </Alert>

      {drafts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => {
            const completedSections = PORTFOLIO_SECTIONS.filter(
              (s) => draft.sections[s.id]?.trim()
            ).length;

            return (
              <Card
                key={draft.id}
                className="cursor-pointer hover:shadow-card-hover transition-shadow"
                onClick={() => editDraft(draft)}
                data-testid={`draft-${draft.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-5 w-5 text-primary" />
                    <Badge variant="outline">
                      {completedSections}/{PORTFOLIO_SECTIONS.length}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{draft.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDraft(draft);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDraft(draft.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No reflections yet"
          description="Create your first case reflection to start building your portfolio evidence."
          action={{
            label: "Create Reflection",
            onClick: createNewDraft,
          }}
        />
      )}
    </div>
  );
}
