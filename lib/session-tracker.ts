import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function getClientIP(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIP || null;
}

export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('user-agent');
}

export async function startSession(userId: string): Promise<string> {
  const supabase = await createClient();
  const sessionId = uuidv4();
  const ipAddress = await getClientIP();
  const userAgent = await getUserAgent();

  await supabase.from('user_sessions').insert({
    user_id: userId,
    session_id: sessionId,
    login_time: new Date().toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  return sessionId;
}

export async function endSession(sessionId: string) {
  const supabase = await createClient();
  
  await supabase
    .from('user_sessions')
    .update({ logout_time: new Date().toISOString() })
    .eq('session_id', sessionId);
}

export async function getSessionByUserId(userId: string) {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('logout_time', null)
    .order('login_time', { ascending: false })
    .limit(1)
    .single();

  return data;
}


























