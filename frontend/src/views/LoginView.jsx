import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Mail, Lock, ArrowRight, CheckCircle2, Loader2, Sparkles, Eye, EyeOff, ArrowLeft, Send, Phone, MessageSquare } from 'lucide-react';

export default function LoginView({ onNavigate }) {
  const { isDark } = useTheme();
  const { login, forgotPassword, sendPhoneOtp, loginPhone } = useAuth();

  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  const [roleMode, setRoleMode] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState('input'); // 'input' | 'otp'
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  // Forgot password state
  const [step, setStep] = useState('login'); // 'login' | 'forgot' | 'forgot-sent'
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEmail('');
    setPassword('');
    setError('');
  }, [roleMode]);

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;
    const result = await sendPhoneOtp(formatted);
    setLoading(false);
    if (result.success) {
      setPhoneStep('otp');
    } else {
      setError(result.message || 'SMS gönderilemedi.');
    }
  };

  const handlePhoneOtpLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;
    const result = await loginPhone(formatted, phoneOtp);
    setLoading(false);
    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.message || 'Geçersiz kod.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await forgotPassword(forgotEmail);
    setLoading(false);
    if (result.success) {
      setStep('forgot-sent');
    } else {
      setError(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Navbar'ın şeffaf kalması için body arka planını ayarla
  useEffect(() => {
    const bodyBg = isDark ? '#0e1628' : '#ffffff';
    document.body.style.background = bodyBg;
    return () => { document.body.style.background = ''; };
  }, [isDark]);

  const [notVerifiedEmail, setNotVerifiedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const { resendEmailOtp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotVerifiedEmail('');
    setResendDone(false);
    await new Promise(r => setTimeout(r, 800));
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      onNavigate('home');
    } else if (result.requiresVerification || result.error?.code === 'NOT_VERIFIED') {
      setNotVerifiedEmail(result.email || email);
      setError(result.message || 'Lütfen giriş yapmadan önce hesabınızı doğrulayın.');
    } else {
      setError(result.message);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    await resendEmailOtp(notVerifiedEmail || email);
    setResendLoading(false);
    setResendDone(true);
  };

  const handleOAuth = async (provider) => {
    const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    setOauthLoading(provider);
    setError('');
    try {
      const res = await fetch(`${BASE}/api/auth/${provider}`, { redirect: 'manual' });
      if (res.status === 503) {
        const data = await res.json();
        setError(data.error?.message || `${provider} girişi henüz yapılandırılmamış.`);
      } else if (res.type === 'opaqueredirect' || res.status === 302 || res.ok) {
        window.location.href = `${BASE}/api/auth/${provider}`;
      } else {
        setError(`${provider} ile giriş yapılamadı. Lütfen tekrar deneyin.`);
      }
    } catch (err) {
      setError(`${provider} ile giriş yapılamadı. Sunucu bağlantısını kontrol edin.`);
    } finally {
      setOauthLoading('');
    }
  };

  const card = isDark ? '#0e1628' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#0f172a';
  const sub  = isDark ? '#94a3b8' : '#64748b';
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 46px',
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border: `1.5px solid ${bdr}`,
    borderRadius: 12,
    color: text,
    fontSize: 15,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', sans-serif"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .full-page-container {
          height: 100vh;
          display: flex;
          box-sizing: border-box;
          font-family: 'Outfit', sans-serif;
          background: ${card};
        }

        .split-brand {
          flex: 1.1;
          position: relative;
          overflow: hidden;
          background: ${isDark 
            ? 'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(124,108,240,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(0,212,170,0.05) 0%, rgba(124,108,240,0.05) 100%)'};
          border-right: 1px solid ${bdr};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 76px 40px 40px 40px;
        }

        .split-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 76px 40px 40px 40px;
          background: ${card};
          overflow-y: auto;
        }

        .form-inner {
          width: 100%;
          max-width: 420px;
        }

        @media (max-width: 900px) {
          .split-brand { display: none; }
          .split-form { padding: 20px; }
        }

        .custom-input:focus {
          border-color: #00d4aa !important;
          background: ${isDark ? 'rgba(0,212,170,0.05)' : '#fff'} !important;
          box-shadow: 0 0 0 4px rgba(0,212,170,0.1) !important;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .rv-divider { flex: 1; height: 1px; background: ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'}; }
      `}</style>

      <GlobalNavbar activePage="login" onNavigate={onNavigate} />

      <div className="full-page-container">
        {/* LEFT SIDE - BRANDING */}
        <div className="split-brand">
          <div style={{ position: 'absolute', top: '5%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,108,240,0.12) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', zIndex: 0 }} />
          
          <div style={{ maxWidth: 500, position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 18px', background: 'rgba(0,212,170,0.15)',
              borderRadius: 50, color: '#00d4aa', fontWeight: 600, fontSize: 14,
              marginBottom: 32
            }}>
              <Sparkles size={16} /> EduVerse'e Hoş Geldiniz
            </div>
            <h1 style={{
              margin: '0 0 24px', fontSize: 46, fontWeight: 900, lineHeight: 1.15,
              color: isDark ? '#fff' : '#0f172a', letterSpacing: '-1px'
            }}>
              Öğrenmenin Yeni<br/>
              <span style={{ 
                background: 'linear-gradient(135deg, #00d4aa, #7c6cf0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Boyutunu Keşfedin.</span>
            </h1>
            <p style={{
              margin: '0 0 40px', fontSize: 16, lineHeight: 1.7,
              color: sub, maxWidth: 420
            }}>
              Binlerce kurs, interaktif canlı dersler ve uzman eğitmenlerle 
              kariyerinizi bir adım öteye taşıyın. Modern araçlarımızla sınırları aşın.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                'Sektör onaylı dijital sertifikalar',
                'Gerçek zamanlı kodlama ve beyaz tahta',
                'Gamification ile oyunlaştırılmış öğrenim'
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <CheckCircle2 size={22} color="#00d4aa" />
                  <span style={{ color: text, fontWeight: 500, fontSize: 15 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="split-form">
          <div className="form-inner">

            {/* ── FORGOT PASSWORD ────────────────────────────── */}
            {step === 'forgot' && (
              <div>
                <button type="button" onClick={() => { setStep('login'); setError(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: sub, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 14, padding: '0 0 20px 0' }}>
                  <ArrowLeft size={16} /> Giriş Sayfasına Dön
                </button>
                <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: text }}>Şifremi Unuttum</h2>
                <p style={{ margin: '0 0 28px', color: sub, fontSize: 15, lineHeight: 1.6 }}>
                  Kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı göndereceğiz.
                </p>
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
                    <input className="custom-input" type="email" placeholder="E-posta adresiniz"
                      value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required style={inputStyle} />
                  </div>
                  {error && (
                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>
                  )}
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '16px', background: loading ? 'rgba(0,212,170,0.6)' : 'linear-gradient(135deg, #00d4aa, #00b38f)',
                    color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
                    cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 8px 24px rgba(0,212,170,0.3)', boxSizing: 'border-box',
                  }}>
                    {loading ? <><Loader2 size={20} className="spin" /> Gönderiliyor...</> : <><Send size={18} /> Sıfırlama Bağlantısı Gönder</>}
                  </button>
                </form>
              </div>
            )}

            {/* ── FORGOT SENT ────────────────────────────────── */}
            {step === 'forgot-sent' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Mail size={36} color="#00d4aa" />
                </div>
                <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 900, color: text }}>E-posta Gönderildi!</h2>
                <p style={{ margin: '0 0 8px', color: sub, fontSize: 15, lineHeight: 1.7 }}>
                  <strong style={{ color: text }}>{forgotEmail}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                </p>
                <p style={{ margin: '0 0 32px', color: sub, fontSize: 14 }}>
                  Bağlantı <strong style={{ color: text }}>1 saat</strong> geçerlidir. Spam klasörünüzü kontrol etmeyi unutmayın.
                </p>
                <button type="button" onClick={() => { setStep('login'); setError(''); }}
                  style={{ background: 'none', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, padding: '12px 28px', color: text, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                  Giriş Sayfasına Dön
                </button>
              </div>
            )}

            {/* ── LOGIN FORM ─────────────────────────────────── */}
            {step === 'login' && <>
            <h2 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 900, color: text, letterSpacing: '-0.5px' }}>
              Giriş Yap
            </h2>
            <p style={{ margin: '0 0 20px', color: sub, fontSize: 15 }}>
              Öğrenmeye kaldığınız yerden devam edin
            </p>

            {/* Auth Method Tabs */}
            <div style={{
              position: 'relative', display: 'flex',
              background: isDark ? 'rgba(0,0,0,0.25)' : '#f1f5f9',
              borderRadius: 14, padding: 4, marginBottom: 24,
            }}>
              {/* Sliding pill */}
              <div style={{
                position: 'absolute', top: 4, bottom: 4,
                left: authMethod === 'email' ? 4 : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
                background: isDark ? '#0f2137' : '#fff',
                borderRadius: 10,
                transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isDark
                  ? '0 1px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,212,170,0.18)'
                  : '0 2px 8px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,212,170,0.2)',
              }} />

              {[
                {
                  id: 'email',
                  icon: (active) => (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#00d4aa' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="3"/>
                      <polyline points="2,4 12,13 22,4"/>
                    </svg>
                  ),
                  label: 'E-posta',
                },
                {
                  id: 'phone',
                  icon: (active) => (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#00d4aa' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="3"/>
                      <circle cx="12" cy="17" r="1" fill={active ? '#00d4aa' : 'currentColor'}/>
                    </svg>
                  ),
                  label: 'Tel ile Giriş',
                },
              ].map(m => {
                const active = authMethod === m.id;
                return (
                  <button key={m.id} type="button"
                    onClick={() => { setAuthMethod(m.id); setError(''); setPhoneStep('input'); setPhoneOtp(''); }}
                    style={{
                      position: 'relative', flex: 1, zIndex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                      color: active ? '#00d4aa' : sub,
                      fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
                      transition: 'color 0.25s', letterSpacing: '0.2px',
                    }}>
                    {m.icon(active)}
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* Phone Login Flow */}
            {authMethod === 'phone' && (
              phoneStep === 'input' ? (
                <form onSubmit={handleSendPhoneOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
                    <input className="custom-input" type="tel" placeholder="+90 555 123 4567"
                      value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle} />
                  </div>
                  <p style={{ margin: 0, color: sub, fontSize: 12, paddingLeft: 4 }}>Kayıtlı telefon numaranıza SMS kodu göndereceğiz.</p>
                  {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>}
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '16px', background: loading ? 'rgba(0,212,170,0.6)' : 'linear-gradient(135deg, #00d4aa, #00b38f)',
                    color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
                    cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 8px 24px rgba(0,212,170,0.3)', boxSizing: 'border-box',
                  }}>
                    {loading ? <><Loader2 size={20} className="spin" /> Gönderiliyor...</> : <><MessageSquare size={18} /> SMS Kodu Gönder</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePhoneOtpLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: isDark ? 'rgba(0,212,170,0.05)' : '#f0fdfa', padding: 20, borderRadius: 14, border: '1px solid rgba(0,212,170,0.2)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Phone size={28} color="#00d4aa" style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0, color: sub, fontSize: 14 }}><b style={{ color: text }}>{phone}</b> numarasına kod gönderdik.</p>
                  </div>
                  <input type="text" placeholder="6 Haneli SMS Kodu"
                    value={phoneOtp} onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required
                    style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', fontSize: 20, fontWeight: 700, padding: '16px', paddingLeft: '16px' }} />
                  {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>}
                  <button type="submit" disabled={loading || phoneOtp.length !== 6} style={{
                    width: '100%', padding: '16px', background: (loading || phoneOtp.length !== 6) ? 'rgba(0,212,170,0.5)' : '#00d4aa',
                    color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
                    cursor: (loading || phoneOtp.length !== 6) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box',
                  }}>
                    {loading ? <Loader2 size={20} className="spin" /> : 'Giriş Yap'}
                  </button>
                  <button type="button" onClick={() => { setPhoneStep('input'); setPhoneOtp(''); setError(''); }}
                    style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                    Farklı numara dene
                  </button>
                </form>
              )
            )}

            {/* Role Segmented Control — only for email login */}
            {authMethod === 'email' && <>
            <div style={{
              position: 'relative', display: 'flex',
              background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9',
              borderRadius: 14, padding: 4, marginBottom: 24
            }}>
              <div style={{
                position: 'absolute', top: 4, bottom: 4, left: roleMode === 'student' ? 4 : '50%',
                width: 'calc(50% - 4px)', background: isDark ? '#1e293b' : '#fff',
                borderRadius: 10, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
              }} />
              
              <button type="button" onClick={() => setRoleMode('student')}
                style={{
                  position: 'relative', flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: roleMode === 'student' ? text : sub,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', zIndex: 1, transition: 'color 0.2s',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                Öğrenci
              </button>
              <button type="button" onClick={() => setRoleMode('teacher')}
                style={{
                  position: 'relative', flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  color: roleMode === 'teacher' ? text : sub,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', zIndex: 1, transition: 'color 0.2s',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                Eğitmen
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Email Input */}
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
                <input className="custom-input" type="email" placeholder="E-posta adresiniz"
                  value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              </div>

              {/* Password Input */}
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
                <input className="custom-input" type={showPassword ? "text" : "password"} placeholder="Şifreniz"
                  value={password} onChange={(e) => setPassword(e.target.value)} required style={{...inputStyle, paddingRight: 46}} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  color: isDark ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center'
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#00d4aa', width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ fontSize: 14, color: sub, fontWeight: 500 }}>Beni Hatırla</span>
                </label>
                
                <button type="button"
                  onClick={() => { setStep('forgot'); setForgotEmail(email); setError(''); }}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: '#00d4aa', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                  Şifremi Unuttum
                </button>
              </div>

              {error && (
                <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{
                    padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)',
                    borderLeft: '4px solid #ef4444',
                    color: '#ef4444', fontSize: 14, fontWeight: 500
                  }}>{error}</div>
                  {(notVerifiedEmail || error.includes('doğrulayın')) && (
                    <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, color: sub }}>Doğrulama kodunuzu almadınız mı?</span>
                      {resendDone ? (
                        <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>✓ Kod gönderildi!</span>
                      ) : (
                        <button type="button" onClick={handleResendOtp} disabled={resendLoading}
                          style={{ fontSize: 13, fontWeight: 700, color: '#7c6cf0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          {resendLoading ? 'Gönderiliyor...' : 'Yeni Kod Gönder →'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '16px',
                background: loading ? 'rgba(0,212,170,0.6)' : 'linear-gradient(135deg, #00d4aa, #00b38f)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(0,212,170,0.3)',
                boxSizing: 'border-box',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,212,170,0.4)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,212,170,0.3)'; }}
              >
                {loading ? <><Loader2 size={20} className="spin" /> Giriş Yapılıyor...</> : <>Giriş Yap <ArrowRight size={20} /></>}
              </button>
            </form>
            </>}
            {/* end email auth block */}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
              <div className="rv-divider" />
              <span style={{ fontSize: 12, fontWeight: 600, color: sub, textTransform: 'uppercase', letterSpacing: 1 }}>
                veya şununla devam et
              </span>
              <div className="rv-divider" />
            </div>

            {/* Social Logins */}
            <div style={{ display: 'flex', gap: 16 }}>
              <button type="button"
                disabled={!!oauthLoading}
                onClick={() => handleOAuth('google')}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px', borderRadius: 12, cursor: oauthLoading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700,
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
                  color: isDark ? '#fff' : '#334155',
                  transition: 'all 0.2s',
                  opacity: oauthLoading === 'google' ? 0.7 : 1
                }}
                onMouseEnter={e => { if(!oauthLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'; }}>
                {oauthLoading === 'google' ? (
                  <div style={{ width: 18, height: 18, border: '2px solid #4285F4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                Google
              </button>
              <button type="button"
                disabled={!!oauthLoading}
                onClick={() => handleOAuth('linkedin')}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px', borderRadius: 12, cursor: oauthLoading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700,
                  background: isDark ? 'rgba(10, 102, 194, 0.15)' : '#f1f5f9',
                  border: `1px solid ${isDark ? 'rgba(10, 102, 194, 0.3)' : 'transparent'}`,
                  color: isDark ? '#60a5fa' : '#334155',
                  transition: 'all 0.2s',
                  opacity: oauthLoading === 'linkedin' ? 0.7 : 1
                }}
                onMouseEnter={e => { if(!oauthLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.background = isDark ? 'rgba(10, 102, 194, 0.25)' : '#e2e8f0'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = isDark ? 'rgba(10, 102, 194, 0.15)' : '#f1f5f9'; }}>
                {oauthLoading === 'linkedin' ? (
                  <div style={{ width: 18, height: 18, border: '2px solid #0A66C2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                )}
                LinkedIn
              </button>
            </div>

            {/* Register Link */}
            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 15, color: sub }}>
              Hesabınız yok mu?{' '}
              <button onClick={() => onNavigate('register')} style={{
                background: 'none', border: 'none', padding: 0,
                color: '#00d4aa', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif"
              }}>
                Hemen Ücretsiz Kaydolun
              </button>
            </div>

            </>}
            {/* ── END LOGIN FORM ─────────────────────────────── */}

          </div>
        </div>
      </div>
    </>
  );
}
