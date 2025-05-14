// src/utils/cache.ts
interface Course {
  id: number;
  name: string;
  price: number;
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

interface CacheData {
  courses: Course[];
  divisions: { [courseId: number]: Division[] };
  contents: { [divisionId: number]: Content[] };
  isCachePopulated: boolean;
  fetchPromise: Promise<void> | null;
}

const cache = new Map<string, CacheData>();

export const initializeCache = (teacherId: string) => {
  if (!cache.has(teacherId)) {
    cache.set(teacherId, {
      courses: [],
      divisions: {},
      contents: {},
      isCachePopulated: false,
      fetchPromise: null,
    });
  }
};

export const getCache = (teacherId: string): CacheData | undefined => {
  return cache.get(teacherId);
};

export const setFetchPromise = (teacherId: string, promise: Promise<void>) => {
  const currentCache = cache.get(teacherId);
  if (currentCache) {
    cache.set(teacherId, { ...currentCache, fetchPromise: promise });
  }
};

export const updateCoursesCache = (teacherId: string, courses: Course[]) => {
  const currentCache = cache.get(teacherId) || {
    courses: [],
    divisions: {},
    contents: {},
    isCachePopulated: false,
    fetchPromise: null,
  };
  cache.set(teacherId, {
    ...currentCache,
    courses,
    isCachePopulated: true,
  });
};

export const updateDivisionsCache = (
  teacherId: string,
  courseId: number,
  divisions: Division[]
) => {
  const currentCache = cache.get(teacherId) || {
    courses: [],
    divisions: {},
    contents: {},
    isCachePopulated: false,
    fetchPromise: null,
  };
  cache.set(teacherId, {
    ...currentCache,
    divisions: {
      ...currentCache.divisions,
      [courseId]: divisions,
    },
    isCachePopulated: true,
  });
};

export const updateContentsCache = (
  teacherId: string,
  divisionId: number,
  contents: Content[]
) => {
  const currentCache = cache.get(teacherId) || {
    courses: [],
    divisions: {},
    contents: {},
    isCachePopulated: false,
    fetchPromise: null,
  };
  cache.set(teacherId, {
    ...currentCache,
    contents: {
      ...currentCache.contents,
      [divisionId]: contents,
    },
    isCachePopulated: true,
  });
};

export const invalidateCache = (teacherId: string) => {
  cache.delete(teacherId);
};

// Note: Add a cron job here to refresh cache every 10-15 minutes
// Example (pseudo-code):
// setInterval(() => {
//   cache.forEach((_, teacherId) => {
//     // Trigger background fetch for courses, divisions, contents
//   });
// }, 10 * 60 * 1000); // 10 minutes