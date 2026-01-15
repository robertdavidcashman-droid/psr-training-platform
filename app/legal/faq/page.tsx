import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is the PSR Training Platform?',
      answer: 'The PSR Training Platform is a comprehensive online resource designed to help aspiring police station representatives prepare for their accreditation examinations. We provide practice questions, learning modules, scenario simulations, and other educational resources.',
    },
    {
      question: 'Who is this platform for?',
      answer: 'This platform is designed for individuals who are preparing to become accredited police station representatives in the UK. It is suitable for both beginners and those looking to refresh their knowledge.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply create an account and start exploring our learning modules, practice questions, and other resources. We recommend starting with the learning modules to build your foundational knowledge, then moving on to practice questions and scenarios.',
    },
    {
      question: 'Is the platform free to use?',
      answer: 'Please check our pricing page or contact us for information about access and pricing options.',
    },
    {
      question: 'Are the questions updated regularly?',
      answer: 'Yes, we regularly update our question bank to ensure accuracy and relevance. Our content is reviewed to reflect current laws, regulations, and best practices.',
    },
    {
      question: 'Can I track my progress?',
      answer: 'Yes! The platform includes comprehensive progress tracking. You can view your performance statistics, track your improvement over time, and identify areas where you need more practice.',
    },
    {
      question: 'Do you offer certificates?',
      answer: 'Yes, certificates are available upon completion of certain modules or achievement milestones. Check the certificates page in your dashboard for more information.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            If you can't find the answer you're looking for, please{' '}
            <a href="/legal/contact" className="text-primary hover:underline">
              contact us
            </a>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
