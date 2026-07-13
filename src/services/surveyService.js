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
    }
};