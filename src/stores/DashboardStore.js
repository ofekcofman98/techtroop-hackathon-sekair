import { observable, action, computed, makeObservable, runInAction } from 'mobx';
import { surveyService } from '../services/surveyService';

export class DashboardStore {
    surveys = [];
    searchQuery = '';
    selectedCategory = 'all';
    visibilityFilter = 'all';
    isLoading = false;

    constructor() {
        makeObservable(this, {
            surveys: observable,
            searchQuery: observable,
            selectedCategory: observable,
            visibilityFilter: observable,
            isLoading: observable,
            setSearchQuery: action,
            setSelectedCategory: action,
            setVisibilityFilter: action,
            fetchSurveys: action,
            deleteSurvey: action,
            filteredSurveys: computed
        });
    }

    setSearchQuery(query) {
        this.searchQuery = query;
    }

    setSelectedCategory(category) {
        this.selectedCategory = category;
    }

    setVisibilityFilter(filter) {
        this.visibilityFilter = filter;
    }

    async fetchSurveys() {
        this.isLoading = true;
        try {
            const data = await surveyService.getAllSurveys();
            runInAction(() => {
                this.surveys = data;
            });
        } 
        catch (err) {
            console.error('Error fetching surveys:', err.message);
        } 
        finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    get filteredSurveys() {
        return this.surveys.filter(survey => {
            // 1. Category Filter
            const currentSelected = this.selectedCategory.toLowerCase();
            const surveyCategory = survey.category?.toLowerCase() || '';
            const matchesCategory = currentSelected === 'all' || surveyCategory === currentSelected;
            
            // 2. Anonymity / Visibility Filter
            let matchesVisibility = true;
            if (this.visibilityFilter === 'public') {
                matchesVisibility = survey.is_anonymous === false;
            } else if (this.visibilityFilter === 'anonymous') {
                matchesVisibility = survey.is_anonymous === true;
            }

            // 3. Text Search Filter
            const search = this.searchQuery.toLowerCase().trim();
            if (!search) return matchesCategory && matchesVisibility;

            const matchesTitle = survey.title?.toLowerCase().includes(search) || false;
            const matchesQuestions = survey.questions?.some(q => 
                q.question_text?.toLowerCase().includes(search)
            ) || false;
            
            // 4. Creator Filter
            const matchesCreator = survey.profiles?.name?.toLowerCase().includes(search) || false;

            return matchesCategory && matchesVisibility && (matchesTitle || matchesQuestions || matchesCreator);
        });
    }

    async deleteSurvey(surveyId) {
        try {
            await surveyService.deleteSurvey(surveyId);
                runInAction(() => {
                    this.surveys = this.surveys.filter(survey => survey.id !== surveyId);
                });        
        } 
        catch (err) {
            console.error('Error deleting survey:', err.message);
            alert('Failed to delete survey');
        }
    }
}

export const dashboardStore = new DashboardStore();