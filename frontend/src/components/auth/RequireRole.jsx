import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RequireRole = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  // Kullanıcı giriş yapmamışsa veya gerekli role sahip değilse içeriği gösterme
  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  // Gerekli yetkilere sahipse içeriği (buton, menü vb.) göster
  return <>{children}</>;
};

export default RequireRole;
