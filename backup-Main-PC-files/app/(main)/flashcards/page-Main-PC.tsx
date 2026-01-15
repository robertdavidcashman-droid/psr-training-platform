'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, Plus, X, RotateCcw, ChevronRight, Frown, Meh, Smile, ThumbsUp, Zap } from 'lucide-react';

interface Flashcard {
  id: string;
  front_text: string;
  back_text: string;
  category?: string;
  difficulty?: string;
  statute?: string;
  section?: string;
  next_review: string;
  review_count: number;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    front_text: '',
    back_text: '',
    category: '',
    difficulty: 'beginner',
    statute: '',
    section: '',
  });

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const response = await fetch('/api/flashcards?due=true');
      if (!response.ok) {
        throw new Error(`Failed to load flashcards: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('📦 Loaded flashcards:', data.flashcards);
      console.log('🎴 First flashcard:', data.flashcards[0]);
      setFlashcards(data.flashcards || []);
    } catch (error: unknown) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality: number) => {
    if (flashcards.length === 0) return;

    const current = flashcards[currentIndex];
    try {
      await fetch('/api/flashcards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.id, quality }),
      });

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        loadFlashcards();
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setFormData({ front_text: '', back_text: '', category: '', difficulty: 'beginner', statute: '', section: '' });
      setShowForm(false);
      loadFlashcards();
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Flashcards</h1>
          <p className="text-muted-foreground">Spaced repetition learning system</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant={showForm ? "outline" : "navy"}
          className="gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Create Flashcard'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl">Create New Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="font-semibold">Front (Question)</Label>
              <Textarea
                value={formData.front_text}
                onChange={(e) => setFormData({ ...formData, front_text: e.target.value })}
                rows={3}
                placeholder="Enter the question or term..."
                className="mt-2"
              />
            </div>
            <div>
              <Label className="font-semibold">Back (Answer)</Label>
              <Textarea
                value={formData.back_text}
                onChange={(e) => setFormData({ ...formData, back_text: e.target.value })}
                rows={3}
                placeholder="Enter the answer or definition..."
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., PACE Code C"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="font-semibold">Difficulty</Label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="mt-2 w-full h-12 rounded-xl border-2 border-border bg-white dark:bg-card px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Statute</Label>
                <Input
                  value={formData.statute}
                  onChange={(e) => setFormData({ ...formData, statute: e.target.value })}
                  placeholder="e.g., PACE 1984"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="font-semibold">Section</Label>
                <Input
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., s.17"
                  className="mt-2"
                />
              </div>
            </div>
            <Button onClick={handleCreate} variant="navy" className="w-full" disabled={!formData.front_text || !formData.back_text}>
              Create Flashcard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Flashcard Display */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading flashcards...</p>
          </div>
        </div>
      ) : flashcards.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Flashcards Due</h3>
            <p className="text-muted-foreground mb-6">Create some flashcards to start learning!</p>
            <Button onClick={() => setShowForm(true)} variant="navy" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Flashcard
            </Button>
          </CardContent>
        </Card>
      ) : currentCard ? (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-foreground">Card {currentIndex + 1} of {flashcards.length}</span>
            <span className="text-muted-foreground">
              {flashcards.length - currentIndex - 1} remaining
            </span>
          </div>

          {/* Flashcard */}
          <Card className="overflow-hidden">
            <div
              className="min-h-[350px] flex items-center justify-center p-8 cursor-pointer transition-all duration-300 hover:bg-muted/30"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="text-center max-w-lg">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                  isFlipped 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {isFlipped ? <ChevronRight className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {isFlipped ? 'Answer' : 'Question'}
                  </span>
                </div>
                {/* Statute and Section Display */}
                {(currentCard.statute || currentCard.section) && (
                  <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                    {currentCard.statute && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {currentCard.statute}
                      </span>
                    )}
                    {currentCard.section && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {currentCard.section}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
                  {isFlipped ? currentCard.back_text : currentCard.front_text}
                </p>
                <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Click to {isFlipped ? 'see question' : 'reveal answer'}
                </p>
              </div>
            </div>

            {/* Review Buttons */}
            {isFlipped && (
              <div className="p-6 border-t border-border bg-muted/30">
                <p className="text-sm font-bold text-foreground mb-4 text-center">How well did you remember?</p>
                <div className="grid grid-cols-5 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReview(0)}
                    className="flex-col h-auto py-3 gap-1 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
                  >
                    <Frown className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-semibold">Forgot</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(2)}
                    className="flex-col h-auto py-3 gap-1 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                  >
                    <Meh className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-semibold">Hard</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(3)}
                    className="flex-col h-auto py-3 gap-1 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  >
                    <Smile className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold">OK</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(4)}
                    className="flex-col h-auto py-3 gap-1 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                  >
                    <ThumbsUp className="w-5 h-5 text-sky-500" />
                    <span className="text-xs font-semibold">Good</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(5)}
                    className="flex-col h-auto py-3 gap-1 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  >
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-semibold">Easy</span>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
