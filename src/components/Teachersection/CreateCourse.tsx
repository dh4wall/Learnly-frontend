import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createCourse, createDivision, createContentBatch, verifyTeacherToken } from '../../utils/api';
import Navbar from '../Reusables/TeacherNavbar';
import Sidebar from '../Reusables/TeacherSidebar';

interface Division {
  id: number;
  title: string;
  order: number;
}

const CourseCreator: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [course, setCourse] = useState({ name: '', price: '', thumbnail: null as File | null });
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [newDivision, setNewDivision] = useState({ title: '', order: '' });
  const [content, setContent] = useState({
    divisionId: '',
    files: [] as File[],
    titles: [] as string[],
    durations: [] as string[],
  });
  const [courseId, setCourseId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        console.log('Verifying teacher token in CourseCreator...');
        const verifyResponse = await verifyTeacherToken();
        console.log('Verification response:', verifyResponse.data);
        if (!verifyResponse.data.authenticated) {
          throw new Error('Not authenticated');
        }
      } catch (error: any) {
        console.error('CourseCreator verification error:', {
          message: error.message,
          response: error.response?.data,
        });
        if (error.response?.status === 401 || error.message === 'Not authenticated') {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error('Failed to verify session');
        }
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

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.name || !course.price || !course.thumbnail) {
      toast.error('Please fill all course fields');
      return;
    }
    if (!course.thumbnail.name || course.thumbnail.size === 0) {
      toast.error('Invalid thumbnail file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', course.name);
      formData.append('price', course.price);
      formData.append('thumbnailFile', course.thumbnail, course.thumbnail.name);
      console.log('Creating course with formData:', {
        name: course.name,
        price: course.price,
        thumbnailFile: {
          name: course.thumbnail.name,
          type: course.thumbnail.type,
          size: course.thumbnail.size,
        },
      });
      const createdCourse = await createCourse(formData);
      console.log('createCourse response:', createdCourse);
      setCourseId(createdCourse.id);
      setCourse({ name: '', price: '', thumbnail: null });
      toast.success('Course created successfully');
    } catch (error: any) {
      console.error('Course creation error:', {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDivisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDivision.title || !newDivision.order) {
      toast.error('Please fill all division fields');
      return;
    }
    if (!courseId) {
      toast.error('Please create a course first');
      return;
    }
    try {
      const division = await createDivision(courseId, newDivision.title, parseInt(newDivision.order));
      setDivisions([...divisions, division]);
      setNewDivision({ title: '', order: '' });
      toast.success('Division created successfully');
    } catch (error: any) {
      console.error('Division creation error:', {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Failed to create division');
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.divisionId || content.files.length === 0) {
      toast.error('Please select a division and upload files');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('divisionId', content.divisionId);
      content.files.forEach((file, i) => {
        formData.append('files', file, file.name);
        formData.append('titles', content.titles[i] || file.name);
        formData.append('durations', content.durations[i] || '0');
      });
      console.log('Uploading content with formData:', Object.fromEntries(formData));
      await createContentBatch(formData);
      toast.success('Content uploaded successfully');
      setContent({ divisionId: '', files: [], titles: [], durations: [] });
    } catch (error: any) {
      console.error('Content upload error:', {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Failed to upload content');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const allowedExtensions = ['mp4', 'mkv', 'webm', 'avi', 'pdf', 'docx', 'txt', 'jpg', 'png', 'gif', 'webp'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        toast.error(`Invalid file: ${file.name}. Allowed: ${allowedExtensions.join(', ')}`);
        return false;
      }
      return true;
    });
    setContent({
      ...content,
      files: validFiles,
      titles: validFiles.map((file) => file.name),
      durations: validFiles.map(() => '0'),
    });
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300 flex flex-col`}>
      <Toaster position="top-right" />
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} isDarkMode={isDarkMode} closeSidebar={closeSidebar} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Create a New Course</h2>

          {/* Course Form */}
          <form onSubmit={handleCourseSubmit} className={`p-6 rounded-2xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Course Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Course Name</label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                placeholder="Enter course name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                value={course.price}
                onChange={(e) => setCourse({ ...course, price: e.target.value })}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                placeholder="Enter price"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log('Selected thumbnail:', file);
                  setCourse({ ...course, thumbnail: file || null });
                }}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
            >
              Create Course
            </motion.button>
          </form>

          {/* Division Form */}
          <form onSubmit={handleDivisionSubmit} className={`p-6 rounded-2xl shadow-lg mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Add Division</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Division Title</label>
              <input
                type="text"
                value={newDivision.title}
                onChange={(e) => setNewDivision({ ...newDivision, title: e.target.value })}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                placeholder="Enter division title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                value={newDivision.order}
                onChange={(e) => setNewDivision({ ...newDivision, order: e.target.value })}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                placeholder="Enter order"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
            >
              Add Division
            </motion.button>
          </form>

          {/* Content Form */}
          <form onSubmit={handleContentSubmit} className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Upload Content</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Division</label>
              <select
                value={content.divisionId}
                onChange={(e) => setContent({ ...content, divisionId: e.target.value })}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
              >
                <option value="">Select a division</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Files</label>
              <input
                type="file"
                multiple
                accept="video/*,application/pdf,image/*,.docx,.txt"
                onChange={handleFileChange}
                className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              />
            </div>
            {content.files.map((file, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium mb-1">Title for {file.name}</label>
                <input
                  type="text"
                  value={content.titles[index] || ''}
                  onChange={(e) => {
                    const newTitles = [...content.titles];
                    newTitles[index] = e.target.value;
                    setContent({ ...content, titles: newTitles });
                  }}
                  className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  placeholder="Enter content title"
                />
                <label className="block text-sm font-medium mt-2 mb-1">Duration (seconds) for {file.name}</label>
                <input
                  type="number"
                  value={content.durations[index] || ''}
                  onChange={(e) => {
                    const newDurations = [...content.durations];
                    newDurations[index] = e.target.value;
                    setContent({ ...content, durations: newDurations });
                  }}
                  className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  placeholder="Enter duration"
                />
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`}
            >
              Upload Content
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseCreator;