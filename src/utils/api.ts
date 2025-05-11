import axios from 'axios';
import { toast } from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const AUTH_URL = `${BACKEND_URL}/auth`;
const TEACHER_AUTH_URL = `${BACKEND_URL}/teacher`;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    console.error('API error:', {
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Existing Auth Functions
export const signup = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', { email, password });
    console.log('signup response:', response.data);
    return response;
  } catch (error: any) {
    console.error('signup error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const verifyEmail = async () => {
  try {
    const response = await api.post('/auth/verify-email');
    console.log('verifyEmail response:', response.data);
    return response;
  } catch (error: any) {
    console.error('verifyEmail error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/signin', { email, password });
    console.log('signin response:', response.data);
    return response;
  } catch (error: any) {
    console.error('signin error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const googleAuth = () => {
  window.location.href = `${AUTH_URL}/google`;
};

export const saveOnboarding = async (data: {
  education_level: string;
  username: string;
  interests: string[];
}) => {
  try {
    const response = await api.post('/auth/onboarding', data);
    console.log('saveOnboarding response:', response.data);
    return response;
  } catch (error: any) {
    console.error('saveOnboarding error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    console.log('logout response:', response.data);
    return response;
  } catch (error: any) {
    console.error('logout error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    console.log('verifyToken response:', response.data);
    return response;
  } catch (error: any) {
    console.error('verifyToken error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

// Teacher Auth Functions
export const teacherSignup = async (email: string, password: string, name: string) => {
  try {
    const response = await api.post('/teacher/signup', { email, password, name });
    console.log('teacherSignup response:', response.data);
    return response;
  } catch (error: any) {
    console.error('teacherSignup error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const teacherVerifyEmail = async () => {
  try {
    const response = await api.post('/teacher/verify-email');
    console.log('teacherVerifyEmail response:', response.data);
    return response;
  } catch (error: any) {
    console.error('teacherVerifyEmail error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const teacherSignin = async (email: string, password: string) => {
  try {
    const response = await api.post('/teacher/signin', { email, password });
    console.log('teacherSignin response:', response.data);
    return response;
  } catch (error: any) {
    console.error('teacherSignin error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const teacherGoogleAuth = () => {
  window.location.href = `${TEACHER_AUTH_URL}/google`;
};

export const teacherSaveOnboarding = async (data: {
  username: string;
  teachingExperience: string;
  fieldOfStudy: string;
}) => {
  try {
    const response = await api.post('/teacher/onboarding', data);
    console.log('teacherSaveOnboarding response:', response.data);
    return response;
  } catch (error: any) {
    console.error('teacherSaveOnboarding error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const teacherLogout = async () => {
  try {
    const response = await api.post('/teacher/logout');
    console.log('teacherLogout response:', response.data);
    return response;
  } catch (error: any) {
    console.error('teacherLogout error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const verifyTeacherToken = async () => {
  try {
    const response = await api.get('/teacher/verify');
    console.log('verifyTeacherToken response:', response.data);
    return response;
  } catch (error: any) {
    console.error('verifyTeacherToken error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

// Course Management Functions
export const fetchTeacherCourses = async () => {
  try {
    const response = await api.get('/courses');
    console.log('fetchTeacherCourses response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchTeacherCourses error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const createCourse = async (data: FormData) => {
  try {
    const response = await api.post('/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('createCourse response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('createCourse error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const createDivision = async (courseId: number, title: string, order: number) => {
  try {
    const response = await api.post('/divisions', { courseId, title, order });
    console.log('createDivision response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('createDivision error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const createContentBatch = async (data: FormData) => {
  try {
    const response = await api.post('/content/batch', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('createContentBatch response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('createContentBatch error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export default api;