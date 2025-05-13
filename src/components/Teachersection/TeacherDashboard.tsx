import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { teacherLogout, fetchTeacherCourses, verifyTeacherToken } from '../../utils/api'
import ThemeChangeButton from '../Reusables/ThemeChangeButton';
import Navbar from '../Reusables/TeacherNavbar';
import Sidebar from '../Reusables/TeacherSidebar';

interface Course {
  id: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
}

const TeacherDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        console.log('Verifying teacher token...');
        const verifyResponse = await verifyTeacherToken();
        console.log('Verification response:', verifyResponse.data);
        if (!verifyResponse.data.authenticated) {
          throw new Error('Not authenticated');
        }
        console.log('Fetching courses...');
        const coursesData = await fetchTeacherCourses();
        setCourses(coursesData);
      } catch (error: any) {
        console.error('Dashboard error:', {
          message: error.message,
          response: error.response?.data,
        });
        if (error.response?.status === 401 || error.message === 'Not authenticated') {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load dashboard');
        }
      }
    };
    verifyAndFetch();
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      await teacherLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', {
        message: error.message,
        response: error.response?.data,
      });
      toast.error('Error logging out');
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300 flex flex-col`}>
      <Toaster position="top-right" />
      <div ref={navbarRef}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
      </div>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} isDarkMode={isDarkMode} closeSidebar={closeSidebar} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Teacher Dashboard</h2>
          <p className="text-lg mb-8">Manage your courses below or create a new one.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No courses found. Create one now!</p>
            ) : (
              courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                  <p className="text-gray-500 mb-4">Price: ${course.price.toFixed(2)}</p>
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
                  >
                    View Details
                  </button>
                </motion.div>
              ))
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/courses/create')}
            className={`mt-8 px-6 py-3 rounded-lg ${isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-400 hover:bg-green-500'} text-white font-semibold shadow-md`}
          >
            Create New Course
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;