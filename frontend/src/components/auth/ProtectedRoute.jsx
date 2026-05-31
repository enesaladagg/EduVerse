import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Not: React Router henüz kurulu olmadığı için Navigate ve Outlet bileşenleri yorum satırında bırakıldı.
// react-router-dom kurulduğunda bu kısımlar aktif edilebilir.

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    // return <Navigate to="/login" replace />;
    return <div>Lütfen giriş yapın. (Giriş sayfasına yönlendirileceksiniz)</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Kullanıcının rolü yetersizse anasayfaya yönlendir
    // return <Navigate to="/unauthorized" replace />;
    return <div>Bu sayfayı görüntüleme yetkiniz yok.</div>;
  }

  // return <Outlet />;
  return <div>Yetki Başarılı - Sayfa İçeriği Burada Gösterilecek (Outlet)</div>;
};

export default ProtectedRoute;
