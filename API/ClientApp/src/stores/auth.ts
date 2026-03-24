import { defineStore } from 'pinia';
import { authApi } from '../api/auth';
import router from '../router';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken
  },

  actions: {
    init() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        this.accessToken = storedToken;
        this.refreshToken = storedRefreshToken;
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    },

    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.register(username, email, password);
        const { accessToken, refreshToken, user } = response.data;
        
        this.setTokens(accessToken, refreshToken);
        this.setUser({
          id: user.id,
          username: user.username,
          email: user.email
        });
        this.isAuthenticated = true;
        
        return { success: true };
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.login(username, password);
        const { accessToken, refreshToken, user } = response.data;
        
        this.setTokens(accessToken, refreshToken);
        this.setUser({
          id: user.id,
          username: user.username,
          email: user.email
        });
        this.isAuthenticated = true;
        
        return { success: true };
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Login failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        if (this.accessToken) {
          await authApi.logout(this.accessToken);
        }
      } catch (err) {
        console.error('Logout error:', err);
      }
      
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      router.push('/login');
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        return false;
      }

      try {
        const response = await authApi.refresh(this.refreshToken);
        const { accessToken, refreshToken } = response.data;
        
        this.setTokens(accessToken, refreshToken);
        return true;
      } catch (err) {
        await this.logout();
        return false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
