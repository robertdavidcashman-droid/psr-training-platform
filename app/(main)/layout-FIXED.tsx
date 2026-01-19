import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingChatButton from '@/components/layout/FloatingChatButton';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication removed - no auth checks needed

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
}
















