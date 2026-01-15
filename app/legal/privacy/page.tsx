import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p className="text-gray-700">
          Default Legal Services ("we", "our", or "us") operates the PSR Training Platform 
          (the "Service"). This Privacy Policy informs you of our policies regarding the 
          collection, use, and disclosure of personal data when you use our Service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
        <p className="text-gray-700">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Name and email address</li>
          <li>Account credentials</li>
          <li>Training progress and assessment results</li>
          <li>IP address and session information</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
        <p className="text-gray-700">
          We use the collected information to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Provide and maintain our Service</li>
          <li>Track your training progress</li>
          <li>Send you updates and communications</li>
          <li>Improve our Service</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Data Security</h2>
        <p className="text-gray-700">
          We implement appropriate technical and organizational measures to protect your 
          personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us through 
          our <Link href="/legal/contact" className="text-primary-500 hover:text-primary-600 hover:underline transition-colors">contact page</Link>.
        </p>
      </section>
    </div>
  );
}

