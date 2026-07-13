import { makeAutoObservable, runInAction } from 'mobx';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

class UserStore {
  user = null;
  profile = null;
  answeredSurveysCount = 0;
  isLoading = true;
  isProfileLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        await this.fetchUserProfile(currentUser);
      }
    } 
    catch (error) {
      console.error("Auth initialization failed:", error.message);
    } 
    finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchUserProfile(authUser) {
    try {
      const data = await userService.getUserProfile(authUser.id);

      runInAction(() => {
        this.user = authUser;
        this.profile = data;
      });
    } 
    catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  }

  async fetchProfileDashboardData() {
    if (!this.user) return;    
    this.isProfileLoading = true;
    
    try {
      const [createdSurveysData, votesData] = await Promise.all([
        userService.getSurveysCreatedByUser(this.user.id),
        userService.getUserVotes(this.user.id)
      ]);

      runInAction(() => {
        this.createdSurveys = createdSurveysData;
        
        const uniqueSurveyIds = new Set(votesData.map(v => v.survey_id));
        this.answeredSurveysCount = uniqueSurveyIds.size;
      });
    } 
    catch (error) {
      console.error("Failed to fetch profile dashboard data:", error.message);
    } 
    finally {
      runInAction(() => {
        this.isProfileLoading = false;
      });
    }
  }

  async login(email, password) {
    runInAction(() => { this.isLoading = true; });
    try {
      const data = await authService.signIn(email, password);
      if (data?.user) {
        await this.fetchUserProfile(data.user);
      }
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  }


  async register(email, password, fullName) {
    runInAction(() => { this.isLoading = true; });
    try {
      const data = await authService.signUp(email, password, fullName);
      if (data?.user) {
        await authService.signIn(email, password);
        await this.fetchUserProfile(data.user);
      }
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  }


  async logout() {
    try {
      await authService.signOut();
      runInAction(() => {
        this.user = null;
        this.profile = null;
      });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  }

  get isAdmin() {
    return this.profile?.role === 'admin';
  }

  get isAuthenticated() {
    return !!this.user;
  }
}

export const userStore = new UserStore();
