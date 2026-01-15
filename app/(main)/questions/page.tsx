'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, X, CheckCircle, BookOpen } from 'lucide-react';

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

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'all', difficulty: 'all', search: '' });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category, filter.difficulty]);

  const loadQuestions = async () => {
    setLoading(true);
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

    const { data } = await query;

    if (data) {
      let filtered = data;
      if (filter.search) {
        filtered = data.filter(q =>
          q.question_text.toLowerCase().includes(filter.search.toLowerCase()) ||
          q.category.toLowerCase().includes(filter.search.toLowerCase())
        );
      }
      setQuestions(filtered as Question[]);
    }
    setLoading(false);
  };

  // Filter by search term on change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search]);

  const categories = Array.from(new Set(questions.map(q => q.category)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Normalize option key: convert numeric keys (0,1,2,3) to letters (A,B,C,D)
  const normalizeOptionKey = (key: string): string => {
    const numKey = parseInt(key, 10);
    if (!isNaN(numKey) && numKey >= 0 && numKey <= 25) {
      return String.fromCharCode(65 + numKey); // 65 is 'A' in ASCII
    }
    // If already a letter, return uppercase version
    return key.toUpperCase();
  };

  // Sort and normalize options for consistent A, B, C, D display
  const getSortedOptions = (options: Record<string, any>): Array<[string, string, any]> => {
    return Object.entries(options)
      .map(([key, value]) => {
        const normalizedKey = normalizeOptionKey(key);
        return [key, normalizedKey, value] as [string, string, any];
      })
      .sort((a, b) => {
        // Sort by normalized key (A, B, C, D order)
        return a[1].localeCompare(b[1]);
      });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Question Bank</h1>
        <p className="text-muted-foreground">Browse and practice with approved questions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy-800 mb-2 block">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full h-12 rounded-xl border-2 border-border bg-white dark:bg-card px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy-800 mb-2 block">Difficulty</label>
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                className="w-full h-12 rounded-xl border-2 border-border bg-white dark:bg-card px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy-800 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-muted-foreground font-medium">Loading questions...</p>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-navy-800 mb-2">No Questions Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => {
            // Handle both string values and object values for options
            // Enhanced to extract full text from all possible formats
            const getOptionText = (value: any): string => {
              if (typeof value === 'string') {
                return value.trim();
              }
              if (value && typeof value === 'object') {
                // Try multiple possible property names
                return value?.text?.trim() || 
                       value?.label?.trim() || 
                       value?.content?.trim() ||
                       value?.answer?.trim() ||
                       (typeof value === 'object' && Object.keys(value).length > 0 
                         ? JSON.stringify(value) 
                         : String(value));
              }
              return String(value).trim();
            };

            return (
              <Card
                key={question.id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                            {question.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-navy-800 text-lg leading-snug mb-3">{question.question_text}</h3>
                      </div>
                    </div>

                    {/* Answer Options - Now Visible in List View */}
                    <div>
                      <h4 className="text-sm font-semibold text-navy-800 mb-2">Answer Options:</h4>
                      <div className="space-y-2">
                        {getSortedOptions(question.options).map(([originalKey, normalizedKey, value]) => {
                          // Check if original key or normalized key is in correct_answer
                          const isCorrect = question.correct_answer.includes(originalKey) || 
                                           question.correct_answer.includes(normalizedKey) ||
                                           question.correct_answer.includes(originalKey.toLowerCase()) ||
                                           question.correct_answer.includes(normalizedKey.toLowerCase());
                          const optionText = getOptionText(value);
                          return (
                            <div 
                              key={originalKey} 
                              className={`p-3 rounded-lg border-2 flex items-start gap-3 ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                                isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-700'
                              }`}>
                                {normalizedKey}
                              </span>
                              <span className="flex-1 font-medium text-navy-800 whitespace-normal break-words">{optionText}</span>
                              {isCorrect && (
                                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-navy-800 mb-1">Explanation</h4>
                            <p className="text-navy-700 leading-relaxed text-sm whitespace-normal break-words">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Source Refs */}
                    {question.source_refs && question.source_refs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-navy-800 mb-1">Sources</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {question.source_refs.map((ref, idx) => (
                            <li key={idx}>{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
