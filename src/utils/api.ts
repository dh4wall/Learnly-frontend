import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  initializeCache,
  updateCoursesCache,
  updateDivisionsCache,
  updateContentsCache,
  setFetchPromise,
} from './cache';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const AUTH_URL = `${BACKEND_URL}/auth`;
const TEACHER_AUTH_URL = `${BACKEND_URL}/teacher`;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

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
    const teacherId = response.data.email || email;
    localStorage.setItem('teacherEmail', teacherId);
    initializeCache(teacherId);
    const fetchPromise = fetchTeacherDataInBackground(teacherId);
    setFetchPromise(teacherId, fetchPromise);
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
    const teacherId = response.data.email || localStorage.getItem('teacherEmail') || 'teacher';
    localStorage.setItem('teacherEmail', teacherId);
    initializeCache(teacherId);
    const fetchPromise = fetchTeacherDataInBackground(teacherId);
    setFetchPromise(teacherId, fetchPromise);
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
    localStorage.removeItem('teacherEmail');
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

export const createCourse = async (formData: FormData, onProgress?: (progress: number) => void) => {
  try {
    // Log FormData contents for debugging
    const formDataEntries = Object.fromEntries(formData);
    console.log('createCourse FormData:', formDataEntries);
    const response = await api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
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

export const createContentBatch = async (data: FormData, onProgress?: (progress: number) => void) => {
  try {
    const response = await api.post('/content/batch', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
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

export const fetchDivisions = async (courseId: number) => {
  try {
    const response = await api.get(`/divisions?courseId=${courseId}`);
    console.log('fetchDivisions response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchDivisions error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const fetchContents = async (divisionId: number) => {
  try {
    const response = await api.get(`/content?divisionId=${divisionId}`);
    console.log('fetchContents response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchContents error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export const fetchTeacherDataInBackground = async (teacherId: string) => {
  try {
    const courses = await fetchTeacherCourses();
    updateCoursesCache(teacherId, courses);

    for (const course of courses) {
      const divisions = await fetchDivisions(course.id);
      updateDivisionsCache(teacherId, course.id, divisions);

      for (const division of divisions) {
        const contents = await fetchContents(division.id);
        updateContentsCache(teacherId, division.id, contents);
      }
    }
    console.log('Background fetch completed for teacher:', teacherId);
  } catch (error: any) {
    console.error('Background fetch error:', {
      message: error.message,
      response: error.response?.data,
    });
    throw error;
  }
};

export default api;