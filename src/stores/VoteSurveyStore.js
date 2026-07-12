import { observable, action, makeObservable, runInAction } from 'mobx';
import { supabase } from '../services/supabaseClient';

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
      submitVote: action
    });
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
          )
        `)
        .eq('id', surveyId)
        .single();

      if (error) throw error;

      runInAction(() => {
        this.currentSurvey = {
          id: data.id,
          title: data.title,
          is_anonymous: data.is_anonymous,
          category: data.category,
          questions: data.questions || []
        };

        if (this.answeredSurveys.indexOf(surveyId) !== -1) {
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

  loadResults(surveyId) {
    const mockResultsDb = {
      'q1': {
        'React': 15,
        'Vue': 5,
        'Angular': 2,
        'Svelte': 1
      },
      'q2': {
        'MobX': 12,
        'Redux': 4,
        'Context API': 6,
        'Zustand': 3
      }
    };
    this.currentResults = mockResultsDb;
  }

  selectOption(questionId, optionText) {
    this.selectedOptions[questionId] = optionText;
  }

  async submitVote() {
    this.isSubmitting = true;

    const votePayload = {
      survey_id: this.currentSurvey.id,
      answers: { ...this.selectedOptions }
    };

    console.log('Sending vote payload to DB:', votePayload);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

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