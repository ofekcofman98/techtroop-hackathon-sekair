import { supabase } from './supabaseClient';

export const userService = {
  async getAllUsers() {
    const {data, error} = await supabase
      .from('profiles')
      .select('*')

    if (error) throw error;
    return data;
  },

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
      .from('responses')
      .select('survey_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async getSocialMatches(currentUserId) {
    if (!currentUserId) return [];

    const { data: myResponses, error: myErr } = await supabase
      .from('responses')
      .select('question_id, chosen_option_index, surveys(is_anonymous)')
      .eq('user_id', currentUserId);

    if (myErr) throw myErr;

    const myPublicResponses = myResponses.filter(r => r.surveys && !r.surveys.is_anonymous);
    if (myPublicResponses.length === 0) return [];

    const questionIds = myPublicResponses.map(r => r.question_id);

    const { data: othersResponses, error: othersErr } = await supabase
      .from('responses')
      .select(`
        user_id,
        question_id,
        chosen_option_index,
        profiles:user_id (
          name,
          role
        )
      `)
      .in('question_id', questionIds)
      .neq('user_id', currentUserId);

    if (othersErr) throw othersErr;

    const userStats = {};

    othersResponses.forEach(resp => {
      const otherUserId = resp.user_id;
      const otherName = resp.profiles?.name || 'Student';
      const otherRole = resp.profiles?.role || 'user';

      if (!userStats[otherUserId]) {
        userStats[otherUserId] = {
          id: otherUserId,
          name: otherName,
          role: otherRole,
          sharedQuestions: 0,
          matchingAnswers: 0
        };
      }

      const myAns = myPublicResponses.find(r => r.question_id === resp.question_id);
      if (myAns) {
        userStats[otherUserId].sharedQuestions += 1;
        if (myAns.chosen_option_index === resp.chosen_option_index) {
          userStats[otherUserId].matchingAnswers += 1;
        }
      }
    });

    return Object.values(userStats)
      .map(user => {
        const percentage = user.sharedQuestions > 0 
          ? Math.round((user.matchingAnswers / user.sharedQuestions) * 100)
          : 0;
        return { ...user, percentage };
      })
      .filter(user => user.sharedQuestions > 0)
      .sort((a, b) => b.percentage - a.percentage);
  }


};