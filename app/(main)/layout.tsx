import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication removed - layout works without login

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-32">
        {children}
      </main>
      <Footer />
    </div>
  );
}
