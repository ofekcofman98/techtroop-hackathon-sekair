import { observable, action, computed, makeObservable } from 'mobx';

const mockData = [
    { id: '1', title: 'Favorite Tech Stack for Hackathon', category: 'Studies', is_anonymous: false },
    { id: '2', title: 'Where should we order food tonight?', category: 'Social', is_anonymous: true },
    { id: '3', title: 'Who is the funniest lecturer?', category: 'Humor', is_anonymous: false },
    { id: '4', title: 'Advanced React Architecture Quiz', category: 'Studies', is_anonymous: false }
];

export class DashboardStore {
    constructor() {
        this.surveys = mockData;   
        this.searchQuery = '';
        this.selectedCategory = 'all'

        makeObservable(this, {
            surveys: observable,
            searchQuery: observable,
            selectedCategory: observable,
            setSearchQuery: action,
            setSelectedCategory: action,
            filteredSurveys: computed 
        });
    }

        setSearchQuery(query) {
            this.searchQuery = query;
        }

        setSelectedCategory(category) {
            this.selectedCategory = category;
        }

        get filteredSurveys() {
            return this.surveys.filter(survey => {
            const matchesCategory = this.selectedCategory === 'all' || survey.category === this.selectedCategory;
            const matchesSearch = survey.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
            });
        }
}
        
export const dashboardStore = new DashboardStore();