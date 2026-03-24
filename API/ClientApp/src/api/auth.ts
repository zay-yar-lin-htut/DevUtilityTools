import api from './index';

export const authApi = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  logout: (token: string) => api.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken })
};
