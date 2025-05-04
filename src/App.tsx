import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
// import Signup from './components/Signup';
// import Signin from './components/SignIn';
import Onboarding from './components/Onboarding';
import Home from './components/Home/Home';
import Logout from './components/Logout';
import VerifyEmail from './components/VerifyEmail';
import PrivateRoute from './components/Home/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} /> */}
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
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;