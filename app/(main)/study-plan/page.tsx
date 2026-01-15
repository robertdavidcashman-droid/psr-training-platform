'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, differenceInDays, addDays } from 'date-fns';

interface StudyPlan {
  id: string;
  exam_date: string;
  daily_hours: number;
  created_at: string;
}

export default function StudyPlanPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_date: '',
    daily_hours: 2,
  });

  useEffect(() => {
    loadStudyPlan();
  }, []);

  const loadStudyPlan = async () => {
    try {
      const response = await fetch('/api/study-plan');
      const data = await response.json();
      if (data.studyPlan) {
        setStudyPlan(data.studyPlan);
      } else {
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error loading study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setStudyPlan(data.studyPlan);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating study plan:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/study-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setStudyPlan(data.studyPlan);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating study plan:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  const daysUntilExam = studyPlan
    ? differenceInDays(new Date(studyPlan.exam_date), new Date())
    : 0;
  const totalStudyHours = studyPlan ? daysUntilExam * studyPlan.daily_hours : 0;
  const isPastExam = daysUntilExam < 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Personalized study schedule and exam countdown
        </p>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{studyPlan ? 'Update Study Plan' : 'Create Study Plan'}</CardTitle>
            <CardDescription>
              Set your exam date and daily study hours to create a personalized plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Exam Date</Label>
              <Input
                type="date"
                value={formData.exam_date || (studyPlan ? studyPlan.exam_date : '')}
                onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <Label>Daily Study Hours</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={formData.daily_hours}
                onChange={(e) =>
                  setFormData({ ...formData, daily_hours: parseInt(e.target.value) || 2 })
                }
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={studyPlan ? handleUpdate : handleCreate} className="flex-1">
                {studyPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
              {studyPlan && (
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : studyPlan ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Days Until Exam</CardTitle>
                <CardDescription>Time remaining</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${isPastExam ? 'text-red-600' : daysUntilExam < 30 ? 'text-orange-600' : 'text-primary-500'}`}>
                  {isPastExam ? 'Past Due' : daysUntilExam}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Exam Date: {format(new Date(studyPlan.exam_date), 'MMMM dd, yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Study Hours</CardTitle>
                <CardDescription>Your planned hours per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{studyPlan.daily_hours}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">hours/day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Study Hours</CardTitle>
                <CardDescription>Remaining study time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{totalStudyHours}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">hours remaining</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Study Schedule</CardTitle>
                  <CardDescription>Recommended daily study plan</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowForm(true)}>
                  Edit Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Daily Goals:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Answer {Math.ceil(studyPlan.daily_hours * 10)} practice questions</li>
                    <li>Review 1-2 learning modules</li>
                    <li>Complete 1 scenario simulation</li>
                    <li>Review flashcards (15 minutes)</li>
                  </ul>
                </div>
                {!isPastExam && daysUntilExam > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">This Week's Focus:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {daysUntilExam > 7
                        ? `Continue steady progress. Focus on weak areas identified in your dashboard.`
                        : `Final preparation phase. Focus on reviewing key concepts and taking mock exams.`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <a href="/practice">Start Practice Session</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/mock-exam">Take Mock Exam</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/flashcards">Review Flashcards</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/modules">Study Modules</a>
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No study plan yet. Create one to track your progress toward your exam date.
            </p>
            <Button onClick={() => setShowForm(true)}>Create Study Plan</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
