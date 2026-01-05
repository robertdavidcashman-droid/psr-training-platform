import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight, CheckCircle, Scale, FileText, Users, Gavel } from 'lucide-react';

// Default modules if database is empty
const defaultModules = [
  {
    id: '1',
    title: 'Substantive Law',
    description: 'Essential criminal law principles, common offences (Theft, Assault, Public Order), and defences.',
    category: 'Core Knowledge',
    estimated_hours: 4,
    icon: 'scale',
  },
  {
    id: '2',
    title: 'PACE and Codes',
    description: 'Police and Criminal Evidence Act 1984, Code C (Detention), Code D (Identification), and Code E (Interviews).',
    category: 'Core Knowledge',
    estimated_hours: 6,
    icon: 'file',
  },
  {
    id: '3',
    title: 'Professional Conduct',
    description: 'SRA Standards, client confidentiality, conflicts of interest, and ethical duties.',
    category: 'Procedures',
    estimated_hours: 3,
    icon: 'users',
  },
  {
    id: '4',
    title: 'Practical Skills',
    description: 'Client interviews, advising on silence, taking instructions, and dealing with vulnerable clients.',
    category: 'Case Skills',
    estimated_hours: 5,
    icon: 'gavel',
  },
];

const iconMap: Record<string, React.ElementType> = {
  scale: Scale,
  file: FileText,
  users: Users,
  gavel: Gavel,
  book: BookOpen,
};

