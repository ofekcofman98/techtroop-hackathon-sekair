import { observable, action, makeObservable, runInAction } from 'mobx';
import { supabase } from '../services/supabaseClient';
import { userStore } from './userStore';

export class VoteSurveyStore {
  currentSurvey = null;
  selectedOptions = {};
  isLoading = false;
  isSubmitting = false;
  isAnswered = false;
  answeredSurveys = [];
  currentResults = null;

  constructor() {
    makeObservable(this, {
      currentSurvey: observable,
      selectedOptions: observable,
      isLoading: observable,
      isSubmitting: observable,
      isAnswered: observable,
      answeredSurveys: observable,
      currentResults: observable,
      loadResults: action,
      loadSurvey: action,
      selectOption: action,
      submitVote: action,
      resetAnsweredSurveys: action
    });
  }

  async checkIfUserAnswered(surveyId) {
    let userIdVal = null;
    if (userStore.profile) {
      userIdVal = userStore.profile.id;
    }

    if (!userIdVal) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('responses')
        .select('id')
        .eq('survey_id', surveyId)
        .eq('user_id', userIdVal);

      if (error) throw error;

      const hasVoted = data && data.length > 0;
      if (hasVoted) {
        runInAction(() => {
          if (!this.answeredSurveys.includes(surveyId)) {
            this.answeredSurveys.push(surveyId);
          }
        });
      }

      return hasVoted;

    } catch (err) {
      console.error('Error checking user response:', err.message);
      return false;
    }
  }


  async loadSurvey(surveyId) {
    this.isLoading = true;
    this.isAnswered = false;

    try {
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
          profiles (
            name
          )
        `)
        .eq('id', surveyId)
        .single();

      if (error) throw error;

      const isVoted = await this.checkIfUserAnswered(surveyId);

      runInAction(() => {
        this.currentSurvey = {
          id: data.id,
          title: data.title,
          is_anonymous: data.is_anonymous,
          category: data.category,
          questions: data.questions || [],
          profiles: data.profiles
        };

        if (isVoted || this.answeredSurveys.indexOf(surveyId) !== -1) {
          this.isAnswered = true;
        } else {
          this.isAnswered = false;
        }
      });

    } catch (err) {
      console.error('Error fetching survey from Supabase:', err.message);
      runInAction(() => {
        this.currentSurvey = null;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadResults(surveyId) {
    this.isLoading = true;
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('question_id, chosen_option_index')
        .eq('survey_id', surveyId);

      if (error) throw error;
      const processedResults = {};

      data.forEach(row => {
        const questId = row.question_id;
        const question = this.currentSurvey?.questions.find(q => q.id === questId);
        const optionAns = question && question.options ? question.options[row.chosen_option_index] : null;
        if (optionAns) {
          if (!processedResults[questId]) {
            processedResults[questId] = {};
          }

          if (!processedResults[questId][optionAns]) {
            processedResults[questId][optionAns] = 0;
          }

          processedResults[questId][optionAns] += 1;
        }
      });

      runInAction(() => {
        this.currentResults = processedResults;
      });

    } catch (err) {
      console.error(' Error loading live results from Supabase:', err.message);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  resetAnsweredSurveys() {
    runInAction(() => {
      this.answeredSurveys = [];
      this.isAnswered = false;
    });
  }

  selectOption(questionId, optionText) {
    this.selectedOptions[questionId] = optionText;
  }

  async submitVote() {
    this.isSubmitting = true;
    const rowsToInsert = [];

    for (const questionId in this.selectedOptions) {
      const optionText = this.selectedOptions[questionId];
      const question = this.currentSurvey.questions.find(q => q.id === questionId);
      const optionIndex = question ? question.options.indexOf(optionText) : -1;
      let userIdVal = null;
      if (userStore.profile) {
        userIdVal = userStore.profile.id;
      }

      rowsToInsert.push({
        survey_id: this.currentSurvey.id,
        question_id: questionId,
        chosen_option_index: optionIndex,
        user_id: userIdVal
      });
    }

    console.log('Sending vote payload to DB:', rowsToInsert);

    try {
      const { error } = await supabase
        .from('responses')
        .insert(rowsToInsert);
      if (error) throw error;

      runInAction(() => {
        this.isSubmitting = false;
        this.selectedOptions = {};
        this.answeredSurveys.push(this.currentSurvey.id);
        this.isAnswered = true;
      });
      return true;

    } catch (err) {
      console.error('Error submitting vote:', err.message);
      runInAction(() => {
        this.isSubmitting = false;
      });
      return false;
    }
  }
}

export const voteSurveyStore = new VoteSurveyStore();