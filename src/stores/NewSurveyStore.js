import { observable, action, makeObservable, runInAction } from 'mobx';
import { supabase } from '../services/supabaseClient';
import { surveyService } from '../services/surveyService';

export class NewSurveyStore {
  constructor() {
    this.title = '';
    this.isAnonymous = false;
    this.questions = [{ 
        question_text: '', 
        options: ['', '', '', ''] 
    }];
    this.isLoading = false;
    this.error = null;
    this.isSuccess = false;

    makeObservable(this, {
      title: observable,
      isAnonymous: observable,
      questions: observable,
      isLoading: observable,
      error: observable,
      isSuccess: observable,
      setTitle: action,
      setIsAnonymous: action,
      addQuestion: action,
      removeQuestion: action,
      updateQuestionText: action,
      updateOptionText: action,
      submitSurvey: action,
      resetForm: action
    });
  }
  
  setTitle = (title) => {
      this.title = title;
  }
  
  setIsAnonymous = (value) => {
    this.isAnonymous = value;
  }

  addQuestion = () => {
    this.questions.push({ question_text: '', options: ['', '', '', ''] });
  }

  removeQuestion = (index) => {
    if (this.questions.length > 1) {
      this.questions.splice(index, 1);
    }
  }

  updateQuestionText = (index, text) => {
    this.questions[index].question_text = text;
  }

  updateOptionText = (questionIndex, optionIndex, text) => {
    this.questions[questionIndex].options[optionIndex] = text;
  }


  submitSurvey = async () => {
    this.isLoading = true;
    this.error = null;

    const surveyPayload = { 
        title: this.title, 
        is_anonymous: this.isAnonymous,
        category: this.category || 'General'
    };

    const questionsPayloadBuilder = (surveyId) => this.questions.map((q) => ({
        survey_id: surveyId,
        question_text: q.question_text,
        options: q.options
    }));

    try {
        await surveyService.createSurvey(surveyPayload, questionsPayloadBuilder);

        runInAction(() => {
            this.isSuccess = true;
        });
        return true;
    } 
    catch (err) {
      console.error('🚨 Error creating survey:', err.message);
      runInAction(() => {
          this.error = err.message || 'Failed to create survey. Please try again.';
      });
      return false;
    } 
    finally {
      runInAction(() => {
          this.isLoading = false;
      });
    }
}

  resetForm = () => {
    this.title = '';
    this.isAnonymous = false;
    this.questions = [{ question_text: '', options: ['', '', '', ''] }];
    this.isSuccess = false;
  }
}

export const newSurveyStore = new NewSurveyStore();