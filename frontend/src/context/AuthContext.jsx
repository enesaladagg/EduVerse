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
    streak: data.gamification?.streak || data.streak || 1,
    level: Math.floor((data.points ?? data.gamification?.points ?? 0) / 100) + 1,
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
  }, [applySession]);

  useEffect(() => {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

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
      const res = await api.login(email, password);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res; // E.g. requiresVerification case
    } catch (err) {
      console.error("Giriş başarısız:", err.message);
      // Backend error format matches err.message but we might have a custom object if we throw custom
      // Actually api.login throws Error. Let's return message or the error object if it has properties.
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const register = useCallback(async (payload) => {
    try {
      const res = await api.register(payload);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res; // E.g. requiresVerification case
    } catch (err) {
      console.error("Kayıt başarısız:", err.message);
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const verifyEmail = useCallback(async (email, code) => {
    try {
      const res = await api.verifyEmail(email, code);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const registerPhone = useCallback(async (payload) => {
    try {
      const res = await api.registerPhone(payload);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const verifyPhone = useCallback(async (phone, code) => {
    try {
      const res = await api.verifyPhone(phone, code);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const sendPhoneOtp = useCallback(async (phone) => {
    try {
      return await api.sendPhoneOtp(phone);
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const loginPhone = useCallback(async (phone, code) => {
    try {
      const res = await api.loginPhone(phone, code);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [applySession]);

  const forgotPassword = useCallback(async (email) => {
    try {
      const res = await api.forgotPassword(email);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    try {
      const res = await api.resetPassword(token, password);
      if (res.success && res.token) {
        applySession(res.token, res.data);
        return { success: true };
      }
      return res;
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

  const addXP = useCallback((amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newXp = (prev.xp || 0) + amount;
      const newPoints = (prev.points || 0) + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const updated = { ...prev, xp: newXp, points: newPoints, level: newLevel };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unlockBadge = useCallback((badgeId) => {
    setUser((prev) => {
      if (!prev) return prev;
      const earned = prev.earnedIds || [];
      if (earned.includes(badgeId)) return prev;
      const updated = { ...prev, earnedIds: [...earned, badgeId], badges: [...(prev.badges || []), badgeId] };
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
      verifyEmail,
      registerPhone,
      verifyPhone,
      sendPhoneOtp,
      loginPhone,
      forgotPassword,
      resetPassword,
      updateUser,
      purchaseCourses,
      addXP,
      unlockBadge,
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
