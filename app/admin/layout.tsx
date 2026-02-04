import { AppShell } from "@/components/layout/AppShell";
import { ActivityPing } from "@/components/ActivityPing";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <ActivityPing />
      {children}
    </AppShell>
  );
}
