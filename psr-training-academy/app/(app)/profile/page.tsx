import { requireAuth } from '@/lib/auth';

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="text-muted-foreground">Account settings (coming soon).</p>
      <div className="text-muted-foreground text-sm">Signed in as: {user.email}</div>
    </div>
  );
}
