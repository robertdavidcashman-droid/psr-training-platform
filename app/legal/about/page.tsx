export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      
      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="text-muted-foreground">
          The PSR Training Platform is dedicated to helping aspiring police station 
          representatives successfully complete their accreditation training and examinations. 
          We provide comprehensive resources, practice questions, and educational content 
          to support your journey toward becoming a qualified police station representative.
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Comprehensive question banks covering all areas of police station representation</li>
          <li>Interactive learning modules and educational content</li>
          <li>Practice exams and scenario simulations</li>
          <li>PACE Code Navigator for quick reference</li>
          <li>Progress tracking and performance analytics</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p className="text-muted-foreground">
          For questions or support, please visit our{' '}
          <a href="/legal/contact" className="text-primary hover:underline">
            contact page
          </a>
          .
        </p>
      </section>
    </div>
  );
}
