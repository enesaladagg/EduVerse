import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  GraduationCap,
  BookOpen,
  MonitorPlay,
  ClipboardList,
  Calendar,
  MessageSquare,
  Moon,
  Sun,
  Users,
  Award,
  Map
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Ana Sayfa' },
  { id: 'profile', icon: GraduationCap, label: 'Öğrenci Paneli', auth: true },
  { id: 'instructor', icon: Users, label: 'Eğitmen Paneli', auth: true },
  { id: 'courses', icon: BookOpen, label: 'Tüm Kurslar' },
  { id: 'certificates', icon: Award, label: 'Sertifikalar' },
  { id: 'live', icon: MonitorPlay, label: 'Canlı Dersler' },
  { id: 'assignments', icon: ClipboardList, label: 'Ödevler', auth: true },
  { id: 'calendar', icon: Calendar, label: 'Takvim & Plan', auth: true },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar', auth: true },
];

export default function GlobalNavbar({ activePage, onNavigate }) {
  const { isDark, toggleTheme, palette } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bg = scrolled 
    ? (isDark ? 'rgba(10,22,40,0.95)' : 'rgba(255,255,255,0.95)') 
    : 'transparent';

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: bg,
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` : 'none',
      transition: 'all 0.3s ease',
      padding: '0 4%',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80
      }}>
        
        {/* LOGO */}
        <div 
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#00d4aa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18, color: 'white'
          }}>E</div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
            <span style={{ color: isDark ? '#fff' : '#1e293b' }}>Edu</span>
            <span style={{ color: '#00d4aa' }}>Verse<span style={{color: '#00d4aa'}}>.</span></span>
          </span>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {NAV_ITEMS.filter(item => !item.auth || isAuthenticated).map(({ id, icon: Icon, label }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '8px 16px',
                  height: 80,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  color: isActive ? '#00d4aa' : (isDark ? '#8899b4' : '#64748b'),
                  transition: 'color 0.2s',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap'
                }}>
                  {label}
                </span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 16,
                    right: 16,
                    height: 3,
                    background: '#00d4aa',
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              border: 'none',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: isDark ? '#fff' : '#1e293b',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={() => onNavigate('login')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 50,
                  border: `1.5px solid ${isDark ? 'rgba(0,212,170,0.5)' : '#00d4aa'}`,
                  background: 'transparent',
                  color: isDark ? '#fff' : '#1e293b',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Giriş Yap
              </button>
              <button 
                onClick={() => onNavigate('register')}
                style={{
                  padding: '10px 24px',
                  borderRadius: 50,
                  border: 'none',
                  background: '#00d4aa',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,212,170,0.25)',
                  transition: 'all 0.2s'
                }}
              >
                Ücretsiz Başla
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#00d4aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 14,
              }}>
                {user?.avatarInitials || '?'}
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  borderRadius: 50,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  background: 'transparent',
                  color: isDark ? '#8899b4' : '#64748b',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Çıkış
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
