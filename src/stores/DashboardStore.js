import { observable, action, computed, makeObservable, runInAction } from 'mobx';
import { supabase } from '../services/supabaseClient';

const mockData = [
    { id: '1', title: 'Favorite Tech Stack for Hackathon', category: 'Studies', is_anonymous: false },
    { id: '2', title: 'Where should we order food tonight?', category: 'Social', is_anonymous: true },
    { id: '3', title: 'Who is the funniest lecturer?', category: 'Humor', is_anonymous: false },
    { id: '4', title: 'Advanced React Architecture Quiz', category: 'Studies', is_anonymous: false }
];

export class DashboardStore {
    constructor() {
        this.surveys = [];   
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.isLoading = false;
        this.error = null;

        makeObservable(this, {
            surveys: observable,
            searchQuery: observable,
            selectedCategory: observable,
            isLoading: observable,
            error: observable,    
            setSearchQuery: action,
            setSelectedCategory: action,
            fetchSurveys: action,
            filteredSurveys: computed 
        });
    }

        async fetchSurveys() {
            this.isLoading = true;
            this.error = null;

            try {
                const { data, error } = await supabase
                    .from('surveys')
                    .select('*');

                if (error) throw error;

                runInAction(() => {
                    this.surveys = data || [];
                });
            } 
            catch (err) {
                console.error("Error fetching surveys:", err.message);
                runInAction(() => {
                    this.error = err.message;
                });
            } 
            finally {
                runInAction(() => {
                    this.isLoading = false;
                });
            }
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
            
            const title = survey.title || ''; 
            const matchesSearch = title.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });
    }
}
        
export const dashboardStore = new DashboardStore();