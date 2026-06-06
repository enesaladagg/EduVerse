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
      logout();
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
      return { success: false, message: err.message };
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
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
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
