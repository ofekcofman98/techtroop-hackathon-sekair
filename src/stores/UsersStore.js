import { makeAutoObservable, runInAction } from "mobx";
import { userService } from "../services/userService";

class UsersStore {
  users = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUsers() {
    this.isLoading = true;
    this.error = null;
    try {
      const data = await userService.getAllUsers();
      runInAction(() => {
        this.users = data;
      });
    }
    catch (err) {
      runInAction(() => {
        this.error = err.message || "Failed to fetch users";
      });
    }
    finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const usersStore = new UsersStore();