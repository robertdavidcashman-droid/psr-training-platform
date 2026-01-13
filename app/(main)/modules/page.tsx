'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Module {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const { data } = await supabase
      .from('content_modules')
      .select('*')
      .order('order_index', { ascending: true });

    // Deduplicate by title and category (keep first occurrence)
    const seen = new Map<string, Module>();
    const uniqueModules: Module[] = [];
    
    if (data) {
      data.forEach((module: Module) => {
        const key = `${module.title}|${module.category}`;
        if (!seen.has(key)) {
          seen.set(key, module);
          uniqueModules.push(module);
        }
      });
    }

    setModules(uniqueModules);
    setLoading(false);
  };

  const categories = Array.from(new Set(modules.map(m => m.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div 
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#1e3a5f', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#6b7280' }}>Loading modules...</p>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={async () => {
            setSelectedModule(null);
            
            // Log module completed/exited activity
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const sessionId = typeof window !== 'undefined' 
                  ? localStorage.getItem('psr_session_id') 
                  : null;
                
                await fetch('/api/activity/log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action_type: 'module_completed',
                    action_details: {
                      module_id: selectedModule.id,
                      module_title: selectedModule.title,
                      category: selectedModule.category,
                    },
                    page_url: window.location.pathname,
                    session_id: sessionId,
                  }),
                });
              }
            } catch (error) {
              console.warn('Error logging module activity:', error);
            }
          }}>
            &larr; Back to Modules
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{selectedModule.title}</CardTitle>
            <CardDescription>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#f0f4ff', color: '#1e3a5f' }}
              >
                {selectedModule.category}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none whitespace-pre-wrap"
              style={{ color: '#374151' }}
            >
              {selectedModule.content}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 
          className="text-3xl font-bold"
          style={{ color: '#1a1a2e' }}
        >
          Learning Modules
        </h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>
          Explore comprehensive training materials
        </p>
      </div>

      {categories.map(category => {
        const categoryModules = modules.filter(m => m.category === category);
        return (
          <div key={category}>
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: '#1a1a2e' }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryModules.map(module => (
                <Card
                  key={module.id}
                  className="cursor-pointer transition-all duration-150"
                  onClick={async () => {
                    setSelectedModule(module);
                    
                    // Log module started activity
                    try {
                      const { data: { user } } = await supabase.auth.getUser();
                      if (user) {
                        const sessionId = typeof window !== 'undefined' 
                          ? localStorage.getItem('psr_session_id') 
                          : null;
                        
                        await fetch('/api/activity/log', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action_type: 'module_started',
                            action_details: {
                              module_id: module.id,
                              module_title: module.title,
                              category: module.category,
                            },
                            page_url: window.location.pathname,
                            session_id: sessionId,
                          }),
                        });
                      }
                    } catch (error) {
                      console.warn('Error logging module activity:', error);
                    }
                  }}
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#f0f4ff', color: '#1e3a5f' }}
                      >
                        {module.category}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3" style={{ color: '#6b7280' }}>
                      {module.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {modules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <svg className="w-8 h-8" style={{ color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p style={{ color: '#6b7280' }}>No modules available yet. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
