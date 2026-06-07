import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { User, Mail, Lock, ArrowRight, CheckCircle2, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function RegisterView({ onNavigate }) {
  const { isDark } = useTheme();
  const { register } = useAuth();
  
  const [roleMode, setRoleMode] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
  }, [roleMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 800));
    const result = await register({ name, email, password, applyInstructor: roleMode === 'teacher' });
    setLoading(false);
    if (result.success) {
      if (roleMode === 'teacher') {
        alert("Eğitmenlik başvurunuz alındı. Sistem yöneticileri onayladığında yetkileriniz tanımlanacaktır.");
      }
      onNavigate('home');
    } else {
      setError(result.message);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
    borderRadius: 12,
    color: isDark ? '#fff' : '#1e293b',
    fontSize: 15,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const socialBtnStyle = {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '12px',
    background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    borderRadius: 12,
    color: isDark ? '#cbd5e1' : '#475569',
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <>
      <GlobalNavbar activePage="register" onNavigate={onNavigate} />
      <div style={{
        minHeight: 'calc(100vh - 80px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
      background: isDark ? '#060d1b' : '#f8fafc',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <style>
        {`
          .register-container { flex-direction: row-reverse; }
          .register-right { display: flex; }
          @media (max-width: 900px) {
            .register-container { flex-direction: column !important; }
            .register-right { display: none !important; }
          }
          .custom-input:focus {
            border-color: #00d4aa !important;
            background: ${isDark ? 'rgba(0,212,170,0.05)' : '#fff'} !important;
            box-shadow: 0 0 0 4px rgba(0,212,170,0.1) !important;
          }
          .social-btn:hover {
            background: ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'} !important;
            transform: translateY(-2px);
          }
          @keyframes glowPulse {
            0% { box-shadow: 0 0 20px rgba(0,212,170,0.3); }
            50% { box-shadow: 0 0 40px rgba(0,212,170,0.6); }
            100% { box-shadow: 0 0 20px rgba(0,212,170,0.3); }
          }
        `}
      </style>

      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '15%', right: '15%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
        filter: 'blur(50px)', borderRadius: '50%', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(124,108,240,0.12) 0%, transparent 70%)',
        filter: 'blur(50px)', borderRadius: '50%', zIndex: 0
      }} />

      {/* Main Card Container */}
      <div className="register-container" style={{
        position: 'relative', zIndex: 1,
        display: 'flex',
        width: '100%', maxWidth: 1050, minHeight: 650,
        background: isDark ? 'rgba(16, 29, 53, 0.6)' : '#ffffff',
        backdropFilter: 'blur(24px)',
        borderRadius: 24,
        boxShadow: isDark ? '0 24px 80px rgba(0,0,0,0.5)' : '0 24px 80px rgba(0,0,0,0.08)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
        overflow: 'hidden'
      }}>
        
        {/* RIGHT PANEL - Branding (Reversed for Register) */}
        <div className="register-right" style={{
          flex: 1, padding: 60,
          flexDirection: 'column', justifyContent: 'space-between',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(124,108,240,0.08) 0%, rgba(0,212,170,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(124,108,240,0.05) 0%, rgba(0,212,170,0.05) 100%)',
          borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', background: 'rgba(124,108,240,0.15)',
              borderRadius: 50, color: '#7c6cf0', fontWeight: 600, fontSize: 14,
              marginBottom: 32
            }}>
              <Sparkles size={16} /> Harika Bir Başlangıç
            </div>
            <h1 style={{
              margin: '0 0 24px', fontSize: 42, fontWeight: 800, lineHeight: 1.2,
              color: isDark ? '#fff' : '#0f172a'
            }}>
              Geleceğine<br/>
              <span style={{ 
                background: 'linear-gradient(135deg, #7c6cf0, #00d4aa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Yatırım Yap.</span>
            </h1>
            <p style={{
              margin: 0, fontSize: 16, lineHeight: 1.6,
              color: isDark ? '#94a3b8' : '#64748b'
            }}>
              Milyonlarca öğrencinin ve binlerce uzman eğitmenin buluştuğu global ağa katılın. 
              Sıfırdan zirveye giden yolculuğunuz bugün başlıyor.
            </p>
          </div>

          <div style={{ 
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', 
            padding: 24, borderRadius: 16, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` 
          }}>
            <p style={{ margin: '0 0 16px', fontSize: 15, fontStyle: 'italic', color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.6 }}>
              "EduVerse sayesinde sadece 6 ayda kariyerimi tamamen değiştirdim ve hayalimdeki şirkete girdim. Burası bir eğitim platformundan çok daha fazlası."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: '#7c6cf0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                AE
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#fff' : '#0f172a' }}>Ayşe Yılmaz</div>
                <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>Yazılım Geliştirici @ TechCorp</div>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT PANEL - Form */}
        <div style={{
          flex: 1, padding: '40px 60px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: isDark ? '#fff' : '#0f172a' }}>
            Ücretsiz Kayıt Ol
          </h2>
          <p style={{ margin: '0 0 32px', color: isDark ? '#94a3b8' : '#64748b', fontSize: 15 }}>
            Saniyeler içinde hesabınızı oluşturun
          </p>

          {/* Role Segmented Control */}
          <div style={{
            position: 'relative', display: 'flex',
            background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9',
            borderRadius: 14, padding: 4, marginBottom: 24
          }}>
            <div style={{
              position: 'absolute', top: 4, bottom: 4, left: roleMode === 'student' ? 4 : '50%',
              width: 'calc(50% - 4px)', background: isDark ? '#1e293b' : '#fff',
              borderRadius: 10, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }} />
            
            <button
              type="button"
              onClick={() => setRoleMode('student')}
              style={{
                position: 'relative', flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: roleMode === 'student' ? (isDark ? '#fff' : '#0f172a') : (isDark ? '#64748b' : '#94a3b8'),
                fontWeight: 600, fontSize: 14, cursor: 'pointer', zIndex: 1, transition: 'color 0.2s'
              }}
            >
              Öğrenci Olarak
            </button>
            <div style={{
                position: 'relative', zIndex: 1, flex: 1, textAlign: 'center',
                padding: '12px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                color: roleMode === 'teacher' ? (isDark ? '#fff' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
                transition: 'color 0.3s'
              }} onClick={() => setRoleMode('teacher')}>
                Eğitmen Ol (Başvuru)
            </div>
          </div>

          {roleMode === 'teacher' && (
              <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontSize: 13 }}>
                Eğitmenlik talebiniz yöneticiler tarafından incelenecek ve onaylandıktan sonra yetkileriniz açılacaktır.
              </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name Input */}
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                className="custom-input"
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                className="custom-input"
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
              <input
                className="custom-input"
                type={showPassword ? "text" : "password"}
                placeholder="Şifreniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{...inputStyle, paddingRight: 44}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  color: isDark ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div style={{ 
                padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', 
                borderLeft: '4px solid #ef4444', borderRadius: 8,
                color: '#ef4444', fontSize: 14, fontWeight: 500, marginTop: 4 
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', marginTop: 8,
                background: 'linear-gradient(135deg, #00d4aa, #00b38f)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(0,212,170,0.3)',
                transition: 'all 0.2s',
                animation: 'glowPulse 3s infinite',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" /> Hesabınız Oluşturuluyor...
                </>
              ) : (
                <>
                  Hemen Kaydol <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
              veya şununla kayıt ol
            </span>
            <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          </div>

          {/* Social Logins */}
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="social-btn" style={socialBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="social-btn" style={socialBtnStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              Github
            </button>
          </div>

          {/* Login Link */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 15, color: isDark ? '#94a3b8' : '#64748b' }}>
            Zaten hesabınız var mı?{' '}
            <button onClick={() => onNavigate('login')} style={{
              background: 'none', border: 'none', padding: 0,
              color: '#00d4aa', fontWeight: 700, cursor: 'pointer'
            }}>
              Giriş Yapın
            </button>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
    </>
  );
}
