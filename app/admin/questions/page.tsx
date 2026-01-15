'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Edit2, Save, X, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: string;
  question_text: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: Record<string, any>;
  correct_answer: string[];
  explanation: string | null;
  source_refs: string[] | null;
  status: string;
}

interface QuestionWithQuality extends Question {
  quality_score?: number;
  issues?: string[];
  weak_distractor_keys?: string[];
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionWithQuality[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<QuestionWithQuality | null>(null);
  const [filter, setFilter] = useState({ category: 'all', difficulty: 'all', quality: 'all' });
  const supabase = createClient();

  useEffect(() => {
    loadQuestions();
  }, [filter]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (filter.category !== 'all') {
        query = query.eq('category', filter.category);
      }
      if (filter.difficulty !== 'all') {
        query = query.eq('difficulty', filter.difficulty);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate quality scores for each question
      const questionsWithQuality = (data || []).map(q => {
        const quality = calculateQualityScore(q.options, q.correct_answer);
        return { ...q, ...quality };
      });

      // Filter by quality if needed
      let filtered = questionsWithQuality;
      if (filter.quality === 'weak') {
        filtered = questionsWithQuality.filter(q => (q.quality_score || 10) < 8);
      } else if (filter.quality === 'good') {
        filtered = questionsWithQuality.filter(q => (q.quality_score || 10) >= 8);
      }

      setQuestions(filtered);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateQualityScore = (options: Record<string, any>, correctAnswer: string[]): {
    quality_score: number;
    issues: string[];
    weak_distractor_keys: string[];
  } => {
    let score = 10;
    const issues: string[] = [];
    const weakDistractors: string[] = [];
    const correctKeys = correctAnswer.map(a => String(a).trim());

    Object.entries(options).forEach(([key, value]) => {
      if (correctKeys.includes(key)) return; // Skip correct answers

      const text = typeof value === 'string' ? value : (value?.text || String(value));
      const lowerText = text.toLowerCase();

      // Check for obviously wrong phrases
      if (lowerText.includes('nothing') && !lowerText.includes('nothing required') && !lowerText.includes('nothing wrong')) {
        score -= 2;
        issues.push(`Option ${key}: Contains "nothing" (too obvious)`);
        weakDistractors.push(key);
      }

      if ((lowerText.includes('always') || lowerText.includes('never')) &&
          !lowerText.includes('not always') && !lowerText.includes('not never') &&
          !lowerText.includes('almost always') && !lowerText.includes('almost never')) {
        score -= 1;
        issues.push(`Option ${key}: Contains absolute term "always" or "never"`);
        weakDistractors.push(key);
      }

      if (lowerText.includes('illegal') && !lowerText.includes('not illegal') && !lowerText.includes('not necessarily illegal')) {
        score -= 2;
        issues.push(`Option ${key}: Contains "illegal" (too obvious)`);
        weakDistractors.push(key);
      }

      if (lowerText.includes('cannot') && !lowerText.includes('may not') && !lowerText.includes('might not')) {
        score -= 1;
        issues.push(`Option ${key}: Contains absolute "cannot" (consider "may not")`);
        weakDistractors.push(key);
      }

      if (lowerText.includes(' only ') && !lowerText.includes('not only') && !lowerText.includes('primarily')) {
        score -= 1;
        issues.push(`Option ${key}: Contains restrictive "only" (consider "primarily")`);
        weakDistractors.push(key);
      }

      // Check for very short distractors
      if (text.length < 30) {
        score -= 1;
        issues.push(`Option ${key}: Very short (${text.length} chars) - may be too vague`);
      }
    });

    return {
      quality_score: Math.max(0, score),
      issues,
      weak_distractor_keys: weakDistractors
    };
  };

  const startEdit = (question: QuestionWithQuality) => {
    setEditingId(question.id);
    setEditedQuestion({ ...question });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedQuestion(null);
  };

  const saveQuestion = async () => {
    if (!editedQuestion) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: editedQuestion.question_text,
          options: editedQuestion.options,
          correct_answer: editedQuestion.correct_answer,
          explanation: editedQuestion.explanation,
          source_refs: editedQuestion.source_refs,
          updated_at: new Date().toISOString()
        })
        .eq('id', editedQuestion.id);

      if (error) throw error;

      await loadQuestions();
      cancelEdit();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    }
  };

