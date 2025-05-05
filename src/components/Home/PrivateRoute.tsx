import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../../utils/api';
import Loading from '../custom/Loading';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresOnboarding: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresOnboarding }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verifyToken();
        setIsAuthenticated(response.data.authenticated);
        setIsNew(response.data.isNew);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className='center  items-center justify-center h-screen'>
      <Loading/>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  } 

  if (requiresOnboarding && !isNew) {
    return <Navigate to="/home" />;
  }

  if (!requiresOnboarding && isNew) {
    return <Navigate to="/onboarding/1" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;