import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RequireRole = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RequireRole;
