import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Onboarding from './components/Onboarding/Onboarding';
import Home from './components/Home/Home';
import VerifyEmail from './components/Notification/VerifyEmail';
import TeacherVerifyEmail from './components/Notification/TeacherVerifyEmail';
import TeacherOnboarding from './components/Onboarding/TeacherOnboarding';
import TeacherDashboard from './components/Teachersection/TeacherDashboard';
import PrivateRoute from './components/Home/PrivateRoute';
import CourseCreator from './components/Teachersection/CreateCourse';
import ViewCourses from './components/Teachersection/ViewCourses';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute requiresOnboarding={true}>
              <Onboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute requiresOnboarding={false}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/verify-email"
          element={<TeacherVerifyEmail />}
        />
        <Route
          path="/teacher/onboarding"
          element={
            <PrivateRoute requiresOnboarding={true} isTeacher={true}>
              <TeacherOnboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute requiresOnboarding={false} isTeacher={true}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route 
          path="/courses/create" 
          element={
            <PrivateRoute requiresOnboarding={false} isTeacher={true}>
              <CourseCreator />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/courses/*" 
          element={
            <PrivateRoute requiresOnboarding={false} isTeacher={true}>
              <ViewCourses />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;