import api from './index';

export const savedResultsApi = {
  getAll: () => api.get('/saved'),
  getById: (id: number) => api.get(`/saved/${id}`),
  create: (data: { toolType: number; input: string; output: string }) => 
    api.post('/saved', data),
  update: (id: number, data: { toolType: number; input: string; output: string }) => 
    api.put(`/saved/${id}`, data),
  delete: (id: number) => api.delete(`/saved/${id}`)
};
