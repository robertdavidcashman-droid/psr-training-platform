'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FileText, Search } from 'lucide-react';

interface PaceSection {
  id: string;
  code_letter: string;
  section_number: string;
  title: string;
  content: string;
}

function PacePageContent() {
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<PaceSection[]>([]);
  const [filteredSections, setFilteredSections] = useState<PaceSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<PaceSection | null>(null);

  useEffect(() => {
    loadSections();
    
    // Check if a specific section is requested via URL
    const sectionParam = searchParams.get('section');
    if (sectionParam) {
      const [code, sectionNum] = sectionParam.split('.');
      setSelectedCode(code.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    filterSections();
  }, [sections, selectedCode, searchQuery]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCode !== 'all') {
        params.append('code', selectedCode);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/pace?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PACE sections');
      }
      
      const data = await response.json();
      setSections(data.sections || []);
      setFilteredSections(data.sections || []);
      
      // If URL has a specific section, find and select it
      const sectionParam = searchParams.get('section');
      if (sectionParam && data.sections) {
        const [code, sectionNum] = sectionParam.split('.');
        const section = data.sections.find((s: PaceSection) => 
          s.code_letter.toUpperCase() === code.toUpperCase() && 
          s.section_number === sectionNum
        );
        if (section) {
          setSelectedSection(section);
        }
      }
    } catch (error) {
      console.error('Error loading PACE sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSections = () => {
    let filtered = [...sections];
    
    // Filter by code letter
    if (selectedCode !== 'all') {
      filtered = filtered.filter(s => s.code_letter.toUpperCase() === selectedCode.toUpperCase());
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.content.toLowerCase().includes(query) ||
        s.section_number.toLowerCase().includes(query)
      );
    }
    
    setFilteredSections(filtered);
  };

  const handleSearch = () => {
    loadSections();
  };

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    if (code === 'all') {
      loadSections();
    } else {
      filterSections();
    }
  };

  // Get unique code letters
  const uniqueCodes = Array.from(new Set(sections.map(s => s.code_letter.toUpperCase())))
    .sort();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading PACE Code sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">PACE Code Navigator</h1>
        <p className="text-muted-foreground text-lg">
          Search and browse PACE Codes of Practice sections
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, content, or section number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select
                value={selectedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
              >
                <option value="all">All Codes</option>
                {uniqueCodes.map(code => (
                  <option key={code} value={code}>Code {code}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Sections ({filteredSections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredSections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No sections found
                  </p>
                ) : (
                  filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedSection?.id === section.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">
                            Code {section.code_letter}, Section {section.section_number}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {section.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Viewer */}
        <div className="lg:col-span-2">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Code {selectedSection.code_letter}, Section {selectedSection.section_number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">{selectedSection.title}</h3>
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedSection.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a section from the list to view its content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PacePage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading PACE Code sections...</p>
        </div>
      </div>
    }>
      <PacePageContent />
    </Suspense>
  );
}
