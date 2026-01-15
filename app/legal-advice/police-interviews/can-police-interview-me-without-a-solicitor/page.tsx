import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Can Police Interview Me Without a Solicitor? | Police Station Legal Advice',
  description: 'Understand your right to legal advice during police interviews in England and Wales, including when the police must wait and when interviews can proceed.',
  keywords: ['police interview', 'solicitor', 'legal advice', 'PACE', 'police station', 'right to solicitor', 'UK law'],
  openGraph: {
    title: 'Can Police Interview Me Without a Solicitor?',
    description: 'Understand your right to legal advice during police interviews in England and Wales.',
    type: 'article',
  },
};

export default function CanPoliceInterviewMeWithoutSolicitorPage() {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">Can Police Interview Me Without a Solicitor?</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-lg text-gray-800 leading-relaxed">
            No, the police cannot normally interview you without a solicitor if you have requested one. 
            Under PACE, you have the right to free legal advice, and the police must wait a reasonable 
            time for your solicitor to arrive. However, in exceptional circumstances, such as urgent 
            interviews to prevent harm or property loss, the police may proceed without waiting.
          </p>
        </div>
      </header>

      <div className="prose prose-lg max-w-none space-y-8">
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Right to Legal Advice Under PACE</h2>
          <p className="text-gray-700 leading-relaxed">
            The Police and Criminal Evidence Act 1984 (PACE) establishes your fundamental right to 
            free, independent legal advice when you are detained at a police station or attending a 
            voluntary interview. This right is set out in PACE Code C, paragraph 6.1, which states 
            that all detainees must be informed of their right to consult with a solicitor.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Once you have requested legal advice, the police are generally required to delay the 
            interview until you have had a reasonable opportunity to consult with a solicitor. This 
            consultation can take place in person, over the telephone, or via video link.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">When the Police Must Wait for a Solicitor</h2>
          <p className="text-gray-700 leading-relaxed">
            In most circumstances, the police must wait for your solicitor to arrive before conducting 
            an interview. The specific requirements include:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>You have requested legal advice (either the duty solicitor or your own solicitor)</li>
            <li>A reasonable time has not yet passed for the solicitor to attend</li>
            <li>No exceptional circumstances exist that would justify proceeding without delay</li>
            <li>You are not being interviewed as a witness only (different rules apply)</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mt-4">
            The police must inform you of your right to legal advice at various stages, including 
            when you arrive at the police station, before any interview begins, and if your 
            circumstances change during detention.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Exceptional Circumstances: When Interviews May Proceed</h2>
          <p className="text-gray-700 leading-relaxed">
            Under PACE Code C, Annex B, there are limited exceptional circumstances where the police 
            may proceed with an interview without waiting for a solicitor. These exceptions are 
            strictly limited and include:
          </p>

          <h3 className="text-xl font-semibold mt-6">1. Risk of Harm to Others</h3>
          <p className="text-gray-700 leading-relaxed">
            If delay would lead to interference with evidence, harm to others, or alerting other 
            suspects, the police may proceed. However, this must be authorised by an officer of at 
            least the rank of inspector, and the interview must be conducted in the presence of an 
            appropriate adult if the detainee is vulnerable.
          </p>

          <h3 className="text-xl font-semibold mt-6">2. Immediate Interview for Serious Offences</h3>
          <p className="text-gray-700 leading-relaxed">
            For certain serious offences, if an interview is immediately necessary to obtain evidence, 
            the police may proceed. However, this exception is rarely used and requires high-level 
            authorisation.
          </p>

          <h3 className="text-xl font-semibold mt-6">3. Solicitor's Unreasonable Delay</h3>
          <p className="text-gray-700 leading-relaxed">
            If the solicitor has been informed of your detention but has not attended within a 
            reasonable time (typically within 36 hours, or sooner for less serious matters), the 
            police may proceed. However, they must have made reasonable efforts to contact the 
            solicitor and given adequate notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Voluntary Interviews and Legal Advice</h2>
          <p className="text-gray-700 leading-relaxed">
            Even if you attend a police station voluntarily (not under arrest), you still have the 
            right to free legal advice. The police should inform you of this right before the 
            interview begins. You can request legal advice at any point, including before you arrive 
            at the station.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you request legal advice during a voluntary interview, the police should pause the 
            interview to allow you to consult with a solicitor. This consultation can happen in 
            private, and you can choose whether to continue with the interview afterward.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to Request Legal Advice</h2>
          <p className="text-gray-700 leading-relaxed">
            You can request legal advice in several ways:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Verbally to the custody officer or investigating officer</li>
            <li>By contacting the duty solicitor scheme (available 24 hours)</li>
            <li>By contacting your own solicitor directly</li>
            <li>By using the telephone available in custody suites</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            The police must not discourage you from seeking legal advice, and any attempts to do so 
            may render any subsequent interview inadmissible as evidence.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Common Misunderstandings</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"The police can interview me without a solicitor if I'm just helping with enquiries"</h3>
              <p className="text-gray-700 leading-relaxed">
                This is not correct. Even if you attend voluntarily, you have the right to legal 
                advice. If you are interviewed under caution, you are suspected of an offence, and 
                your right to legal advice applies regardless of whether you are under arrest.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"I can't get a solicitor if I'm only being questioned as a witness"</h3>
              <p className="text-gray-700 leading-relaxed">
                While different rules apply to witnesses, if you are being interviewed under caution, 
                you are a suspect, not just a witness. You have the full right to legal advice. If 
                you are unsure, ask the police whether you are being interviewed under caution.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">"The police can force me to be interviewed without a solicitor"</h3>
              <p className="text-gray-700 leading-relaxed">
                No. If you have requested legal advice, the police must wait a reasonable time unless 
                exceptional circumstances apply. You cannot be forced to waive your right to legal 
                advice, and any pressure to do so is improper.
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
              <Link href="/legal-advice/police-interviews/can-i-leave-a-voluntary-police-interview" 
                    className="text-blue-600 hover:text-blue-800 underline">
                Can I leave a voluntary police interview?
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
            If you are facing a police interview, having a solicitor present can help protect your 
            rights and ensure proper procedures are followed.
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
            <li>PACE Code C: Code of Practice for the Detention, Treatment and Questioning of Persons by Police Officers (paragraph 6.1, Annex B)</li>
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
              <strong>2. Not a Solicitor-Client Relationship</strong><br />
              Reading this information does not create a solicitor-client relationship. The information 
              is general in nature and may not apply to your specific circumstances.
            </p>
            <p>
              <strong>3. Seek Professional Advice</strong><br />
              If you are facing a police interview or require legal advice regarding your specific 
              situation, you should consult with a qualified solicitor immediately. You have the right 
              to free legal advice at the police station, which you should exercise.
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
                "name": "Can police interview me without a solicitor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, the police cannot normally interview you without a solicitor if you have requested one. Under PACE, you have the right to free legal advice, and the police must wait a reasonable time for your solicitor to arrive. However, in exceptional circumstances, such as urgent interviews to prevent harm or property loss, the police may proceed without waiting."
                }
              },
              {
                "@type": "Question",
                "name": "When can the police interview me without waiting for a solicitor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The police may proceed without waiting for a solicitor only in exceptional circumstances, such as when delay would lead to interference with evidence, harm to others, or alerting other suspects. This requires authorisation by an officer of at least inspector rank and is strictly limited."
                }
              },
              {
                "@type": "Question",
                "name": "Do I have the right to legal advice during a voluntary interview?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, even if you attend a police station voluntarily, you still have the right to free legal advice. The police should inform you of this right before the interview begins, and you can request legal advice at any point."
                }
              }
            ]
          })
        }}
      />
    </article>
  );
}
