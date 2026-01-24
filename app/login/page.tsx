import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const next = typeof sp?.next === "string" ? sp.next : "";
  if (next) redirect(`/gateway?next=${encodeURIComponent(next)}`);
  redirect("/gateway");
}
