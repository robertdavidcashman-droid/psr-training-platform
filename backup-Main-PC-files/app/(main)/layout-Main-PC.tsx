import { getCurrentUser } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { InactivityTimeout } from '@/components/auth/InactivityTimeout';
import FloatingChatButton from '@/components/layout/FloatingChatButton';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InactivityTimeout />
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24">
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
}
