import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect directly to dashboard - no authentication required
  redirect('/dashboard');
}
