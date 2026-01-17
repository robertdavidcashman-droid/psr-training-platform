import { createClient } from '@/lib/supabase/server';

export async function db() {
  return await createClient();
}

export function assertOk<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data;
}
