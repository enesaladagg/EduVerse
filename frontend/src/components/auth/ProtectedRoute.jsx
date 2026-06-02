import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Lütfen giriş yapın. (Giriş sayfasına yönlendirileceksiniz)</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Bu sayfayı görüntüleme yetkiniz yok.</div>;
  }

  return <div>Yetki Başarılı - Sayfa İçeriği Burada Gösterilecek (Outlet)</div>;
};

export default ProtectedRoute;
