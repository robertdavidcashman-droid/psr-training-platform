import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LegalAdviceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}














