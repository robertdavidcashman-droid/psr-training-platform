import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export type ActionType =
  | 'login'
  | 'logout'
  | 'question_answered'
  | 'module_started'
  | 'module_completed'
  | 'bookmark_created'
  | 'bookmark_removed'
  | 'flashcard_reviewed'
  | 'study_plan_created'
  | 'scenario_started'
  | 'scenario_completed'
  | 'mock_exam_started'
  | 'mock_exam_completed';

export interface ActivityLogData {
  action_type: ActionType;
  action_details?: Record<string, any>;
  page_url?: string;
  session_id?: string;
}

async function getClientIP(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIP || null;
}

async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('user-agent');
}

/**
 * Log a user activity to the database
 * @param userId - The user ID performing the action
 * @param data - Activity data including action type and details
 * @returns Promise that resolves when the activity is logged
 */
export async function logActivity(
  userId: string,
  data: ActivityLogData
): Promise<void> {
  try {
    const supabase = await createClient();
    
    // Get current session ID if not provided
    let sessionId = data.session_id;
    if (!sessionId) {
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('session_id')
        .eq('user_id', userId)
        .is('logout_time', null)
        .order('login_time', { ascending: false })
        .limit(1)
        .single();
      
      if (sessionData) {
        sessionId = sessionData.session_id;
      }
    }

    // Get IP address and user agent
    const ipAddress = await getClientIP();
    const userAgent = await getUserAgent();

    // Insert activity log
    const { error } = await supabase.from('user_activity_log').insert({
      user_id: userId,
      session_id: sessionId || null,
      action_type: data.action_type,
      action_details: data.action_details || {},
      page_url: data.page_url || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Error logging activity:', error);
      // Don't throw - activity logging should not break the app
    }
  } catch (error) {
    console.error('Error in logActivity:', error);
    // Don't throw - activity logging should not break the app
  }
}
