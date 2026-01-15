// Add this export to each page.tsx file for SEO
// Copy-paste metadata from lib/metadata.ts

/*
INSTRUCTIONS FOR ADDING METADATA TO PAGES:

1. Import at top of page:
   import { Metadata } from 'next';

2. Add export above component:
   export const metadata: Metadata = {
     title: "Page Title",
     description: "Page description"
   };

3. Reference lib/metadata.ts for pre-written metadata

EXAMPLE:

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Practice Questions",
  description: "Practice PSR exam questions with instant feedback."
};

export default function PracticePage() {
  // component code
}
*/

// === QUICK COPY-PASTE METADATA ===

// app/(main)/dashboard/page.tsx
export const metadata = {
  title: "Dashboard",
  description: "Your PSR training dashboard. Track progress, view statistics, and access all training materials."
};

// app/(main)/practice/page.tsx  
export const metadata = {
  title: "Practice Questions",
  description: "Practice PSR exam questions with instant feedback, explanations, and progress tracking."
};

// app/(main)/questions/page.tsx
export const metadata = {
  title: "Question Bank",
  description: "Browse the complete PSR question bank. Search, filter, and bookmark questions."
};

// app/(main)/scenarios/page.tsx
export const metadata = {
  title: "Practice Scenarios",
  description: "Real-world PSR scenarios to test your knowledge and decision-making skills."
};

// app/(main)/modules/page.tsx
export const metadata = {
  title: "Training Modules",
  description: "Comprehensive PSR training modules covering PACE codes, disclosure, and more."
};

// app/(main)/flashcards/page.tsx
export const metadata = {
  title: "Flashcards",
  description: "Spaced repetition flashcards for PSR training with intelligent scheduling."
};

// app/(main)/mock-exam/page.tsx
export const metadata = {
  title: "Mock Exam",
  description: "Take a timed mock PSR exam to assess your readiness with detailed results."
};

// app/(main)/pace/page.tsx
export const metadata = {
  title: "PACE Codes",
  description: "Interactive PACE codes reference. Search and study Codes A-H."
};

// app/(main)/study-plan/page.tsx
export const metadata = {
  title: "Study Plan",
  description: "Create a personalised PSR study plan and track your progress."
};

// app/(main)/bookmarks/page.tsx
export const metadata = {
  title: "Bookmarks",
  description: "Your bookmarked questions and modules for quick access."
};

// app/(main)/certificates/page.tsx
export const metadata = {
  title: "Certificates",
  description: "View and download your PSR training certificates and achievements."
};

// app/legal/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy",
  description: "PSR Train privacy policy and data protection information."
};

// app/legal/terms/page.tsx
export const metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using PSR Train platform."
};

// app/legal/disclaimer/page.tsx
export const metadata = {
  title: "Legal Disclaimer",
  description: "Legal disclaimer for PSR Train training materials and services."
};

// app/legal/faq/page.tsx
export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about PSR Train platform."
};

// app/legal/contact/page.tsx
export const metadata = {
  title: "Contact Us",
  description: "Get in touch with PSR Train support team."
};

// app/legal/about/page.tsx
export const metadata = {
  title: "About Us",
  description: "About PSR Train and our mission for quality PSR training."
};

// app/(auth)/login/page.tsx
export const metadata = {
  title: "Login",
  description: "Login to PSR Train and access your training dashboard."
};

// app/(auth)/signup/page.tsx
export const metadata = {
  title: "Sign Up",
  description: "Create a PSR Train account and start your training journey."
};

// app/admin/page.tsx
export const metadata = {
  title: "Admin Dashboard",
  description: "PSR Train admin panel for managing users and content."
};
















