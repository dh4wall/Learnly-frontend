import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/auth';

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const signup = async (email: string, password: string) => {
  return api.post('/signup', { email, password });
};

export const verifyEmail = async () => {
  return api.post('/verify-email');
};

export const signin = async (email: string, password: string) => {
  return api.post('/signin', { email, password });
};

export const googleAuth = () => {
  window.location.href = `${BACKEND_URL}/google`;
};

export const saveOnboarding = async (data: {
  education_level: string;
  username: string;
  interests: string[];
}) => {
  return api.post('/onboarding', data);
};

export const logout = async () => {
  return api.post('/logout');
};

export const verifyToken = async () => {
  return api.get('/verify');
};

export default api;