import React, { useEffect } from 'react';
import { logout } from '../utils/api';

const Logout: React.FC = () => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        window.location.href = '/login';
      } catch (error) {
        console.error('Error during logout');
      }
    };
    performLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;