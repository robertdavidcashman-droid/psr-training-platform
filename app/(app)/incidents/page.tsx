"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Play,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Info,
} from "lucide-react";
import scenariosData from "@/content/scenarios.json";
import topicsData from "@/content/topics.json";

type ScenarioState = "list" | "briefing" | "active" | "debrief";

interface Choice {
  id: string;
  text: string;
  feedback: string;
  isOptimal: boolean;
  nextStepId?: string;
}

interface Step {
  id: string;
  content: string;
  choices: Choice[];
}

interface Scenario {
  id: string;
  topicId: string;
  title: string;
  briefing: string;
  steps: Step[];
  debrief: string;
}

export default function IncidentsPage() {
  const [state, setState] = useState<ScenarioState>("list");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [decisions, setDecisions] = useState<{ stepId: string; choice: Choice }[]>([]);

  const topicMap = Object.fromEntries(topicsData.topics.map((t) => [t.id, t]));
  const scenarios = scenariosData.scenarios as Scenario[];
  const currentStep = selectedScenario?.steps[currentStepIndex];

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setDecisions([]);
    setState("briefing");
  };

  const beginScenario = () => {
    setState("active");
  };

  const handleChoice = (choice: Choice) => {
    if (showFeedback) return;
    setSelectedChoice(choice);
  };

  const submitChoice = () => {
    if (!selectedChoice || !currentStep) return;
    setDecisions((prev) => [...prev, { stepId: currentStep.id, choice: selectedChoice }]);
    setShowFeedback(true);
  };

  const nextStep = () => {
    if (!selectedScenario) return;

    // Find next step
    const nextStepId = selectedChoice?.nextStepId;
    let nextIndex = currentStepIndex + 1;

    if (nextStepId) {
      const foundIndex = selectedScenario.steps.findIndex((s) => s.id === nextStepId);
      if (foundIndex !== -1) nextIndex = foundIndex;
    }

    if (nextIndex >= selectedScenario.steps.length) {
      setState("debrief");
    } else {
      setCurrentStepIndex(nextIndex);
      setSelectedChoice(null);
      setShowFeedback(false);
    }
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setCurrentStepIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setDecisions([]);
    setState("list");
  };

  const optimalCount = decisions.filter((d) => d.choice.isOptimal).length;

  if (state === "list") {
    return (
      <div data-testid="incidents-page">
        <PageHeader
          title="Critical Incidents Training"
          description="Practice decision-making in realistic police station scenarios."
        />

        <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => startScenario(scenario)}
              data-testid={`scenario-${scenario.id}`}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <Badge variant="outline">
                    {topicMap[scenario.topicId]?.name}
                  </Badge>
                </div>
                <CardTitle>{scenario.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {scenario.briefing}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-base text-muted-foreground">
                    {scenario.steps.length} decision points
                  </span>
                  <Button size="sm" className="gap-1">
                    <Play className="h-3 w-3" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="mt-6 max-w-4xl">
          <Info className="h-4 w-4" />
          <AlertTitle>Scenario Training</AlertTitle>
          <AlertDescription>
            These scenarios are designed for training purposes. They present realistic situations
            but are not based on actual cases. Consider the principles being tested rather than
            looking for a single "correct" answer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (state === "briefing" && selectedScenario) {
    return (
      <div data-testid="scenario-briefing">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                <Badge variant="outline">
                  {topicMap[selectedScenario.topicId]?.name}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{selectedScenario.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none mb-6">
                <h3 className="text-lg font-semibold mb-2">Scenario Briefing</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedScenario.briefing}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  What to Consider
                </h4>
                <ul className="text-base text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Professional conduct and ethics</li>
                  <li>Client's best interests</li>
                  <li>Proper procedures and safeguards</li>
                  <li>Effective communication</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={resetScenario}>
                  Back to List
                </Button>
                <Button onClick={beginScenario} className="gap-2" data-testid="begin-scenario-btn">
                  Begin Scenario
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state === "active" && selectedScenario && currentStep) {
    return (
      <div data-testid="scenario-active">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-base mb-2">
              <span>Step {currentStepIndex + 1} of {selectedScenario.steps.length}</span>
              <span>{optimalCount} optimal decisions</span>
            </div>
            <Progress value={((currentStepIndex + 1) / selectedScenario.steps.length) * 100} />
          </div>

          {/* Scenario Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-lg mb-6" data-testid="step-content">{currentStep.content}</p>

              <div className="space-y-3">
                {currentStep.choices.map((choice) => {
                  const isSelected = selectedChoice?.id === choice.id;
                  const showResult = showFeedback;

                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        showResult
                          ? choice.isOptimal
                            ? "border-success bg-success/10"
                            : isSelected
                            ? "border-warning bg-warning/10"
                            : "border-border"
                          : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`choice-${choice.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            showResult
                              ? choice.isOptimal
                                ? "border-success bg-success text-success-foreground"
                                : isSelected
                                ? "border-warning bg-warning text-warning-foreground"
                                : "border-border"
                              : isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          }`}
                        >
                          {showResult && choice.isOptimal && <CheckCircle className="h-4 w-4" />}
                          {showResult && isSelected && !choice.isOptimal && (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="flex-1">{choice.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showFeedback && (
                <Button
                  className="w-full mt-6"
                  disabled={!selectedChoice}
                  onClick={submitChoice}
                  data-testid="submit-choice-btn"
                >
                  Submit Decision
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          {showFeedback && selectedChoice && (
            <Card className="mb-6" data-testid="choice-feedback">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  {selectedChoice.isOptimal ? (
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-semibold mb-1">
                      {selectedChoice.isOptimal ? "Optimal Decision" : "Consider This"}
                    </h3>
                    <p className="text-muted-foreground">{selectedChoice.feedback}</p>
                  </div>
                </div>

                <Button className="w-full gap-2" onClick={nextStep} data-testid="next-step-btn">
                  {currentStepIndex < selectedScenario.steps.length - 1 ? (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    "View Debrief"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (state === "debrief" && selectedScenario) {
    const score = Math.round((optimalCount / decisions.length) * 100);

    return (
      <div data-testid="scenario-debrief">
        <div className="max-w-3xl mx-auto">
          {/* Score */}
          <div className="text-center mb-8">
            <div
              className={`h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                score >= 70 ? "bg-success/20" : "bg-warning/20"
              }`}
            >
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Scenario Complete</h1>
            <p className="text-muted-foreground">
              {optimalCount} of {decisions.length} optimal decisions
            </p>
          </div>

          {/* Debrief */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Scenario Debrief
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {selectedScenario.debrief}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Decision Review */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decisions.map((decision, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {decision.choice.isOptimal ? (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-base">Step {idx + 1}</p>
                      <p className="text-base text-muted-foreground">{decision.choice.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={resetScenario} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Back to Scenarios
            </Button>
            <Button onClick={() => startScenario(selectedScenario)} className="gap-2">
              <Play className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
