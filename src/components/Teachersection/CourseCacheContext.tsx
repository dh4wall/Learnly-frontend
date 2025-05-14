import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchTeacherCourses, fetchDivisions, fetchContents } from '../../utils/api';

interface Course {
  id: number;
  name: string;
  thumbnailUrl?: string;
}

interface Division {
  id: number;
  title: string;
  order: number;
}

interface Content {
  id: number;
  title: string;
  type: 'VIDEO' | 'PDF';
  category: 'LECTURES' | 'NOTES' | 'RESOURCES';
  fileUrl: string;
  duration?: number;
}

interface CourseCache {
  courses: Map<number, Course>;
  divisions: Map<number, Division[]>;
  contents: Map<number, Content[]>;
}

interface CourseCacheContextType {
  cache: CourseCache;
  fetchCourses: () => Promise<Course[]>;
  fetchDivisions: (courseId: number) => Promise<Division[]>;
  fetchContents: (divisionId: number) => Promise<Content[]>;
  invalidateCache: (type: 'courses' | 'divisions' | 'contents', id?: number) => void;
  updateCourse: (course: Course) => void;
}

const CourseCacheContext = createContext<CourseCacheContextType | undefined>(undefined);

export const CourseCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<CourseCache>({
    courses: new Map(),
    divisions: new Map(),
    contents: new Map(),
  });

  const fetchCourses = useCallback(async () => {
    if (cache.courses.size > 0) {
      return Array.from(cache.courses.values());
    }
    try {
      const data = await fetchTeacherCourses();
      console.log('Fetched courses:', data);
      const newCourses = new Map<number, Course>();
      data.forEach((course: Course) => newCourses.set(course.id, course));
      setCache((prev) => ({ ...prev, courses: newCourses }));
      return data;
    } catch (error) {
      console.error('fetchCourses error:', error);
      throw error;
    }
  }, [cache.courses]);

  const fetchDivisions = useCallback(
    async (courseId: number) => {
      if (cache.divisions.has(courseId)) {
        return cache.divisions.get(courseId)!;
      }
      try {
        const data:any = await fetchDivisions(courseId);
        console.log('Fetched divisions:', data);
        setCache((prev) => ({
          ...prev,
          divisions: new Map(prev.divisions).set(courseId, data),
        }));
        return data;
      } catch (error) {
        console.error('fetchDivisions error:', error);
        throw error;
      }
    },
    [cache.divisions]
  );

  const fetchContents = useCallback(
    async (divisionId: number) => {
      if (cache.contents.has(divisionId)) {
        return cache.contents.get(divisionId)!;
      }
      try {
        const data:any = await fetchContents(divisionId);
        console.log('Fetched contents:', data);
        setCache((prev) => ({
          ...prev,
          contents: new Map(prev.contents).set(divisionId, data),
        }));
        return data;
      } catch (error) {
        console.error('fetchContents error:', error);
        throw error;
      }
    },
    [cache.contents]
  );

  const invalidateCache = useCallback((type: 'courses' | 'divisions' | 'contents', id?: number) => {
    setCache((prev) => {
      const newCache = { ...prev };
      if (type === 'courses') {
        newCache.courses = new Map();
        newCache.divisions = new Map();
        newCache.contents = new Map();
      } else if (type === 'divisions' && id !== undefined) {
        newCache.divisions = new Map(prev.divisions);
        newCache.divisions.delete(id);
        newCache.contents = new Map();
      } else if (type === 'contents' && id !== undefined) {
        newCache.contents = new Map(prev.contents);
        newCache.contents.delete(id);
      }
      return newCache;
    });
  }, []);

  const updateCourse = useCallback((course: Course) => {
    setCache((prev) => ({
      ...prev,
      courses: new Map(prev.courses).set(course.id, course),
    }));
  }, []);

  return (
    <CourseCacheContext.Provider
      value={{ cache, fetchCourses, fetchDivisions, fetchContents, invalidateCache, updateCourse }}
    >
      {children}
    </CourseCacheContext.Provider>
  );
};

export const useCourseCache = () => {
  const context = useContext(CourseCacheContext);
  if (!context) {
    throw new Error('useCourseCache must be used within a CourseCacheProvider');
  }
  return context;
};