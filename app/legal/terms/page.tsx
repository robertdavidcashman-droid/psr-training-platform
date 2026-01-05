export default function TermsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Terms of Use</h1>
      <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing and using the PSR Training Platform, you accept and agree to be 
          bound by the terms and provision of this agreement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Use License</h2>
        <p className="text-gray-700">
          Permission is granted to temporarily access the materials on the PSR Training 
          Platform for personal, non-commercial use only. This is the grant of a license, 
          not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to reverse engineer any software</li>
          <li>Remove any copyright or other proprietary notations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. User Accounts</h2>
        <p className="text-gray-700">
          You are responsible for maintaining the confidentiality of your account credentials 
          and for all activities that occur under your account.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Disclaimer</h2>
        <p className="text-gray-700">
          The materials on the PSR Training Platform are provided on an 'as is' basis. 
          Default Legal Services makes no warranties, expressed or implied, and hereby 
          disclaims and negates all other warranties including, without limitation, implied 
          warranties or conditions of merchantability, fitness for a particular purpose, 
          or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Limitations</h2>
        <p className="text-gray-700">
          In no event shall Default Legal Services or its suppliers be liable for any 
          damages arising out of the use or inability to use the materials on the PSR 
          Training Platform.
        </p>
      </section>
    </div>
  );
}


























