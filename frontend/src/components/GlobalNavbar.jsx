import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  GraduationCap,
  BookOpen,
  MonitorPlay,
  Calendar,
  MessageSquare,
  Moon,
  Sun,
  Briefcase,
  Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Ana Sayfa' },
  { id: 'profile', icon: GraduationCap, label: 'Profilim', auth: true, role: 'student' },
  { id: 'instructor', icon: Briefcase, label: 'Eğitmen Paneli', auth: true, role: 'teacher' },
  { id: 'courses', icon: BookOpen, label: 'Tüm Kurslar' },
  { id: 'live', icon: MonitorPlay, label: 'Canlı Dersler' },
  { id: 'calendar', icon: Calendar, label: 'Takvim & Plan', auth: true },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar', auth: true },
];

const HORIZONTAL_LINKS = [
  { id: 'h-courses', label: 'Kurslar' },
  { id: 'h-paths', label: 'Yol Haritaları' },
  { id: 'h-certs', label: 'Sertifikalar' },
  { id: 'h-community', label: 'Topluluk' },
  { id: 'h-corporate', label: 'Kurumsal' },
];

export default function GlobalNavbar({ activePage, onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bg = scrolled 
    ? (isDark ? 'rgba(10,22,40,0.2)' : 'rgba(255,255,255,0.1)') 
    : 'transparent';

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.auth && !isAuthenticated) return false;
    if (item.role && user?.role !== item.role) return false;
    return true;
  });

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
      <style>
        {`
          @keyframes slideDownFade {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
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
            <span style={{ color: '#00d4aa' }}>Verse</span>
          </span>
        </div>

        {/* CENTER CONTENT */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flex: 1 }}>
          
          {/* Menu Dropdown */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: menuOpen ? (isDark ? 'rgba(0,212,170,0.15)' : 'rgba(0,212,170,0.15)') : 'transparent',
                border: 'none', cursor: 'pointer',
                color: isDark ? '#fff' : '#1e293b', fontWeight: 600, fontSize: 15,
                padding: '10px 18px', borderRadius: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!menuOpen) e.currentTarget.style.background = isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!menuOpen) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Menu size={20} />
              Menü
            </button>

            {menuOpen && (
              <div style={{
                boxSizing: 'border-box',
                position: 'absolute', top: '100%', left: 0, marginTop: 12,
                width: 250, background: isDark ? '#0f172a' : '#f8fafc',
                borderRadius: 16, padding: 8,
                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.08)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                display: 'flex', flexDirection: 'column', gap: 4,
                animation: 'slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {visibleNavItems.map(({ id, icon: Icon, label }) => {
                  const isActive = activePage === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { onNavigate(id); setMenuOpen(false); }}
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex', alignItems: 'center', gap: 14,
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: isActive ? 'rgba(0,212,170,0.1)' : 'transparent',
                        color: isActive ? '#00d4aa' : (isDark ? '#cbd5e1' : '#334155'),
                        fontWeight: isActive ? 600 : 500, fontSize: 14,
                        transition: 'all 0.2s',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                          e.currentTarget.style.color = isDark ? '#fff' : '#0f172a';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = isDark ? '#cbd5e1' : '#334155';
                        }
                      }}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#00d4aa' : (isDark ? '#94a3b8' : '#64748b'), zIndex: 2 }} />
                      <span style={{ zIndex: 2 }}>{label}</span>
                      
                      {/* Splatter effect for active item (like in screenshot) */}
                      {isActive && (
                        <div style={{
                          position: 'absolute', top: -10, left: 10, width: 40, height: 40,
                          background: 'radial-gradient(circle, rgba(0,212,170,0.3) 0%, transparent 70%)',
                          borderRadius: '50%', filter: 'blur(4px)', zIndex: 1
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Horizontal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {HORIZONTAL_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate('courses')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: isDark ? '#cbd5e1' : '#64748b', fontSize: 14, fontWeight: 500,
                  transition: 'color 0.2s',
                  position: 'relative',
                  padding: '6px 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00d4aa';
                  const bar = e.currentTarget.querySelector('div');
                  if (bar) {
                    bar.style.width = '100%';
                    bar.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? '#cbd5e1' : '#64748b';
                  const bar = e.currentTarget.querySelector('div');
                  if (bar) {
                    bar.style.width = '0px';
                    bar.style.opacity = '0';
                  }
                }}
              >
                {link.label}
                <div 
                  style={{
                    position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                    height: 2, width: 0, background: '#00d4aa', opacity: 0,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', borderRadius: 2
                  }}
                />
              </button>
            ))}
          </div>

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
