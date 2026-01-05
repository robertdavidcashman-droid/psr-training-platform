import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Police Station Legal Advice Hub | UK Legal Information',
  description: 'Comprehensive legal information about your rights during police interviews, arrest, detention, and bail in England and Wales. Free guidance on police station procedures.',
  keywords: ['police station', 'legal advice', 'police interview', 'arrest', 'PACE', 'legal rights', 'UK law'],
  openGraph: {
    title: 'Police Station Legal Advice Hub',
    description: 'Comprehensive legal information about your rights during police interviews and procedures.',
    type: 'website',
  },
};

const legalAdvicePages = {
  'Police Interviews': [
    {
      title: 'Do I Have to Answer Police Questions?',
      url: '/legal-advice/police-interviews/do-i-have-to-answer-police-questions',
      description: 'Understand your right to remain silent and when you may be required to provide information during police questioning.',
    },
    {
      title: 'Can Police Interview Me Without a Solicitor?',
      url: '/legal-advice/police-interviews/can-police-interview-me-without-a-solicitor',
      description: 'Learn about your right to legal advice and when the police must wait for your solicitor to arrive.',
    },
    {
      title: 'Can I Leave a Voluntary Police Interview?',
      url: '/legal-advice/police-interviews/can-i-leave-a-voluntary-police-interview',
      description: 'Understand your rights during voluntary interviews and what happens if you decide to leave.',
    },
  ],
  'Legal Rights': [
    {
      title: 'Is Legal Advice Free at a Police Station?',
      url: '/legal-advice/legal-rights/is-legal-advice-free-at-a-police-station',
      description: 'Learn about your right to free legal advice at police stations and how to access the duty solicitor scheme.',
    },
  ],
};

export default function LegalAdviceIndexPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <header className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Police Station Legal Advice Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive, accurate information about your legal rights during police interviews, 
          arrest, and detention in England and Wales.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-3xl mx-auto mt-6">
          <p className="text-gray-800">
            <strong>Important:</strong> This information is for general guidance only and does not 
            constitute legal advice. If you are at a police station or facing a police interview, 
            you should exercise your right to free legal advice by requesting a solicitor.
          </p>
        </div>
      </header>

      {/* Topic Sections */}
      <div className="space-y-12">
        {Object.entries(legalAdvicePages).map(([category, pages]) => (
          <section key={category} className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-3xl font-semibold">{category}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.url} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      <Link 
                        href={page.url}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {page.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      {page.description}
                    </CardDescription>
                    <Link 
                      href={page.url}
                      className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Read more &rarr;
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Additional Information */}
      <section className="bg-gray-50 rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-semibold">About This Information</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            This legal advice hub provides accurate, up-to-date information about your rights during 
            police station procedures in England and Wales. All content is based on current legislation, 
            including the Police and Criminal Evidence Act 1984 (PACE) and related codes of practice.
          </p>
          <p>
            <strong>Remember:</strong> You have the right to free, independent legal advice at any 
            police station, available 24 hours a day through the duty solicitor scheme. This advice 
            is free for everyone, regardless of your financial circumstances.
          </p>
          <p>
            If you need legal representation or have questions about your specific situation, please{' '}
            <Link href="/legal/contact" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              contact us
            </Link>
            {' '}or{' '}
            <Link href="/legal/about" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              learn more about our services
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="border-t pt-8 space-y-4">
        <h2 className="text-xl font-semibold">Legal Disclaimer</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            The information provided on this website is for general informational purposes only and 
            does not constitute legal advice. While we strive to provide accurate and up-to-date 
            information, you should not rely on this content as a substitute for professional legal 
            advice tailored to your specific circumstances.
          </p>
          <p>
            If you are facing a police interview, have been arrested, or require legal advice 
            regarding your specific situation, you should consult with a qualified solicitor 
            immediately. You have the right to free legal advice at the police station, which you 
            should exercise.
          </p>
          <p>
            We accept no liability for any loss or damage arising from reliance on the information 
            contained on this website. Laws and procedures may change, and individual circumstances vary.
          </p>
        </div>
      </section>
    </div>
  );
}
