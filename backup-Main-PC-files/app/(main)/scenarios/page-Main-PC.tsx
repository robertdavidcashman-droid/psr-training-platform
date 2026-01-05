'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Play, CheckCircle, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface Scenario {
  scenario: string;
  options: string[];
  correctResponse: string;
  feedback: string;
}

export default function ScenariosPage() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');

  const scenarioTypes = [
    { value: '', label: 'General Scenario' },
    { value: 'Initial call and attendance', label: 'Initial Call & Attendance' },
    { value: 'Consultation with client', label: 'Consultation with Client' },
    { value: 'Police interview handling', label: 'Police Interview Handling' },
    { value: 'Bail applications and representations', label: 'Bail & Representations' },
    { value: 'Vulnerable detainees and appropriate adults', label: 'Vulnerable Detainees' },
    { value: 'Right to silence and cautions', label: 'Rights & Cautions' },
  ];

  const generateScenario = async () => {
    setLoading(true);
    setShowFeedback(false);
    setSelectedOption(null);

    try {
      const response = await fetch('/api/ai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) throw new Error('Failed to generate scenario');

      const data = await response.json();
      setScenario(data);
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowFeedback(true);
  };

  const isCorrect = selectedOption === scenario?.correctResponse;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Scenario Simulation</h1>
        <p className="text-muted-foreground">Practice with AI-generated police station scenarios</p>
      </div>

      {!scenario ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Start a New Scenario</CardTitle>
                <CardDescription>Generate a realistic police station scenario to practice your skills</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Scenario Type (Optional)</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full h-12 rounded-xl border-2 border-border bg-white dark:bg-card px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                {scenarioTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={generateScenario} disabled={loading} variant="navy" size="lg" className="w-full">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Scenario...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generate Scenario
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Scenario</CardTitle>
                <CardDescription>Read the scenario and choose the best response</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Scenario Text */}
            <div className="p-5 bg-muted/30 rounded-xl border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-line">{scenario.scenario}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {scenario.options.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index);
                const isSelected = selectedOption === optionKey;
                
                let styles = 'bg-white dark:bg-card border-border hover:border-primary/50 hover:bg-primary/5';
                
                if (showFeedback) {
                  if (optionKey === scenario.correctResponse) {
                    styles = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-600';
                  } else if (isSelected && optionKey !== scenario.correctResponse) {
                    styles = 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600';
                  } else {
                    styles = 'bg-muted/30 border-border opacity-60';
                  }
                } else if (isSelected) {
                  styles = 'bg-primary/10 border-primary dark:border-primary';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(optionKey)}
                    disabled={showFeedback}
                    className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-200 ${styles} ${
                      !showFeedback ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        showFeedback && optionKey === scenario.correctResponse 
                          ? 'bg-emerald-500 text-white' 
                          : showFeedback && isSelected && optionKey !== scenario.correctResponse
                          ? 'bg-red-500 text-white'
                          : isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {optionKey}
                      </span>
                      <span className="flex-1 font-medium text-foreground">{option}</span>
                      {showFeedback && optionKey === scenario.correctResponse && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {showFeedback && isSelected && optionKey !== scenario.correctResponse && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit or Feedback */}
            {!showFeedback ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                variant="navy"
                size="lg"
                className="w-full"
              >
                Submit Response
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <div className={`p-6 rounded-xl border-2 ${
                  isCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className={`flex items-center gap-3 font-bold text-lg mb-3 ${
                    isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        Incorrect
                      </>
                    )}
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{scenario.feedback}</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={generateScenario}
                    disabled={loading}
                    variant="navy"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Scenario
                  </Button>
                  <Button
                    onClick={() => {
                      setScenario(null);
                      setSelectedOption(null);
                      setShowFeedback(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
