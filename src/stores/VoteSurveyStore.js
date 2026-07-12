import { observable, action, makeObservable } from 'mobx';

export class VoteSurveyStore {
  constructor() {
    this.currentSurvey = null;
    this.selectedOptions = {};
    this.isLoading = false;
    this.isSubmitting = false;
    this.isAnswered = false;
    this.answeredSurveys = [];

    makeObservable(this, {
      currentSurvey: observable,
      selectedOptions: observable,
      isLoading: observable,
      isSubmitting: observable,
      isAnswered: observable,
      answeredSurveys: observable,
      loadSurvey: action,
      selectOption: action,
      submitVote: action
    });
  }

  loadSurvey(surveyId) {
    this.isLoading = true;
    this.isAnswered = false;

    // Mock - מדמה שליפת סקר ספציפי מה-DB
    setTimeout(() => {
      this.currentSurvey = {
        id: surveyId,
        title: 'Favorite Tech Stack for Hackathon',
        is_anonymous: false,
        questions: [
          {
            id: 'q1',
            question_text: 'Which frontend library are you using?',
            options: ['React', 'Vue', 'Angular', 'Svelte']
          },
          {
            id: 'q2',
            question_text: 'Which state management fits best?',
            options: ['MobX', 'Redux', 'Context API', 'Zustand']
          }
        ]
      };
      if (this.answeredSurveys.indexOf(surveyId) !== -1){
        this.isAnswered = true;
      } else{
        this.isAnswered = false;
      }

      this.isLoading = false;
    }, 500);
  }


  selectOption(questionId, optionText) {
    this.selectedOptions[questionId] = optionText;
  }

  async submitVote() {
    this.isSubmitting = true;

    const votePayload = {
      survey_id: this.currentSurvey.id,
      answers: this.selectedOptions
    };

    console.log('Sending vote payload to DB:', votePayload);

    // Demo: submission to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.isSubmitting = false;
    this.selectedOptions = {};
    this.answeredSurveys.push(this.currentSurvey.id);
    this.isAnswered = true;
    return true;
  }
}

export const voteSurveyStore = new VoteSurveyStore();