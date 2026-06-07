import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  Menu,
  Award,
  ShoppingBag,
  Bell,
  Trash2,
  Search,
  Compass,
  Trophy,
  Brain,
  Flame,
  FileText,
  ChevronDown,
  Check,
  Zap,
  Users,
  ShieldCheck,
  Map,
  User,
  Settings,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Ana Sayfa' },
  { id: 'courses', icon: BookOpen, label: 'Kurslar' },
  { id: 'live', icon: MonitorPlay, label: 'Canlı Dersler' },
  { id: 'calendar', icon: Calendar, label: 'Takvim & Plan' },
  { id: 'messages', icon: MessageSquare, label: 'Mesajlar' },
  { id: 'certificates', icon: Award, label: 'Sertifikalar' },
  { id: 'profile', icon: GraduationCap, label: 'Profilim' },
  { id: 'instructor', icon: Briefcase, label: 'Eğitmen Paneli', auth: true, role: 'teacher' },
];

const EXTRA_LINKS = [
  { id: 'h-paths', label: 'Yol Haritaları' },
  { id: 'h-community', label: 'Topluluk' },
  { id: 'h-corporate', label: 'Kurumsal' },
];



export default function GlobalNavbar({ activePage, onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAllNotifs, setShowAllNotifs] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'EduBot', desc: 'Sana yeni bir mesaj gönderdi.', time: '2 dk önce', type: 'msg' },
    { id: 2, title: 'React 101', desc: 'Yeni modül yayında: "Hooks Derinlemesine"', time: '1 saat önce', type: 'course' },
    { id: 3, title: 'Ahmet Yılmaz', desc: 'Sana arkadaşlık isteği gönderdi.', time: 'Dün', type: 'friend' },
    { id: 4, title: 'Sistem', desc: 'Haftalık hedefine ulaştın!', time: '2 gün önce', type: 'system' },
    { id: 5, title: 'Elif Kaya', desc: 'Seni "Frontend Bootcamp" grubuna ekledi.', time: '3 gün önce', type: 'group' },
    { id: 6, title: 'Canlı Ders', desc: 'Python OOP dersi 10 dakika içinde başlıyor.', time: '3 gün önce', type: 'live' }
  ]);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
        setShowAllNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
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
    if (user?.role === 'admin') return true;
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
        maxWidth: 1800,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 32,
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
          
          {/* Menu Dropdown for Extra Links */}
          <div 
            ref={menuRef} 
            style={{ position: 'relative' }}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
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
              <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 12, zIndex: 1000 }}>
                <div style={{
                  boxSizing: 'border-box',
                  width: 200, background: isDark ? '#0f172a' : '#f8fafc',
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
                      </button>
                    );
                  })}

                  <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '8px 0' }} />

                  {EXTRA_LINKS.map(link => (
                    <button
                      key={link.id}
                      onClick={() => {
                        onNavigate(link.id);
                        setMenuOpen(false);
                      }}
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '10px 16px',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: isDark ? '#cbd5e1' : '#64748b',
                        fontSize: 14, fontWeight: 500, textAlign: 'left',
                        borderRadius: 8, transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                        e.currentTarget.style.color = '#00d4aa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = isDark ? '#cbd5e1' : '#64748b';
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {visibleNavItems.map(({ id, icon: Icon, label }) => {
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
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#00d4aa';
                    const underline = e.currentTarget.querySelector('.nav-underline-tab');
                    if (underline) underline.style.width = '100%';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = isDark ? '#8899b4' : '#64748b';
                    const underline = e.currentTarget.querySelector('.nav-underline-tab');
                    if (underline) underline.style.width = '0%';
                  }
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
                <div 
                  className="nav-underline-tab"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: 3,
                    background: '#00d4aa',
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    transition: 'width 0.3s ease',
                    width: isActive ? 'calc(100% - 32px)' : '0%'
                  }} 
                />
              </button>
            );
          })}
        </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          <button
            onClick={openCart}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              border: 'none',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: isDark ? '#fff' : '#1e293b',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <ShoppingBag size={18} />
            {cartItems.length > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: '"Inter", sans-serif',
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${isDark ? '#0a1628' : '#ffffff'}`,
              }}>
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                onClick={() => { 
                  setShowNotifs(!showNotifs); 
                  if (showNotifs) setShowAllNotifs(false); 
                }}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%',
                  border: 'none',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: isDark ? '#fff' : '#1e293b',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: '"Inter", sans-serif',
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${isDark ? '#0a1628' : '#ffffff'}`,
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 12,
                  width: 320, background: isDark ? '#0f172a' : '#fff',
                  borderRadius: 16, padding: 16,
                  boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.08)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  animation: 'slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 1000
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <button 
                      onClick={() => setNotifications([])}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Trash2 size={14} /> Temizle
                    </button>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? '#fff' : '#1e293b' }}>Bildirimler</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: showAllNotifs ? 360 : undefined, overflowY: showAllNotifs ? 'auto' : 'hidden', paddingRight: showAllNotifs ? 4 : 0 }}>
                    {notifications.length === 0 ? (
                      <div style={{ textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b', fontSize: 14, padding: '20px 0' }}>Hiç bildiriminiz yok.</div>
                    ) : (
                      (showAllNotifs ? notifications : notifications.slice(0, 3)).map((n, i) => (
                        <div key={n.id || i} style={{ display: 'flex', gap: 12, padding: 8, borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', cursor: 'pointer' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: n.type === 'msg' ? '#3b82f6' : n.type === 'course' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                            {n.title.charAt(0)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#fff' : '#1e293b' }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginTop: 2 }}>{n.desc}</div>
                            <div style={{ fontSize: 10, color: isDark ? '#64748b' : '#94a3b8', marginTop: 4 }}>{n.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {!showAllNotifs && notifications.length > 3 && (
                    <button onClick={() => setShowAllNotifs(true)} style={{ width: '100%', marginTop: 16, background: 'transparent', border: 'none', color: '#00d4aa', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Tümünü Gör ({notifications.length})</button>
                  )}
                </div>
              )}
            </div>

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
                  borderRadius: 8,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
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
                  borderRadius: 8,
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
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  padding: '4px 12px 4px 4px', borderRadius: 50,
                  background: isDark ? (showProfileMenu ? 'rgba(255,255,255,0.1)' : 'transparent') : (showProfileMenu ? 'rgba(0,0,0,0.05)' : 'transparent'),
                  transition: 'background 0.2s', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#00d4aa',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  overflow: 'hidden'
                }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user?.avatarInitials || '?'
                  )}
                </div>
                <ChevronDown size={14} color={isDark ? '#cbd5e1' : '#64748b'} style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 12,
                  width: 240, background: isDark ? '#0f172a' : '#fff',
                  borderRadius: 16, padding: 8,
                  boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.08)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  animation: 'slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, color: isDark ? '#fff' : '#1e293b', fontSize: 15, marginBottom: 2 }}>{user?.name || 'Kullanıcı'}</div>
                    <div style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>{user?.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'} • Seviye {user?.level || 1}</div>
                  </div>
                  
                  <button onClick={() => { onNavigate('profile'); setShowProfileMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <User size={16} /> Profilim
                  </button>
                  <button onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Settings size={16} /> Hesap Ayarları
                  </button>
                  <button onClick={() => { logout(); setShowProfileMenu(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', marginTop: 4, background: 'transparent', border: 'none', color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
