import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';
import FloatingChatButton from '@/components/layout/FloatingChatButton';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

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
















