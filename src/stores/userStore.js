import { makeAutoObservable, runInAction } from 'mobx';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

class UserStore {
  user = null;
  profile = null;
  isLoading = true;

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
    } catch (error) {
      console.error("Auth initialization failed:", error.message);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchUserProfile(authUser) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      runInAction(() => {
        this.user = authUser;
        this.profile = data;
      });
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
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
