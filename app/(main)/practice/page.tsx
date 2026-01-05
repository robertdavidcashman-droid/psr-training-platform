'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { getErrorMessage, isConnectionError } from '@/lib/utils/error-handler';
import { Target, CheckCircle, XCircle, ChevronRight, RotateCcw, BookOpen, AlertCircle, Keyboard } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: Record<string, any>;
  correct_answer: string[];
  explanation: string | null;
  source_refs: string[] | null;
}

function PracticePageContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'all';
  const initialLimit = searchParams.get('limit');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({ category: initialCategoryParam, difficulty: 'all' });
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get all categories to validate the filter
      const { data: allQuestions } = await supabase
        .from('questions')
        .select('category')
        .eq('status', 'approved');
      
      const categories = Array.from(new Set(allQuestions?.map(q => q.category) || []));
      setAvailableCategories(categories);
      
      // Validate category - if it doesn't exist, use 'all'
      const validCategory = filter.category === 'all' || categories.includes(filter.category) 
        ? filter.category 
        : 'all';
      
      // Update filter if category was invalid
      if (validCategory !== filter.category) {
        setFilter({ ...filter, category: validCategory });
      }

      let query = supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(initialLimit ? parseInt(initialLimit) : 20);

      if (validCategory !== 'all') {
        query = query.eq('category', validCategory);
      }
      if (filter.difficulty !== 'all') {
        query = query.eq('difficulty', filter.difficulty);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      if (data) {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled as Question[]);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowFeedback(false);
        setStats({ correct: 0, total: 0 });
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = useCallback((answerKey: string) => {
    if (showFeedback) return;

    setSelectedAnswers(prev => {
      if (prev.includes(answerKey)) {
        return prev.filter(a => a !== answerKey);
      } else {
        const isMultiple = currentQuestion?.correct_answer.length > 1;
        return isMultiple ? [...prev, answerKey] : [answerKey];
      }
    });
  }, [showFeedback, currentQuestion]);

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || selectedAnswers.length === 0) return;

    // Get option keys for mapping letters to indices
    const optionKeys = Object.keys(currentQuestion.options);
    
    // Determine if options use numeric or letter keys
    const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
    const usesLetterKeys = optionKeys.some(key => /^[a-dA-D]$/.test(key));
    
    // Create a mapping of letters to indices: A->0, B->1, C->2, D->3
    const letterToIndex: Record<string, string> = { 'A': '0', 'B': '1', 'C': '2', 'D': '3', 'a': '0', 'b': '1', 'c': '2', 'd': '3' };
    const indexToLetter: Record<string, string> = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
    
    // Normalize correct answers - handle both letter format (A,B,C,D) and numeric format (0,1,2,3)
    // Convert to match the format used by option keys
    const normalizedCorrectAnswers = currentQuestion.correct_answer.map(a => {
      const str = String(a).trim();
      
      // If options use numeric keys but answer is a letter, convert to number
      if (usesNumericKeys && letterToIndex[str]) {
        return letterToIndex[str];
      }
      // If options use letter keys but answer is a number, convert to letter
      if (usesLetterKeys && /^[0-9]+$/.test(str) && indexToLetter[str]) {
        return indexToLetter[str];
      }
      // Otherwise keep as is (already in correct format)
      return str;
    });
    
    const normalizedSelectedAnswers = selectedAnswers.map(a => String(a).trim());
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Selected answers:', normalizedSelectedAnswers);
      console.log('Correct answers (raw):', currentQuestion.correct_answer);
      console.log('Correct answers (normalized):', normalizedCorrectAnswers);
      console.log('Options keys:', optionKeys);
      console.log('Uses numeric keys:', usesNumericKeys, 'Uses letter keys:', usesLetterKeys);
    }

    // Compare answers (order doesn't matter for multiple choice)
    const isCorrect =
      normalizedSelectedAnswers.length === normalizedCorrectAnswers.length &&
      normalizedSelectedAnswers.every(answer => normalizedCorrectAnswers.includes(answer)) &&
      normalizedCorrectAnswers.every(answer => normalizedSelectedAnswers.includes(answer));

    setShowFeedback(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (user) {
        const { error: progressError } = await supabase.from('user_progress').insert({
          user_id: user.id,
          question_id: currentQuestion.id,
          answered_correctly: isCorrect,
          selected_answer: selectedAnswers,
        });
        
        if (progressError && !isConnectionError(progressError)) {
          console.warn('Error saving progress:', progressError);
        }

        try {
          const xpAmount = isCorrect ? 10 : 2;
          await supabase.rpc('update_user_xp', {
            user_uuid: user.id,
            xp_gained: xpAmount
          });
          
          await supabase.rpc('update_daily_streak', {
            user_uuid: user.id
          });
        } catch (error) {
          console.log('XP/Streak functions not available yet');
        }
      }
    } catch (err: any) {
      if (isConnectionError(err)) {
        console.warn('Connection error saving progress:', err);
      } else {
        console.error('Error saving progress:', err);
      }
    }

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [currentQuestion, selectedAnswers, supabase]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setShowFeedback(false);
    } else {
      router.push('/dashboard');
    }
  }, [currentQuestionIndex, questions.length, router]);

  useEffect(() => {
    if (!currentQuestion) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (showFeedback) {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNext();
        }
      } else {
        if ((e.key >= '1' && e.key <= '4') || (e.key >= 'a' && e.key <= 'd')) {
          const optionIndex = e.key >= '1' && e.key <= '4' 
            ? parseInt(e.key) - 1 
            : e.key.charCodeAt(0) - 'a'.charCodeAt(0);
          const optionKeys = Object.keys(currentQuestion?.options || {});
          if (optionKeys[optionIndex]) {
            handleAnswerSelect(optionKeys[optionIndex]);
          }
        }
        if (e.key === 'Enter' && selectedAnswers.length > 0) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, selectedAnswers, currentQuestion, handleNext, handleAnswerSelect, handleSubmit]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg font-semibold text-navy-800">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-navy-800 mb-2">Error Loading Questions</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="navy" onClick={loadQuestions} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-navy-800 mb-2">No Questions Available</h2>
            <p className="text-muted-foreground mb-6">No questions match your current filters.</p>
            <Button variant="navy" onClick={() => setFilter({ category: 'all', difficulty: 'all' })} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normalize for comparison - handle both letter format (A,B,C,D) and numeric format (0,1,2,3)
  const optionKeys = Object.keys(currentQuestion?.options || {});
  const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
  const usesLetterKeys = optionKeys.some(key => /^[a-dA-D]$/.test(key));
  
  const letterToIndexMap: Record<string, string> = { 'A': '0', 'B': '1', 'C': '2', 'D': '3', 'a': '0', 'b': '1', 'c': '2', 'd': '3' };
  const indexToLetterMap: Record<string, string> = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
  
  const normalizedCorrectAnswers = currentQuestion.correct_answer.map(a => {
    const str = String(a).trim();
    // Convert to match option key format
    if (usesNumericKeys && letterToIndexMap[str]) {
      return letterToIndexMap[str];
    }
    if (usesLetterKeys && /^[0-9]+$/.test(str) && indexToLetterMap[str]) {
      return indexToLetterMap[str];
    }
    return str;
  });
  
  const normalizedSelectedAnswers = selectedAnswers.map(a => String(a).trim());
  
  const isCorrect = showFeedback &&
    normalizedSelectedAnswers.length === normalizedCorrectAnswers.length &&
    normalizedSelectedAnswers.every(answer => normalizedCorrectAnswers.includes(answer)) &&
    normalizedCorrectAnswers.every(answer => normalizedSelectedAnswers.includes(answer));

  const categories = availableCategories.length > 0 
    ? availableCategories 
    : Array.from(new Set(questions.map(q => q.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-800 mb-1">Practice Mode</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="bg-muted rounded-2xl p-4 min-w-[140px] text-center">
          <div className="text-sm font-semibold text-muted-foreground mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-navy-800">
            {stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.correct} / {stats.total} correct
          </div>
        </div>
      </div>

      {/* Filters - Only show at start */}
      {currentQuestionIndex === 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-navy-800">Category</Label>
                <Select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="mt-1.5"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-navy-800">Difficulty</Label>
                <Select
                  value={filter.difficulty}
                  onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                  className="mt-1.5"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-xl flex items-center gap-2 text-sm text-muted-foreground">
              <Keyboard className="w-4 h-4" />
              <span><strong className="text-navy-800">Shortcuts:</strong> 1-4 or A-D to select, Enter to submit/continue</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div className="flex-1">
              <CardTitle className="text-xl leading-relaxed mb-3">{currentQuestion.question_text}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {currentQuestion.category}
                </span>
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full capitalize">
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>
            {currentQuestion.correct_answer.length > 1 && (
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                Multiple answers
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {Object.entries(currentQuestion.options).map(([key, value], index) => {
              const isSelected = selectedAnswers.includes(key);
              const isCorrectAnswer = normalizedCorrectAnswers.includes(String(key));
              
              // Handle both string values and object values
              let optionText: string;
              if (typeof value === 'string') {
                optionText = value;
              } else if (value && typeof value === 'object') {
                const objValue = value as Record<string, unknown>;
                optionText = (objValue.text as string) || (objValue.label as string) || JSON.stringify(value);
              } else {
                optionText = String(value);
              }
              
              let styles = 'bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5';
              
              if (showFeedback) {
                if (isCorrectAnswer) {
                  styles = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                } else if (isSelected && !isCorrectAnswer) {
                  styles = 'bg-red-50 border-red-500 text-red-900';
                } else {
                  styles = 'bg-gray-50 border-gray-200 opacity-60';
                }
              } else if (isSelected) {
                styles = 'bg-primary/10 border-primary ring-2 ring-primary/20';
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${styles} ${
                    !showFeedback ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      showFeedback && isCorrectAnswer
                        ? 'bg-emerald-500 text-white'
                        : showFeedback && isSelected && !isCorrectAnswer
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {showFeedback && isCorrectAnswer ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showFeedback && isSelected && !isCorrectAnswer ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        key
                      )}
                    </div>
                    <span className="flex-1 font-medium">{optionText}</span>
                    {!showFeedback && (
                      <span className="text-xs text-muted-foreground">({index + 1})</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-5 rounded-xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">Incorrect</span>
                  </>
                )}
              </div>
              {currentQuestion.explanation && (
                <p className="text-foreground leading-relaxed mb-3">{currentQuestion.explanation}</p>
              )}
              {currentQuestion.source_refs && currentQuestion.source_refs.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Sources:</strong> {currentQuestion.source_refs.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {!showFeedback ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswers.length === 0}
                variant="navy"
                size="lg"
                className="flex-1 gap-2"
              >
                Submit Answer
                <span className="text-xs opacity-75">(Enter)</span>
              </Button>
            ) : (
              <Button onClick={handleNext} variant="navy" size="lg" className="flex-1 gap-2">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <p className="text-lg font-semibold text-navy-800">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  );
}
