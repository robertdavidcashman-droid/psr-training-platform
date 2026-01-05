'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Button } from '@/components/ui/button';
import { SearchDialog } from '@/components/search/SearchDialog';
import { Shield, LayoutDashboard, BookOpen, Settings, Search, LogOut, Menu, X, User, GraduationCap, PlayCircle, FileText, Brain, Bookmark, Award, Target, ClipboardList, ChevronDown, Play, FileQuestion, Lightbulb } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>('User');
  const [isAdmin, setIsAdmin] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [assessmentDropdownOpen, setAssessmentDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    if (isSupabaseConfigured()) {
      const loadUser = async () => {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) {
            console.warn('Failed to get user:', error.message);
            return;
          }
          if (user) {
            try {
              const { data, error: dataError } = await supabase
                .from('users')
                .select('full_name, email, role')
                .eq('id', user.id)
                .single();
              
              if (dataError) {
                console.warn('Failed to fetch user data:', dataError.message);
                return;
              }
              
              if (data?.full_name) {
                setUserName(data.full_name);
              } else if (data?.email) {
                setUserName(data.email.split('@')[0]);
              }
              if (data?.role === 'admin') {
                setIsAdmin(true);
              }
            } catch (err) {
              console.warn('Error fetching user data:', err);
            }
          }
        } catch (err) {
          console.warn('Error getting user:', err);
        }
      };
      
      loadUser();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [supabase]);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn('Error signing out:', error);
      }
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-navy-800" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-white leading-tight">PSR ACADEMY</div>
              <div className="text-[10px] text-white/80 font-medium uppercase tracking-wide">Police Station Rep Training</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            
            {/* Learning Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setLearningDropdownOpen(true)}
              onMouseLeave={() => setLearningDropdownOpen(false)}
            >
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                <GraduationCap className="w-4 h-4" />
                Learning
                <ChevronDown className="w-3 h-3" />
              </Button>
              {learningDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-border py-2">
                    <Link href="/modules" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4" />
                        <span>Modules</span>
                      </div>
                    </Link>
                    <Link href="/study-plan" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="w-4 h-4" />
                        <span>Study Plan</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Practice Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setPracticeDropdownOpen(true)}
              onMouseLeave={() => setPracticeDropdownOpen(false)}
            >
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                <PlayCircle className="w-4 h-4" />
                Practice
                <ChevronDown className="w-3 h-3" />
              </Button>
              {practiceDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-border py-2">
                    <Link href="/practice" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Play className="w-4 h-4" />
                        <span>Practice Questions</span>
                      </div>
                    </Link>
                    <Link href="/mock-exam" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <FileQuestion className="w-4 h-4" />
                        <span>Mock Exam</span>
                      </div>
                    </Link>
                    <Link href="/questions" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4" />
                        <span>Question Bank</span>
                      </div>
                    </Link>
                    <Link href="/scenarios" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4" />
                        <span>Scenarios</span>
                      </div>
                    </Link>
                    <Link href="/flashcards" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Brain className="w-4 h-4" />
                        <span>Flashcards</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                <FileText className="w-4 h-4" />
                Resources
                <ChevronDown className="w-3 h-3" />
              </Button>
              {resourcesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-border py-2">
                    <Link href="/pace" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4" />
                        <span>PACE Navigator</span>
                      </div>
                    </Link>
                    <Link href="/bookmarks" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Bookmark className="w-4 h-4" />
                        <span>Bookmarks</span>
                      </div>
                    </Link>
                    <Link href="/certificates" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4" />
                        <span>Certificates</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Assessment Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAssessmentDropdownOpen(true)}
              onMouseLeave={() => setAssessmentDropdownOpen(false)}
            >
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                <Target className="w-4 h-4" />
                Assessment
                <ChevronDown className="w-3 h-3" />
              </Button>
              {assessmentDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-border py-2">
                    <Link href="/portfolio" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4" />
                        <span>Portfolio Guidance</span>
                      </div>
                    </Link>
                    <Link href="/critical-incidents" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4" />
                        <span>Critical Incidents Test</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="text-white/90 hover:text-white hover:bg-white/10 gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </Button>

            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 gap-2">
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{userName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout} 
              className="text-white/90 hover:text-white hover:bg-white/10"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Button>
              </Link>
              
              {/* Learning Section */}
              <div className="px-4 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider">Learning</div>
              <Link href="/modules" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <BookOpen className="w-5 h-5" />
                  Modules
                </Button>
              </Link>
              <Link href="/study-plan" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <ClipboardList className="w-5 h-5" />
                  Study Plan
                </Button>
              </Link>

              {/* Practice Section */}
              <div className="px-4 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider mt-2">Practice</div>
              <Link href="/practice" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Play className="w-5 h-5" />
                  Practice Questions
                </Button>
              </Link>
              <Link href="/mock-exam" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <FileQuestion className="w-5 h-5" />
                  Mock Exam
                </Button>
              </Link>
              <Link href="/questions" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <FileText className="w-5 h-5" />
                  Question Bank
                </Button>
              </Link>
              <Link href="/scenarios" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Lightbulb className="w-5 h-5" />
                  Scenarios
                </Button>
              </Link>
              <Link href="/flashcards" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Brain className="w-5 h-5" />
                  Flashcards
                </Button>
              </Link>

              {/* Resources Section */}
              <div className="px-4 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider mt-2">Resources</div>
              <Link href="/pace" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <FileText className="w-5 h-5" />
                  PACE Navigator
                </Button>
              </Link>
              <Link href="/bookmarks" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Bookmark className="w-5 h-5" />
                  Bookmarks
                </Button>
              </Link>
              <Link href="/certificates" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Award className="w-5 h-5" />
                  Certificates
                </Button>
              </Link>

              {/* Assessment Section */}
              <div className="px-4 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider mt-2">Assessment</div>
              <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <FileText className="w-5 h-5" />
                  Portfolio Guidance
                </Button>
              </Link>
              <Link href="/critical-incidents" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 pl-8">
                  <Target className="w-5 h-5" />
                  Critical Incidents Test
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 mt-2"
              >
                <Search className="w-5 h-5" />
                Search
              </Button>

              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3">
                    <Settings className="w-5 h-5" />
                    Admin
                  </Button>
                </Link>
              )}

              <div className="border-t border-white/20 mt-2 pt-2">
                <div className="flex items-center gap-3 px-4 py-2 text-white/90">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{userName}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-3 mt-1"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
