import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  // Next 16+ may provide `searchParams` as a Promise (sync dynamic APIs).
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);
  const nextPath = typeof sp?.next === 'string' ? sp.next : undefined;
  return <LoginForm nextPath={nextPath} />;
}
