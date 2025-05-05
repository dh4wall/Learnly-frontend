import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken, verifyTeacherToken } from '../../utils/api';
import Loading from '../custom/Loading';

interface PrivateRouteProps {
  children: JSX.Element;
  requiresOnboarding: boolean;
  isTeacher?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresOnboarding, isTeacher = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const verifyFunction = isTeacher ? verifyTeacherToken : verifyToken;
        const response = await verifyFunction();
        console.log('PrivateRoute verify response:', {
          isTeacher,
          authenticated: response.data.authenticated,
          isNew: response.data.isNew,
        });
        setIsAuthenticated(response.data.authenticated);
        setIsNew(response.data.isNew);
      } catch (error: any) {
        console.error('PrivateRoute auth error:', {
          message: error.message,
          response: error.response?.data,
        });
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [isTeacher]);

  if (isAuthenticated === null) {
    return <div>
      <Loading/>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiresOnboarding && !isNew) {
    return <Navigate to={isTeacher ? '/teacher/dashboard' : '/home'} />;
  }

  if (!requiresOnboarding && isNew) {
    return <Navigate to={isTeacher ? '/teacher/onboarding' : '/onboarding'} />;
  }

  return children;
};

export default PrivateRoute;