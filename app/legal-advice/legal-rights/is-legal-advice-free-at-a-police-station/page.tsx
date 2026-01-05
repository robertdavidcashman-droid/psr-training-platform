import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Legal Advice Free at a Police Station? | Police Station Legal Advice',
  description: 'Learn about your right to free legal advice at police stations in England and Wales, including how to access the duty solicitor scheme and legal aid funding.',
  keywords: ['free legal advice', 'duty solicitor', 'legal aid', 'police station', 'solicitor', 'PACE', 'UK law'],
  openGraph: {
    title: 'Is Legal Advice Free at a Police Station?',
    description: 'Learn about your right to free legal advice at police stations in England and Wales.',
    type: 'article',
  },
};

export default function IsLegalAdviceFreeAtPoliceStationPage() {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">Is Legal Advice Free at a Police Station?</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-lg text-gray-800 leading-relaxed">
            Yes, legal advice is free at police stations in England and Wales for everyone, regardless 
            of your financial circumstances. This right is protected under PACE and is funded through 
            the legal aid system. You can access free advice through the duty solicitor scheme, which 
            operates 24 hours a day, or by contacting your own solicitor.
          </p>
        </div>
      </header>

      <div className="prose prose-lg max-w-none space-y-8">
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Right to Free Legal Advice</h2>
          <p className="text-gray-700 leading-relaxed">
            Under the Police and Criminal Evidence Act 1984 (PACE), everyone has the right to free, 
            independent legal advice when they are detained at a police station or attending a voluntary 
            interview. This right is absolute and does not depend on your income, assets, or whether 
            you can afford to pay for legal representation.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The police must inform you of this right when you arrive at the police station, before any 
            interview begins, and at various other stages during your detention. This right applies 
            whether you are under arrest or attending voluntarily.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How Legal Advice is Funded</h2>
          <p className="text-gray-700 leading-relaxed">
            Free legal advice at police stations is funded through the legal aid system, which is 
            administered by the Legal Aid Agency. The costs are covered by the government, meaning 
            you do not pay anything for:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Initial consultation with a solicitor</li>
            <li>The solicitor's attendance at the police station</li>
            <li>Advice before, during, and after your interview</li>
            <li>Legal representation during the interview</li>
            <li>Telephone advice if the solicitor cannot attend in person</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            This applies regardless of your financial situation. Unlike other forms of legal aid, 
            there is no means test for police station advice. Whether you are employed or unemployed, 
            have savings or none, the advice is free.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The Duty Solicitor Scheme</h2>
          <p className="text-gray-700 leading-relaxed">
            The duty solicitor scheme provides 24-hour access to free legal advice at police stations 
            across England and Wales. This service operates through a rota system, with solicitors 
            available on call at all times.
          </p>

          <h3 className="text-xl font-semibold mt-6">How to Access the Duty Solicitor</h3>
          <p className="text-gray-700 leading-relaxed">
            You can request the duty solicitor in several ways:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Tell the custody officer that you want legal advice</li>
            <li>Ask to speak to the duty solicitor</li>
            <li>Use the telephone in the custody suite to contact the scheme directly</li>
            <li>Request legal advice at any time, even if you initially declined it</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            The duty solicitor will usually attend the police station in person, though in some 
            circumstances they may provide advice over the telephone or via video link. The duty 
            solicitor is independent of the police and works solely in your interests.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Using Your Own Solicitor</h2>
          <p className="text-gray-700 leading-relaxed">
            You are not limited to using the duty solicitor. You can choose to contact your own 
            solicitor, and if they are available and willing to attend, they can provide your legal 
            advice instead. Your own solicitor's attendance at the police station is also covered 
            by legal aid, meaning there is no cost to you.
          </p>
          <p className="text-gray-700 leading-relaxed">
            However, if you choose to use your own solicitor, you may need to wait longer for them 
            to arrive, especially if it is outside normal business hours. The duty solicitor is 
            usually the fastest option for immediate advice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What the Solicitor Can Do</h2>
          <p className="text-gray-700 leading-relaxed">
            A solicitor attending the police station can provide a range of services, all free of charge:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Explain your legal rights and the police procedures</li>
            <li>Advise you on whether to answer questions or exercise your right to silence</li>
            <li>Attend your interview with you and intervene if necessary</li>
            <li>Ensure the police follow proper procedures</li>
            <li>Provide advice on bail conditions if you are charged</li>
            <li>Advise you on what happens next in the investigation</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            The solicitor's role is to protect your rights and ensure you receive fair treatment. 
            They work independently of the police and are bound by professional obligations to act 
            in your best interests.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Common Misunderstandings</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"I have to pay for a solicitor if I use my own"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is not correct. If your own solicitor attends the police station, their attendance 
                is funded through legal aid, just like the duty solicitor. There is no cost to you, 
                regardless of which solicitor you choose.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"Free legal advice is only for people who can't afford it"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is incorrect. Free legal advice at police stations is available to everyone, 
                regardless of income or wealth. There is no means test for police station advice. 
                This is different from other types of legal aid, which may require a financial assessment.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"The duty solicitor works for the police"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is completely false. The duty solicitor is completely independent of the police. 
                They are qualified solicitors who work in your interests only. They are funded through 
                legal aid, not by the police, and have professional obligations to act solely for you.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"I can't get free advice if I'm attending voluntarily"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is incorrect. Even if you attend a police station voluntarily (not under arrest), 
                you still have the right to free legal advice. The right applies whether you are 
                detained or attending voluntarily for an interview under caution.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Related Questions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <Link href="/legal-advice/police-interviews/can-police-interview-me-without-a-solicitor" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Can police interview me without a solicitor?
              </Link>
            </li>
            <li>
              <Link href="/legal-advice/police-interviews/do-i-have-to-answer-police-questions" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Do I have to answer police questions?
              </Link>
            </li>
            <li>
              <Link href="/legal-advice/police-interviews/can-i-leave-a-voluntary-police-interview" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Can I leave a voluntary police interview?
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">Need Legal Representation?</h2>
          <p className="text-gray-700 mb-4">
            Remember, free legal advice is available to everyone at the police station. If you are 
            facing a police interview, exercise your right to legal advice.
          </p>
          <p className="text-gray-700">
            For more information about police station representation services, please{' '}
            <Link href="/legal/contact" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              contact us
            </Link>
            {' '}or visit our{' '}
            <Link href="/legal/about" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              about page
            </Link>
            .
          </p>
        </section>

        <section className="border-t pt-8 space-y-4">
          <h2 className="text-xl font-semibold">Legal Sources and References</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
            <li>Police and Criminal Evidence Act 1984 (PACE)</li>
            <li>PACE Code C: Code of Practice for the Detention, Treatment and Questioning of Persons by Police Officers (paragraph 6.1)</li>
            <li>Legal Aid, Sentencing and Punishment of Offenders Act 2012</li>
          </ul>
        </section>

        <section className="border-t pt-8 space-y-4 bg-gray-50 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold">Legal Disclaimer</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Information Purposes Only</strong><br />
              The information provided on this page is for general informational purposes only and 
              does not constitute legal advice. While we strive to provide accurate and up-to-date 
              information, you should not rely on this content as a substitute for professional legal advice.
            </p>
            <p>
              <strong>2. Seek Professional Advice</strong><br />
              If you are at a police station or require legal advice regarding your specific situation, 
              you should exercise your right to free legal advice by requesting a solicitor. The duty 
              solicitor scheme is available 24 hours a day.
            </p>
            <p className="text-xs text-gray-600 italic mt-4">
              Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is legal advice free at a police station?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, legal advice is free at police stations in England and Wales for everyone, regardless of your financial circumstances. This right is protected under PACE and is funded through the legal aid system. You can access free advice through the duty solicitor scheme, which operates 24 hours a day."
                }
              },
              {
                "@type": "Question",
                "name": "Do I have to pay for a solicitor at the police station?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, you do not have to pay for a solicitor at the police station. Legal advice is free for everyone, whether you use the duty solicitor or your own solicitor. The costs are covered by legal aid, and there is no means test for police station advice."
                }
              },
              {
                "@type": "Question",
                "name": "How do I access free legal advice at a police station?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can request free legal advice by telling the custody officer that you want legal advice, asking for the duty solicitor, or using the telephone in the custody suite to contact the scheme directly. The duty solicitor is available 24 hours a day, and you can request legal advice at any time."
                }
              },
              {
                "@type": "Question",
                "name": "Is the duty solicitor independent of the police?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the duty solicitor is completely independent of the police. They are qualified solicitors who work solely in your interests and are funded through legal aid, not by the police. They have professional obligations to act solely for you."
                }
              }
            ]
          })
        }}
      />
    </article>
  );
}
