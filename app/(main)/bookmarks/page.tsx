'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Bookmark {
  id: string;
  question_id?: string;
  module_id?: string;
  created_at: string;
  questions?: any;
  content_modules?: any;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      const data = await response.json();
      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string, questionId?: string, moduleId?: string) => {
    try {
      const params = new URLSearchParams();
      if (questionId) params.append('question_id', questionId);
      if (moduleId) params.append('module_id', moduleId);

      await fetch(`/api/bookmarks?${params}`, { method: 'DELETE' });
      loadBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const questionBookmarks = bookmarks.filter(b => b.questions);
  const moduleBookmarks = bookmarks.filter(b => b.content_modules);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Your saved questions and modules</p>
      </div>

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No bookmarks yet. Start bookmarking questions and modules to find them easily later.
          </CardContent>
        </Card>
      ) : (
        <>
          {questionBookmarks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Questions ({questionBookmarks.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {questionBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {bookmark.questions?.question_text}
                          </CardTitle>
                          <CardDescription>
                            {bookmark.questions?.category} • {bookmark.questions?.difficulty}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBookmark(bookmark.id, bookmark.question_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/questions?highlight=${bookmark.question_id}`}>
                        <Button variant="outline">View Question</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {moduleBookmarks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Modules ({moduleBookmarks.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moduleBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {bookmark.content_modules?.title}
                          </CardTitle>
                          <CardDescription>{bookmark.content_modules?.category}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBookmark(bookmark.id, undefined, bookmark.module_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/modules?highlight=${bookmark.module_id}`}>
                        <Button variant="outline">View Module</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
