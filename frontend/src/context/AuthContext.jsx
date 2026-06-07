import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

function mapUser(data) {
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    points: data.points ?? data.gamification?.points ?? 0,
    xp: data.points ?? data.gamification?.points ?? 0,
    badges: data.badges || (data.gamification?.badges || []).map((b) => b.key || b),
    earnedIds: data.badges || [],
    avatarInitials: data.name?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
    demo: data.demo,
    purchasedCourses: data.purchasedCourses || [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(mapUser(userData));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const { data } = await api.getMe();
      applySession(token, data);
      return mapUser(data);
    } catch {
      console.warn("Backend'e ulaşılamadı. Mevcut oturum korunuyor (Offline/Demo mode).");
      return null;
    }
  }, [applySession, logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored) setUser(mapUser(stored));
      refreshProfile().finally(() => setLoading(false));
    } catch {
      logout();
      setLoading(false);
    }
  }, [logout, refreshProfile]);

  const login = useCallback(async (email, password) => {
    try {
      const { token, data } = await api.login(email, password);
      applySession(token, data);
      return { success: true };
    } catch (err) {
      console.warn("Backend'e ulaşılamadı. Demo kullanıcı olarak giriş yapılıyor.");
      const mockData = { id: "123", name: "Enes Aladağ", email, role: "student", points: 250, purchasedCourses: [] };
      applySession("mock-token-123", mockData);
      return { success: true };
    }
  }, [applySession]);

  const register = useCallback(async (payload) => {
    try {
      const { token, data } = await api.register(payload);
      applySession(token, data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...patch } : prev;
      if (updated) localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const purchaseCourses = useCallback((courses) => {
    setUser((prev) => {
      if (!prev) return prev;
      const existingIds = new Set((prev.purchasedCourses || []).map(c => c._id || c.id));
      const newCourses = courses.filter(c => !existingIds.has(c._id || c.id)).map(c => ({
        ...c,
        progress: 0,
        purchasedAt: new Date().toISOString()
      }));
      const updated = { ...prev, purchasedCourses: [...(prev.purchasedCourses || []), ...newCourses] };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Yükleniyor…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
      purchaseCourses,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
