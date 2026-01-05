'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (open) {
      // Focus search input when dialog opens
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
      }
    } else {
      setQuery('');
    }
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results or perform search
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <form onSubmit={handleSearch} className="flex-1">
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, modules, scenarios..."
              className="w-full text-lg outline-none bg-transparent text-gray-900 placeholder-gray-400"
            />
          </form>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          {query.trim() ? (
            <div className="text-sm text-gray-500">
              Press Enter to search for &quot;{query}&quot;
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






