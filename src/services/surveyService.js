import { supabase } from './supabaseClient';

export const surveyService = {

    async getAllSurveys() {
        const { data, error } = await supabase
        .from('surveys')
        .select(`
            *,
            profiles:created_by (
                name
            )
        `);
                
        if (error) throw error;
        return data || [];
    },

    async deleteSurvey(surveyId) {
        const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

        if (error) throw error;
        return true;
    },

    async createSurvey(surveyPayload, questionsPayloadBuilder) {
        const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .insert([surveyPayload])
        .select()
        .single();

        if (surveyError) throw surveyError;

        const questionsPayload = questionsPayloadBuilder(surveyData.id);

        const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsPayload);

        if (questionsError) throw questionsError;
        return true;
    },

    async checkIfUserAnswered(surveyId, userId) {
        if (!userId) return false;

        const { data, error } = await supabase
            .from('responses')
            .select('id')
            .eq('survey_id', surveyId)
            .eq('user_id', userId);

        if (error) throw error;
        return data && data.length > 0;
    },

    async getSurveyById(surveyId) {
        const { data, error } = await supabase
        .from('surveys')
        .select(`
            id,
            title,
            is_anonymous,
            category,
            questions (
            id,
            question_text,
            options
            ),
            profiles:created_by (
            name
            )
        `)
        .eq('id', surveyId)
        .single();

        if (error) throw error;
        return data;
    },

    async getSurveyResponses(surveyId) {
        const { data, error } = await supabase
            .from('responses')
            .select(`
                question_id, 
                chosen_option_index,
                user_id,
                profiles:user_id (
                    name
                )
            `)
            .eq('survey_id', surveyId);

        if (error) throw error;
        return data || [];
    },
    
    async submitResponses(rowsToInsert) {
        const { error } = await supabase
            .from('responses')
            .insert(rowsToInsert);

        if (error) throw error;
        return true;
    }
    
};