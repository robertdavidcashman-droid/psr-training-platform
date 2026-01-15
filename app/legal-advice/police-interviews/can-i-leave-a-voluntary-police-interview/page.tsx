import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Can I Leave a Voluntary Police Interview? | Police Station Legal Advice',
  description: 'Understand your rights during voluntary police interviews in England and Wales, including when you can leave and what happens if you do.',
  keywords: ['voluntary interview', 'police interview', 'leave interview', 'PACE', 'police station', 'legal rights', 'UK law'],
  openGraph: {
    title: 'Can I Leave a Voluntary Police Interview?',
    description: 'Understand your rights during voluntary police interviews in England and Wales.',
    type: 'article',
  },
};

export default function CanILeaveVoluntaryInterviewPage() {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">Can I Leave a Voluntary Police Interview?</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-lg text-gray-800 leading-relaxed">
            Yes, you can generally leave a voluntary police interview at any time because you are not 
            under arrest. However, if the police have sufficient grounds, they may arrest you to 
            continue the interview. It is advisable to seek legal advice before attending a voluntary 
            interview and to inform the police if you wish to leave.
          </p>
        </div>
      </header>

      <div className="prose prose-lg max-w-none space-y-8">
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Understanding Voluntary Interviews</h2>
          <p className="text-gray-700 leading-relaxed">
            A voluntary interview (also known as a "voluntary attendance" or "interview under caution") 
            is when you attend a police station to be interviewed without being under arrest. You are 
            free to leave at any time, but the interview is still conducted under caution, meaning 
            anything you say can be used as evidence in court.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The key difference between a voluntary interview and an interview following arrest is that 
            you are not legally detained. You have chosen to attend, and you retain the freedom to leave, 
            though the police may choose to arrest you if you attempt to leave and they have grounds to do so.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Right to Leave</h2>
          <p className="text-gray-700 leading-relaxed">
            Because you are not under arrest during a voluntary interview, you have the right to leave 
            at any point. This means:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>You are not being detained against your will</li>
            <li>You can end the interview and walk out of the police station</li>
            <li>The police cannot physically prevent you from leaving (unless they arrest you)</li>
            <li>You should inform the police that you are leaving rather than simply walking out</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            However, it is important to understand that leaving a voluntary interview does not mean the 
            investigation ends. The police may continue their investigation and may arrest you later if 
            they obtain sufficient evidence.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What Happens If You Leave</h2>
          <p className="text-gray-700 leading-relaxed">
            If you decide to leave a voluntary interview, several things may happen:
          </p>

          <h3 className="text-xl font-semibold mt-6">1. The Interview Ends</h3>
          <p className="text-gray-700 leading-relaxed">
            The immediate interview will stop, and you are free to leave the police station. The police 
            cannot continue questioning you once you have left.
          </p>

          <h3 className="text-xl font-semibold mt-6">2. You May Be Arrested</h3>
          <p className="text-gray-700 leading-relaxed">
            If the police have reasonable grounds to suspect you of an offence, they may arrest you as 
            you leave or shortly afterward. Once arrested, you would be detained and could be interviewed 
            again, but this time as a detained person rather than a voluntary attendee.
          </p>

          <h3 className="text-xl font-semibold mt-6">3. The Investigation Continues</h3>
          <p className="text-gray-700 leading-relaxed">
            Leaving a voluntary interview does not end the police investigation. The police may continue 
            to gather evidence, speak to witnesses, and may contact you again in the future. They may 
            also apply for a warrant for your arrest if they believe they have sufficient evidence.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Before Attending a Voluntary Interview</h2>
          <p className="text-gray-700 leading-relaxed">
            It is highly advisable to take certain steps before attending a voluntary interview:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Seek legal advice:</strong> Contact a solicitor before attending, even if the interview is voluntary</li>
            <li><strong>Understand your rights:</strong> You have the right to free legal advice at the police station</li>
            <li><strong>Arrange for a solicitor:</strong> You can arrange for a solicitor to attend with you, or use the duty solicitor</li>
            <li><strong>Consider the implications:</strong> Anything you say can be used as evidence, even in a voluntary interview</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Many people mistakenly believe that because an interview is "voluntary," it is less serious 
            or they don't need legal representation. This is not correct. Voluntary interviews are 
            conducted under the same caution as interviews following arrest, and the consequences can 
            be equally serious.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">When Should You Leave?</h2>
          <p className="text-gray-700 leading-relaxed">
            There are several situations where you might consider leaving a voluntary interview:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>You feel unwell or need medical attention</li>
            <li>You need to consult with your solicitor privately</li>
            <li>You do not feel able to continue</li>
            <li>You wish to take legal advice before answering further questions</li>
            <li>The police are not following proper procedures</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            If you do decide to leave, it is best to inform the police clearly that you are ending the 
            interview and leaving. Simply walking out without explanation may be viewed unfavourably and 
            could influence the police's decision about whether to arrest you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Common Misunderstandings</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"Voluntary interviews aren't serious"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is incorrect. Voluntary interviews are conducted under the same caution as interviews 
                following arrest, and anything you say can be used as evidence. They are often used in 
                serious investigations and can lead to prosecution.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"I don't need a solicitor for a voluntary interview"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is a common and dangerous misconception. You have the right to free legal advice, 
                and having a solicitor present can help protect your rights and ensure proper procedures 
                are followed. Legal advice is just as important for voluntary interviews as for interviews 
                following arrest.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"If I leave, the police can't do anything"</h3>
              <p className="text-gray-700 leading-relaxed">
                Leaving a voluntary interview does not end the investigation. The police may continue 
                their enquiries, gather evidence, and may arrest you later if they obtain sufficient 
                grounds. Leaving does not make the investigation go away.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Related Questions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              <Link href="/legal-advice/police-interviews/do-i-have-to-answer-police-questions" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Do I have to answer police questions?
              </Link>
            </li>
            <li>
              <Link href="/legal-advice/police-interviews/can-police-interview-me-without-a-solicitor" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Can police interview me without a solicitor?
              </Link>
            </li>
            <li>
              <Link href="/legal-advice/legal-rights/is-legal-advice-free-at-a-police-station" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Is legal advice free at a police station?
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">Need Legal Representation?</h2>
          <p className="text-gray-700 mb-4">
            If you have been asked to attend a voluntary interview, having a solicitor present can help 
            protect your rights and guide you through the process.
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
            <li>PACE Code C: Code of Practice for the Detention, Treatment and Questioning of Persons by Police Officers</li>
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
              If you have been asked to attend a voluntary interview or require legal advice regarding 
              your specific situation, you should consult with a qualified solicitor immediately. You 
              have the right to free legal advice at the police station.
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
                "name": "Can I leave a voluntary police interview?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can generally leave a voluntary police interview at any time because you are not under arrest. However, if the police have sufficient grounds, they may arrest you to continue the interview. It is advisable to seek legal advice before attending a voluntary interview and to inform the police if you wish to leave."
                }
              },
              {
                "@type": "Question",
                "name": "What happens if I leave a voluntary police interview?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "If you leave a voluntary interview, the interview ends and you are free to leave. However, the police investigation continues, and the police may arrest you later if they have sufficient grounds. Leaving does not end the investigation."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need a solicitor for a voluntary interview?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, it is highly advisable to have a solicitor present for a voluntary interview. You have the right to free legal advice, and voluntary interviews are conducted under the same caution as interviews following arrest. Anything you say can be used as evidence."
                }
              }
            ]
          })
        }}
      />
    </article>
  );
}