export default async function ModulesPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  // Try to get modules from database
  let modules = defaultModules;
  let moduleProgress: Record<string, { completed: boolean; progress: number }> = {};

  try {
    const { data: dbModules } = await supabase
      .from('content_modules')
      .select('*')
      .order('order_index', { ascending: true });

    if (dbModules && dbModules.length > 0) {
      // Use database modules (completely replace defaults, no duplication)
      modules = dbModules;
    }
    // If no database modules, use defaultModules (already set above)

    // Get user's module progress
    const { data: progress } = await supabase
      .from('module_progress')
      .select('module_id, completed, progress_percent')
      .eq('user_id', user?.id || '');

    if (progress) {
      progress.forEach(p => {
        moduleProgress[p.module_id] = {
          completed: p.completed,
          progress: p.progress_percent || 0,
        };
      });
    }
  } catch (error) {
    console.log('Could not fetch modules from database, using defaults');
  }

  // Get all approved questions
  const { data: questions } = await supabase
    .from('questions')
    .select('category')
    .eq('status', 'approved');

  // Count questions per category
  const categoryCounts: Record<string, number> = {};
  questions?.forEach(q => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });

  // Map each module to its relevant question categories
  // Uses flexible matching to find relevant categories
  const getModuleQuestionCount = (moduleTitle: string, moduleCategory?: string): number => {
    const lowerTitle = moduleTitle.toLowerCase();
    const lowerCategory = (moduleCategory || '').toLowerCase();
    
    // Extract key words from module title for matching
    const titleWords = lowerTitle.split(/\s+/).filter(word => word.length > 2);
    
    let count = 0;
    const matchedCategories = new Set<string>();
    
    // Try direct match first (exact category name)
    if (categoryCounts[moduleTitle]) {
      return categoryCounts[moduleTitle];
    }
    
    // Try case-insensitive direct match
    const directMatch = Object.keys(categoryCounts).find(cat => 
      cat.toLowerCase() === lowerTitle
    );
    if (directMatch) {
      return categoryCounts[directMatch];
    }
    
    // Flexible matching: check if category contains key words from module title
    Object.keys(categoryCounts).forEach(cat => {
      const lowerCat = cat.toLowerCase();
      
      // Skip if already counted
      if (matchedCategories.has(cat)) return;
      
      // Check for PACE/Code matching
      if ((lowerTitle.includes('pace') || lowerTitle.includes('code')) &&
          (lowerCat.includes('pace') || lowerCat.includes('code'))) {
        // Check if module title specifies a particular code letter (A-H)
        const codeLetterMatch = lowerTitle.match(/\bcode\s+([a-h])\b/i);
        if (codeLetterMatch) {
          // Module specifies a particular code (e.g., "PACE Code C")
          const codeLetter = codeLetterMatch[1].toLowerCase();
          // Only include categories that mention this specific code letter
          if (lowerCat.includes(`code ${codeLetter}`) || 
              lowerCat.includes(`code ${codeLetter.toUpperCase()}`)) {
            count += categoryCounts[cat];
            matchedCategories.add(cat);
            return;
          }
        } else {
          // Module is generic "PACE and Codes" - count all PACE/Code categories
          count += categoryCounts[cat];
          matchedCategories.add(cat);
          return;
        }
      }
      
      // Check for Professional Conduct matching
      if ((lowerTitle.includes('professional') || lowerTitle.includes('conduct') ||
           lowerCategory.includes('professional') || lowerCategory.includes('conduct')) &&
          (lowerCat.includes('professional') || lowerCat.includes('conduct') || 
           lowerCat.includes('ethics') || lowerCat.includes('sra'))) {
        count += categoryCounts[cat];
        matchedCategories.add(cat);
        return;
      }
      
      // Check for Practical Skills matching
      if ((lowerTitle.includes('practical') || lowerTitle.includes('skill') ||
           lowerCategory.includes('practical') || lowerCategory.includes('skill')) &&
          (lowerCat.includes('interview') || lowerCat.includes('advice') ||
           lowerCat.includes('instruction') || lowerCat.includes('client') ||
           lowerCat.includes('vulnerable') || lowerCat.includes('detainee') ||
           lowerCat.includes('bail') || lowerCat.includes('consultation'))) {
        count += categoryCounts[cat];
        matchedCategories.add(cat);
        return;
      }
      
      // Check for Substantive Law matching
      if ((lowerTitle.includes('substantive') || lowerTitle.includes('criminal') ||
           lowerTitle.includes('law')) &&
          (lowerCat.includes('substantive') || lowerCat.includes('criminal') ||
           lowerCat.includes('offence') || lowerCat.includes('defence') ||
           (lowerCat.includes('law') && !lowerCat.includes('pace') && 
            !lowerCat.includes('evidence')))) {
        count += categoryCounts[cat];
        matchedCategories.add(cat);
        return;
      }
      
      // Check if any significant word from module title appears in category
      for (const word of titleWords) {
        if (word.length > 3 && lowerCat.includes(word)) {
          count += categoryCounts[cat];
          matchedCategories.add(cat);
          break;
        }
      }
    });
    
    return count;
  };

  // Remove duplicates by both ID and title (case-insensitive, normalized)
  // Normalize titles: lowercase, trim, remove extra spaces
  const normalizeTitle = (title: string) => {
    return (title || '').toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const seenIds = new Set<string>();
  const seenTitles = new Map<string, typeof modules[0]>();
  
  // First pass: collect unique modules, preferring the "better" one when duplicates found
  const uniqueModulesMap = new Map<string, typeof modules[0]>();
  
  modules.forEach(module => {
    const moduleId = module.id;
    const normalizedTitle = normalizeTitle(module.title || '');
    
    // Skip if we've already seen this exact ID
    if (seenIds.has(moduleId)) {
      return;
    }
    
    // Check for title duplicates
    if (normalizedTitle && seenTitles.has(normalizedTitle)) {
      // Title duplicate found - keep the one with more complete data
      const existing = seenTitles.get(normalizedTitle)!;
      const existingKey = existing.id;
      
      // Prefer the one with better data (has description, content, etc.)
      const currentHasContent = !!(module as any).content || !!(module as any).description;
      const existingHasContent = !!(existing as any).content || !!(existing as any).description;
      
      if (currentHasContent && !existingHasContent) {
        // Current is better, replace the existing one
        seenTitles.set(normalizedTitle, module);
        uniqueModulesMap.delete(existingKey);
        uniqueModulesMap.set(moduleId, module);
        seenIds.add(moduleId);
        seenIds.delete(existingKey);
      }
      // Otherwise, keep the existing one (already in the map)
      return;
    }
    
    // New unique module - add it
    seenIds.add(moduleId);
    if (normalizedTitle) {
      seenTitles.set(normalizedTitle, module);
    }
    uniqueModulesMap.set(moduleId, module);
  });
  
  // Convert map back to array
  const uniqueModules = Array.from(uniqueModulesMap.values());

  const groupedModules: Record<string, typeof uniqueModules> = {};
  uniqueModules.forEach(module => {
    const category = (module as any).category || 'General';
    if (!groupedModules[category]) {
      groupedModules[category] = [];
    }
    groupedModules[category].push(module);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">Learning Modules</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Our curriculum is designed to guide you through the Police Station Representatives Accreditation Scheme (PSRAS). 
          Start with Core Knowledge, move through Procedures and Case Skills, and finish with Assessment Prep.
        </p>
      </div>

      {/* Module Sections */}
      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <section key={category}>
          {/* Section Header with Line */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-navy-800 whitespace-nowrap">{category}</h2>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Module Cards */}
          <div className="space-y-4">
            {categoryModules.map((module) => {
              const progress = moduleProgress[module.id];
              const isCompleted = progress?.completed;
              const progressPercent = progress?.progress || 0;
              const IconComponent = iconMap[(module as any).icon] || BookOpen;
              const questionCount = getModuleQuestionCount(module.title, (module as any).category);

              return (
                <Card key={module.id} className={isCompleted ? 'border-emerald-200 bg-emerald-50/30' : ''}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-7 h-7 text-sky-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-navy-800">{module.title}</h3>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {module.estimated_hours || 2} HOURS
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3">{module.description}</p>

                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="font-semibold text-navy-800">{questionCount}</span> Questions Available
                        </p>

                        {/* Progress Bar */}
                        {progressPercent > 0 && !isCompleted && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* CTA Button */}
                        <Link href={`/practice?category=${encodeURIComponent(module.title)}`}>
                          <Button variant="navy" className="w-full sm:w-auto gap-2">
                            {isCompleted ? 'Review Module' : progressPercent > 0 ? 'Continue' : 'Start Module'}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
