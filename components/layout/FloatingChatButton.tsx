'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-navy shadow-elevated hover:bg-accent-600 hover:scale-105 z-50 flex items-center justify-center transition-all duration-200"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--navy)' }}
        aria-label="Open support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-elevated border border-border z-50 overflow-hidden animate-slide-up">
          <div className="bg-primary p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Need Help?</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about the platform or need support? We&apos;re here to help!
            </p>
            <div className="space-y-2">
              <a
                href="/legal/contact"
                className="block w-full text-center bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy-hover transition-colors text-sm"
              >
                Contact Support
              </a>
              <a
                href="/legal/faq"
                className="block w-full text-center border-2 border-border py-3 rounded-xl font-semibold hover:bg-muted transition-colors text-sm"
              >
                View FAQ
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
