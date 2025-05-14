import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams, Routes, Route, Link } from 'react-router-dom';
import { verifyTeacherToken, fetchTeacherDataInBackground } from '../../utils/api';
import { getCache, initializeCache, setFetchPromise } from '../../utils/cache';
import Loading from '../custom/Loading';
import Navbar from '../Reusables/TeacherNavbar';
import Sidebar from '../Reusables/TeacherSidebar';

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

const CoursesList: React.FC<{ teacherId: string }> = ({ teacherId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Initialize cache
        initializeCache(teacherId);
        let cache = getCache(teacherId);
        if (!cache) {
          console.error('Cache initialization failed for teacher:', teacherId);
          throw new Error('Cache initialization failed');
        }

        if (cache.isCachePopulated) {
          console.log('Using cached courses:', cache.courses);
          setCourses(cache.courses);
        } else {
          if (!cache.fetchPromise) {
            console.log('Starting background fetch for teacher:', teacherId);
            const fetchPromise = fetchTeacherDataInBackground(teacherId);
            setFetchPromise(teacherId, fetchPromise);
            cache = getCache(teacherId)!;
          }
          console.log('Waiting for background fetch in CoursesList...');
          await cache.fetchPromise;
          const updatedCache = getCache(teacherId);
          if (updatedCache) {
            console.log('Cache populated:', updatedCache.courses);
            setCourses(updatedCache.courses);
          } else {
            throw new Error('Cache missing after fetch');
          }
        }
      } catch (error: any) {
        console.error('CoursesList error:', error);
        toast.error('Failed to load courses');
        navigate('/teacher/dashboard');
      }
    };
    loadCourses();
  }, [teacherId, navigate]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length === 0 ? (
        <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
          No courses found. Create one now!
        </p>
      ) : (
        courses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`} className="block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
            >
              <img
                src={course.thumbnailUrl || 'https://via.placeholder.com/300x150?text=No+Thumbnail'}
                alt={course.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white truncate">
                {course.name}
              </h3>
            </motion.div>
          </Link>
        ))
      )}
    </div>
  );
};

const CourseDetail: React.FC<{ teacherId: string }> = ({ teacherId }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [courseName, setCourseName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        if (!courseId) {
          throw new Error('Invalid course ID');
        }
        // Initialize cache
        initializeCache(teacherId);
        let cache = getCache(teacherId);
        if (!cache) {
          console.error('Cache initialization failed for teacher:', teacherId);
          throw new Error('Cache initialization failed');
        }

        if (cache.isCachePopulated) {
          const course = cache.courses.find((c) => c.id === parseInt(courseId));
          setCourseName(course?.name || 'Course');
          setDivisions(cache.divisions[parseInt(courseId)] || []);
        } else {
          if (!cache.fetchPromise) {
            console.log('Starting background fetch for teacher:', teacherId);
            const fetchPromise = fetchTeacherDataInBackground(teacherId);
            setFetchPromise(teacherId, fetchPromise);
            cache = getCache(teacherId)!;
          }
          console.log('Waiting for background fetch in CourseDetail...');
          await cache.fetchPromise;
          const updatedCache = getCache(teacherId);
          if (updatedCache) {
            const course = updatedCache.courses.find((c) => c.id === parseInt(courseId));
            setCourseName(course?.name || 'Course');
            setDivisions(updatedCache.divisions[parseInt(courseId)] || []);
          } else {
            throw new Error('Cache missing after fetch');
          }
        }
      } catch (error: any) {
        console.error('CourseDetail error:', error);
        toast.error('Failed to load chapters');
        navigate('/courses');
      }
    };
    loadDivisions();
  }, [courseId, navigate, teacherId]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="mr-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {courseName} - Chapters
        </h2>
      </div>
      {divisions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No chapters found for this course.</p>
      ) : (
        <div className="space-y-4">
          {divisions.map((division) => (
            <Link
              key={division.id}
              to={`/courses/${courseId}/divisions/${division.id}`}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {division.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chapter {division.order}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const DivisionDetail: React.FC<{ teacherId: string }> = ({ teacherId }) => {
  const { courseId, divisionId } = useParams<{ courseId: string; divisionId: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [divisionTitle, setDivisionTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadContents = async () => {
      try {
        if (!divisionId || !courseId) {
          throw new Error('Invalid chapter or course ID');
        }
        // Initialize cache
        initializeCache(teacherId);
        let cache = getCache(teacherId);
        if (!cache) {
          console.error('Cache initialization failed for teacher:', teacherId);
          throw new Error('Cache initialization failed');
        }

        if (cache.isCachePopulated) {
          const divisions = cache.divisions[parseInt(courseId)] || [];
          const division = divisions.find((d) => d.id === parseInt(divisionId));
          setDivisionTitle(division?.title || 'Chapter');
          setContents(cache.contents[parseInt(divisionId)] || []);
        } else {
          if (!cache.fetchPromise) {
            console.log('Starting background fetch for teacher:', teacherId);
            const fetchPromise = fetchTeacherDataInBackground(teacherId);
            setFetchPromise(teacherId, fetchPromise);
            cache = getCache(teacherId)!;
          }
          console.log('Waiting for background fetch in DivisionDetail...');
          await cache.fetchPromise;
          const updatedCache = getCache(teacherId);
          if (updatedCache) {
            const divisions = updatedCache.divisions[parseInt(courseId)] || [];
            const division = divisions.find((d) => d.id === parseInt(divisionId));
            setDivisionTitle(division?.title || 'Chapter');
            setContents(updatedCache.contents[parseInt(divisionId)] || []);
          } else {
            throw new Error('Cache missing after fetch');
          }
        }
      } catch (error: any) {
        console.error('DivisionDetail error:', error);
        toast.error('Failed to load contents');
        navigate(`/courses/${courseId}`);
      }
    };
    loadContents();
  }, [courseId, divisionId, navigate, teacherId]);

  const getFileIcon = (type: Content['type']) => {
    switch (type) {
      case 'VIDEO':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.2A1 1 0 0010 9.768v4.464a1 1 0 001.555.832l3.197-2.2a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'PDF':
        return (
          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="mr-4 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {divisionTitle} - Contents
        </h2>
      </div>
      {contents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No contents found for this chapter.</p>
      ) : (
        <div className="space-y-4">
          {contents.map((content) => (
            <div
              key={content.id}
              className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 flex items-center"
            >
              <div className="mr-4">{getFileIcon(content.type)}</div>
              <div className="flex-1">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  {content.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {content.type} • {content.category}
                  {content.duration ? ` • ${content.duration}s` : ''}
                </p>
              </div>
              <a
                href={content.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ViewCourses: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const verifyResponse = await verifyTeacherToken();
        if (!verifyResponse.data.authenticated) {
          throw new Error('Not authenticated');
        }
        const teacherEmail = verifyResponse.data.email || localStorage.getItem('teacherEmail') || 'teacher';
        setTeacherId(teacherEmail);
      } catch (error: any) {
        console.error('Verify teacher error:', error);
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      }
    };
    verify();
  }, [navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!teacherId) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'} min-h-screen flex justify-center items-center`}>
        <Loading />
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'
      } min-h-screen transition-colors duration-300 flex flex-col`}
    >
      <Toaster position="top-right" />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} isDarkMode={isDarkMode} closeSidebar={closeSidebar} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Courses</h1>
          <Routes>
            <Route path="/" element={<CoursesList teacherId={teacherId} />} />
            <Route path="/:courseId" element={<CourseDetail teacherId={teacherId} />} />
            <Route path="/:courseId/divisions/:divisionId" element={<DivisionDetail teacherId={teacherId} />} />
          </Routes>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewCourses;