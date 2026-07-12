import { observable, action, makeObservable, runInAction } from 'mobx';
import { supabase } from '../services/supabaseClient';
import { surveyService } from '../services/surveyService';

export class NewSurveyStore {
  title = '';
  isAnonymous = false;
  category = 'General';
  questions = [
    { question_text: '', options: ['', '', '', ''] }
  ];
  isLoading = false;
  isSuccess = false;
  error = null;

  constructor() {
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
    this.questions = [...this.questions, { question_text: '', options: ['', '', '', ''] }];
  }

  removeQuestion = (index) => {
    if (this.questions.length > 1) {
      this.questions = this.questions.filter((_, i) => i !== index);
    }
  }

  updateQuestionText = (index, text) => {
    const updatedQuestions = [...this.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question_text: text
    };
    this.questions = updatedQuestions;
  }

  updateOptionText = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...this.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];

    updatedOptions[optionIndex] = text;

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };

    this.questions = updatedQuestions;
  }

  submitSurvey = async (userId) => {
    this.isLoading = true;
    this.error = null;

    const surveyPayload = { 
        title: this.title, 
        is_anonymous: this.isAnonymous,
        category: this.category || 'General',
        created_by: userId 
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