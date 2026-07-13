import { supabase } from './supabaseClient';

export const userService = {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getSurveysCreatedByUser(userId) {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('created_by', userId);

    if (error) throw error;
    return data || [];
  },

  async getUserVotes(userId) {
    const { data, error } = await supabase
      .from('votes')
      .select('survey_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }
};