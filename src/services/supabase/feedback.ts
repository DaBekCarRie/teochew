import { supabase } from './client';

export interface FeedbackPayload {
  rating: number;
  category: string;
  message?: string;
  grandparent_status?: string | null;
  app_version?: string;
  platform?: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || null;

  const { error } = await supabase.from('feedback').insert({
    user_id: userId,
    rating: payload.rating,
    category: payload.category,
    message: payload.message || null,
    grandparent_status: payload.grandparent_status || null,
    app_version: payload.app_version || 'unknown',
    platform: payload.platform || 'unknown',
  });

  if (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