  const updateOption = (key: string, value: string) => {
    if (!editedQuestion) return;
    setEditedQuestion({
      ...editedQuestion,
      options: {
        ...editedQuestion.options,
        [key]: value
      }
    });
  };

  const updateCorrectAnswer = (answers: string[]) => {
    if (!editedQuestion) return;
    setEditedQuestion({
      ...editedQuestion,
      correct_answer: answers
    });
  };

  const categories = Array.from(new Set(questions.map(q => q.category)));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  const weakQuestions = questions.filter(q => (q.quality_score || 10) < 8);
  const goodQuestions = questions.filter(q => (q.quality_score || 10) >= 8);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Question Management</h1>
        <p className="text-muted-foreground text-lg">
          Review and improve questions with weak distractors to make them more challenging
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{weakQuestions.length}</div>
            <div className="text-sm text-muted-foreground">Needs Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{goodQuestions.length}</div>
            <div className="text-sm text-muted-foreground">Good Quality</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {questions.length > 0
                ? (questions.reduce((sum, q) => sum + (q.quality_score || 10), 0) / questions.length).toFixed(1)
                : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Avg Quality Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select
                value={filter.difficulty}
                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>
            <div>
              <Label>Quality</Label>
              <Select
                value={filter.quality}
                onChange={(e) => setFilter({ ...filter, quality: e.target.value })}
              >
                <option value="all">All Questions</option>
                <option value="weak">Needs Review (&lt;8)</option>
                <option value="good">Good Quality (≥8)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => {
          const isEditing = editingId === question.id;
          const displayQuestion = isEditing && editedQuestion ? editedQuestion : question;
          const qualityScore = question.quality_score || 10;

          return (
            <Card key={question.id} className={qualityScore < 8 ? 'border-amber-300 bg-amber-50/50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{displayQuestion.question_text}</CardTitle>
                      {qualityScore < 8 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Needs Review
                        </Badge>
                      )}
                      {qualityScore >= 8 && qualityScore < 10 && (
                        <Badge variant="default" className="bg-green-600">
                          Good
                        </Badge>
                      )}
                      {qualityScore === 10 && (
                        <Badge variant="default" className="bg-emerald-600">
                          Excellent
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{displayQuestion.category}</Badge>
                      <Badge variant="outline" className="capitalize">{displayQuestion.difficulty}</Badge>
                      <Badge variant="outline">Quality: {qualityScore}/10</Badge>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => startEdit(question)} className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.issues && question.issues.length > 0 && (
                  <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-900">Issues Found:</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                      {question.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Answer Options:</Label>
                  {Object.entries(displayQuestion.options).map(([key, value]) => {
                    const optionText = typeof value === 'string' ? value : (value?.text || String(value));
                    const isCorrect = displayQuestion.correct_answer.includes(key);
                    const isWeak = question.weak_distractor_keys?.includes(key);

                    return (
                      <div key={key} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold flex-shrink-0 ${
                          isCorrect ? 'bg-green-500 text-white' : isWeak ? 'bg-amber-500 text-white' : 'bg-gray-200'
                        }`}>
                          {key}
                        </div>
                        {isEditing ? (
                          <Textarea
                            value={optionText}
                            onChange={(e) => updateOption(key, e.target.value)}
                            className="flex-1 min-h-[60px]"
                            placeholder={`Option ${key}`}
                          />
                        ) : (
                          <div className={`flex-1 p-3 rounded border ${
                            isCorrect ? 'bg-green-50 border-green-300' : isWeak ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              {isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {isWeak && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                              <span className="text-sm font-medium">
                                {isCorrect ? 'Correct Answer' : isWeak ? 'Weak Distractor' : 'Distractor'}
                              </span>
                            </div>
                            <p className="text-foreground">{optionText}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isEditing && (
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <Label>Explanation</Label>
                      <Textarea
                        value={displayQuestion.explanation || ''}
                        onChange={(e) => setEditedQuestion({ ...displayQuestion, explanation: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveQuestion} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {questions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No questions found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
