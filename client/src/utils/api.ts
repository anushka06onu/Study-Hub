import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:5000/api', withCredentials: true });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (payload: { email: string; password: string }) => client.post('/auth/login', payload),
  register: (payload: { email: string; password: string; name: string }) => client.post('/auth/register', payload)
};

export const subjects = {
  list: () => client.get('/subjects'),
  create: (data: any) => client.post('/subjects', data),
  update: (id: string, data: any) => client.put(`/subjects/${id}`, data),
  remove: (id: string) => client.delete(`/subjects/${id}`)
};

// Task routes are flat (/tasks) on the API, not nested under subjects
export const tasks = {
  list: () => client.get('/tasks'),
  create: (data: any) => client.post('/tasks', data),
  update: (id: string, data: any) => client.put(`/tasks/${id}`, data),
  complete: (id: string) => client.post(`/tasks/${id}/complete`),
  remove: (id: string) => client.delete(`/tasks/${id}`)
};

export const sessions = {
  list: () => client.get('/sessions'),
  create: (data: any) => client.post('/sessions', data),
  start: (subjectId: string) => client.post('/sessions/start', { subjectId }),
  pause: (sessionId: string, duration: number) => client.post('/sessions/pause', { sessionId, duration }),
  end: (sessionId: string, duration: number) => client.post('/sessions/end', { sessionId, duration })
};

export const ai = { suggest: (payload: { subject?: string; task?: string }) => client.post('/ai/suggest', payload) };

export const projects = {
  list: () => client.get('/projects'),
  create: (data: any) => client.post('/projects', data),
  update: (id: string, data: any) => client.put(`/projects/${id}`, data),
  remove: (id: string) => client.delete(`/projects/${id}`)
};
