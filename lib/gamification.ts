import { createClient } from '@/lib/supabase/server';

export async function awardXP(userId: string, amount: number) {
  const supabase = await createClient();
  
  // Update XP using the database function
  const { error } = await supabase.rpc('update_user_xp', {
    user_uuid: userId,
    xp_gained: amount
  });

  if (error) {
    console.error('Error awarding XP:', error);
    return false;
  }

  return true;
}

export async function updateStreak(userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.rpc('update_daily_streak', {
    user_uuid: userId
  });

  if (error) {
    console.error('Error updating streak:', error);
    return false;
  }

  return true;
}

// XP amounts for different actions
export const XP_REWARDS = {
  QUESTION_CORRECT: 10,
  QUESTION_INCORRECT: 2,
  MODULE_COMPLETE: 100,
  DAILY_LOGIN: 5,
  STREAK_MILESTONE: 50, // For 7, 14, 30 day streaks
};

























