export default function DisclaimerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Legal Disclaimer</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Training Purposes Only</h2>
        <p className="text-gray-700">
          The PSR Training Platform is designed for training and educational purposes only. 
          The content provided on this platform is intended to assist police station 
          representatives in preparing for their accreditation examination.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Not Legal Advice</h2>
        <p className="text-gray-700">
          The information contained on this platform is not intended to constitute legal 
          advice. While we strive to provide accurate and up-to-date information, you 
          should not rely on this platform as a substitute for professional legal advice.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. No Guarantee of Accuracy</h2>
        <p className="text-gray-700">
          While we make every effort to ensure the accuracy of the information provided, 
          we cannot guarantee that all information is completely accurate, complete, or 
          current. Laws and regulations are subject to change, and you should verify any 
          information before relying on it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. No Warranty</h2>
        <p className="text-gray-700">
          Default Legal Services makes no warranty, express or implied, regarding the 
          fitness of the training materials for any particular purpose or the results 
          that may be obtained from using this platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Professional Responsibility</h2>
        <p className="text-gray-700">
          Users of this platform are responsible for ensuring they meet all requirements 
          for police station representative accreditation as set out by the Solicitors 
          Regulation Authority (SRA) and other relevant regulatory bodies.
        </p>
      </section>
    </div>
  );
}


























