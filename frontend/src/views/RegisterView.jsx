import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlobalNavbar from '../components/GlobalNavbar';
import {
  User, Mail, Lock, ArrowRight, Loader2, Sparkles, Eye, EyeOff, Star, Phone
} from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Ece Arslan',  role: 'Frontend Developer @ Trendyol', text: '"EduVerse sayesinde 4 ayda iş buldum. Canlı dersler ve sertifikalar inanılmaz fark yarattı!"', avatar: 'EA', color: '#00d4aa' },
  { name: 'Burak Yıldız', role: 'Data Scientist @ Getir',        text: '"Kurs kalitesi ve eğitmen erişimi gerçekten üst düzey. Hiç beklemediğim kadar hızlı öğrendim."', avatar: 'BY', color: '#7c6cf0' },
  { name: 'Selin Koç',   role: 'UX Designer @ Insider',         text: '"Sertifikamı LinkedIn\'e ekledim, bir hafta içinde işe alım teklifi aldım!"', avatar: 'SK', color: '#f59e0b' },
];

export default function RegisterView({ onNavigate }) {
  const { isDark } = useTheme();
  const { register, registerPhone, verifyPhone } = useAuth();

  const [authMethod, setAuthMethod]     = useState('email'); // 'email' | 'phone'
  const [roleMode, setRoleMode]         = useState('student');
  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState(null);
  const [testiIdx, setTestiIdx]         = useState(0);
  const [oauthLoading, setOauthLoading] = useState('');
  const [step, setStep]                 = useState('register'); // 'register' | 'verify' | 'verify-phone'
  const [otp, setOtp]                   = useState('');

  useEffect(() => { setError(''); }, [roleMode]);
  useEffect(() => {
    const t = setInterval(() => setTestiIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Navbar'ın şeffaf kalması için body arka planını ayarla
  useEffect(() => {
    const bodyBg = isDark ? '#0e1628' : '#ffffff';
    document.body.style.background = bodyBg;
    return () => { document.body.style.background = ''; };
  }, [isDark]);

  const [slowWarning, setSlowWarning] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSlowWarning(false);
    setError('');
    // 5 saniye sonra "sunucu uyanıyor" mesajı göster
    const slowTimer = setTimeout(() => setSlowWarning(true), 5000);
    await new Promise(r => setTimeout(r, 600));

    if (authMethod === 'phone') {
      const formatted = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;
      const result = await registerPhone({ name, phone: formatted, password, applyInstructor: roleMode === 'teacher' });
      setLoading(false);
      if (result.success && result.requiresVerification) {
        setStep('verify-phone');
      } else if (!result.success) {
        setError(result.message);
      }
      return;
    }

    const result = await register({ name, email, password, applyInstructor: roleMode === 'teacher' });
    clearTimeout(slowTimer);
    setSlowWarning(false);
    setLoading(false);
    if (result.success) {
      if (result.requiresVerification) {
        setStep('verify');
      } else {
        if (roleMode === 'teacher') alert('Eğitmenlik başvurunuz alındı. Yöneticiler onayladığında yetkileriniz tanımlanacak.');
        onNavigate('home');
      }
    } else {
      setError(result.message);
    }
  };

  const { verifyEmail } = useAuth();

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await verifyEmail(email, otp);
    setLoading(false);
    if (result.success) {
      if (roleMode === 'teacher') alert('Eğitmenlik başvurunuz alındı. Yöneticiler onayladığında yetkileriniz tanımlanacak.');
      onNavigate('home');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyPhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;
    const result = await verifyPhone(formatted, otp);
    setLoading(false);
    if (result.success) {
      if (roleMode === 'teacher') alert('Eğitmenlik başvurunuz alındı. Yöneticiler onayladığında yetkileriniz tanımlanacak.');
      onNavigate('home');
    } else {
      setError(result.message);
    }
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
        setError(`${provider} ile kayıt yapılamadı. Lütfen tekrar deneyin.`);
      }
    } catch (err) {
      setError(`${provider} ile kayıt yapılamadı. Sunucu bağlantısını kontrol edin.`);
    } finally {
      setOauthLoading('');
    }
  };

  const bg   = isDark ? '#060d1b' : '#f0f4f8';
  const card = isDark ? '#0e1628' : '#ffffff';
  const text = isDark ? '#f1f5f9' : '#0f172a';
  const sub  = isDark ? '#94a3b8' : '#64748b';
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  const inputBase = {
    width: '100%',
    padding: '14px 16px 14px 46px',
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border: `1.5px solid ${bdr}`,
    borderRadius: 12,
    color: text,
    fontSize: 15,
    fontFamily: "'Outfit', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  };

  const iconColor = (id) => focused === id ? '#7c6cf0' : (isDark ? '#64748b' : '#94a3b8');
  const testi = TESTIMONIALS[testiIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .full-page-container {
          height: 100vh;
          display: flex;
          flex-direction: row-reverse;
          box-sizing: border-box;
          font-family: 'Outfit', sans-serif;
          background: ${card};
        }

        .split-brand {
          flex: 1.1;
          position: relative;
          overflow: hidden;
          background: ${isDark
            ? 'linear-gradient(145deg, rgba(124,108,240,0.08) 0%, rgba(0,212,170,0.05) 100%)'
            : 'linear-gradient(145deg, rgba(124,108,240,0.06) 0%, rgba(0,212,170,0.04) 100%)'};
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

        /* input focus */
        .rv-input:focus {
          border-color: #7c6cf0 !important;
          background: ${isDark ? 'rgba(124,108,240,0.05)' : '#fff'} !important;
          box-shadow: 0 0 0 4px rgba(124,108,240,0.1) !important;
        }

        @keyframes rv-fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rv-testi { animation: rv-fadeUp 0.4s ease; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
        .rv-divider { flex: 1; height: 1px; background: ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'}; }
      `}</style>

      <GlobalNavbar activePage="register" onNavigate={onNavigate} />

      <div className="full-page-container">
        
        {/* LEFT SIDE - FORM */}
        <div className="split-form">
          <div className="form-inner">
            <h2 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 900, color: text, letterSpacing: '-0.5px' }}>
              Ücretsiz Kayıt Ol
            </h2>
            <p style={{ margin: '0 0 28px', color: sub, fontSize: 15 }}>
              Saniyeler içinde hesabınızı oluşturun
            </p>

            {/* Role toggle */}
            <div style={{
              position: 'relative', display: 'flex',
              background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9',
              borderRadius: 14, padding: 4, marginBottom: 24,
            }}>
              <div style={{
                position: 'absolute', top: 4, bottom: 4,
                left: roleMode === 'student' ? 4 : '50%',
                width: 'calc(50% - 4px)',
                background: isDark ? '#1e293b' : '#fff',
                borderRadius: 10,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
              }} />
              <button type="button" onClick={() => setRoleMode('student')}
                style={{ 
                  color: roleMode === 'student' ? text : sub,
                  position: 'relative', flex: 1, padding: '10px 0',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                  zIndex: 1, transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                Öğrenci Olarak
              </button>
              <button type="button" onClick={() => setRoleMode('teacher')}
                style={{ 
                  color: roleMode === 'teacher' ? text : sub,
                  position: 'relative', flex: 1, padding: '10px 0',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                  zIndex: 1, transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                Eğitmen (Başvuru)
              </button>
            </div>

            {roleMode === 'teacher' && (
              <div style={{
                marginBottom: 20, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                color: '#f59e0b', fontSize: 13, fontWeight: 500, lineHeight: 1.5
              }}>
                ⚠️ Eğitmenlik talebiniz yöneticiler tarafından incelenecektir.
              </div>
            )}

            {/* Auth Method Tabs */}
            {step === 'register' && (
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
                  background: isDark ? '#130e28' : '#fff',
                  borderRadius: 10,
                  transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isDark
                    ? '0 1px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(124,108,240,0.2)'
                    : '0 2px 8px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(124,108,240,0.2)',
                }} />

                {[
                  {
                    id: 'email',
                    icon: (active) => (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c6cf0' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="3"/>
                        <polyline points="2,4 12,13 22,4"/>
                      </svg>
                    ),
                    label: 'E-posta ile',
                  },
                  {
                    id: 'phone',
                    icon: (active) => (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c6cf0' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="3"/>
                        <circle cx="12" cy="17" r="1" fill={active ? '#7c6cf0' : 'currentColor'}/>
                      </svg>
                    ),
                    label: 'Tel ile',
                  },
                ].map(m => {
                  const active = authMethod === m.id;
                  return (
                    <button key={m.id} type="button"
                      onClick={() => { setAuthMethod(m.id); setError(''); }}
                      style={{
                        position: 'relative', flex: 1, zIndex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer',
                        color: active ? '#7c6cf0' : sub,
                        fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
                        transition: 'color 0.25s', letterSpacing: '0.2px',
                      }}>
                      {m.icon(active)}
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 'register' ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Name */}
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: iconColor('name'), transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input className="rv-input" type="text" placeholder="Adınız Soyadınız"
                    value={name} onChange={e => setName(e.target.value)}
                    onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    required style={inputBase} />
                </div>

                {authMethod === 'email' ? (
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: iconColor('email'), transition: 'color 0.2s', pointerEvents: 'none' }} />
                    <input className="rv-input" type="email" placeholder="E-posta adresiniz"
                      value={email} onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                      required style={inputBase} />
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: iconColor('phone'), transition: 'color 0.2s', pointerEvents: 'none' }} />
                    <input className="rv-input" type="tel" placeholder="+90 555 123 4567"
                      value={phone} onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                      required style={inputBase} />
                  </div>
                )}

                {/* Password */}
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: iconColor('password'), transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input className="rv-input" type={showPassword ? 'text' : 'password'} placeholder="Şifreniz (min. 8 karakter)"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    required minLength={8} style={{ ...inputBase, paddingRight: 46 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                    color: isDark ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                  }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {authMethod === 'phone' && (
                  <p style={{ margin: 0, color: sub, fontSize: 12, paddingLeft: 4 }}>
                    Uluslararası format: +90 ile başlayın. Kayıt sonrası SMS ile doğrulama yapılacak.
                  </p>
                )}

                {slowWarning && (
                  <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.1)', borderLeft: '3px solid #f59e0b', color: '#f59e0b', fontSize: 13, fontWeight: 500 }}>
                    ⏳ Sunucu ilk açılışta 30-60 saniye sürebilir. Lütfen bekleyin...
                  </div>
                )}
                {error && (
                  <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #ef4444', color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '16px',
                  background: loading ? 'rgba(124,108,240,0.6)' : 'linear-gradient(135deg, #7c6cf0, #6c5ce7)',
                  color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(124,108,240,0.3)', transition: 'transform 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                }}
                onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(124,108,240,0.4)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,108,240,0.3)'; }}
                >
                  {loading ? <><Loader2 size={20} className="spin" /> Hesabınız Oluşturuluyor...</> : <>Hemen Kaydol <ArrowRight size={20} /></>}
                </button>
              </form>

            ) : step === 'verify-phone' ? (
              /* ── SMS OTP verify ── */
              <form onSubmit={handleVerifyPhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: isDark ? 'rgba(124,108,240,0.05)' : '#f5f3ff', padding: 24, borderRadius: 16, border: '1px solid rgba(124,108,240,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <Phone size={32} color="#7c6cf0" style={{ marginBottom: 12 }} />
                  <h3 style={{ margin: '0 0 8px', color: text, fontSize: 20 }}>Telefonunuzu Doğrulayın</h3>
                  <p style={{ margin: 0, color: sub, fontSize: 14 }}>
                    <b>{phone}</b> numarasına 6 haneli SMS kodu gönderdik.
                  </p>
                </div>
                <input type="text" placeholder="6 Haneli SMS Kodu"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required
                  style={{ ...inputBase, textAlign: 'center', letterSpacing: '8px', fontSize: 20, fontWeight: 700, padding: '16px' }} />
                {error && <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>}
                <button type="submit" disabled={loading || otp.length !== 6} style={{
                  width: '100%', padding: '16px', marginTop: 8,
                  background: (loading || otp.length !== 6) ? 'rgba(124,108,240,0.5)' : '#7c6cf0',
                  color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, fontSize: 16, cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {loading ? <Loader2 size={20} className="spin" /> : 'Doğrula ve Giriş Yap'}
                </button>
                <button type="button" onClick={() => { setStep('register'); setOtp(''); }} style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', marginTop: 8 }}>
                  Geri Dön
                </button>
              </form>

            ) : (
              /* ── Email OTP verify ── */
              <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: isDark ? 'rgba(0,212,170,0.05)' : '#f0fdfa', padding: 24, borderRadius: 16, border: `1px solid rgba(0,212,170,0.2)` }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <Mail size={32} color="#00d4aa" style={{ marginBottom: 12 }} />
                  <h3 style={{ margin: '0 0 8px', color: text, fontSize: 20 }}>E-postanızı Doğrulayın</h3>
                  <p style={{ margin: 0, color: sub, fontSize: 14 }}>
                    <b>{email}</b> adresine 6 haneli bir kod gönderdik. Lütfen kodu aşağıya girin.
                  </p>
                </div>

                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="6 Haneli Kod"
                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} required
                    style={{ ...inputBase, textAlign: 'center', letterSpacing: '8px', fontSize: 20, fontWeight: 700, padding: '16px' }} />
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>{error}</div>
                )}

                <button type="submit" disabled={loading || otp.length !== 6} style={{
                  width: '100%', padding: '16px', marginTop: 8,
                  background: (loading || otp.length !== 6) ? 'rgba(0,212,170,0.6)' : '#00d4aa',
                  color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700, fontSize: 16, cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {loading ? <Loader2 size={20} className="spin" /> : 'Doğrula ve Giriş Yap'}
                </button>

                <button type="button" onClick={() => setStep('register')} style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', marginTop: 8 }}>
                  Geri Dön (E-postayı Değiştir)
                </button>
              </form>
            )}

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
              <div className="rv-divider" />
              <span style={{ fontSize: 12, fontWeight: 600, color: sub, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>
                veya şununla kayıt ol
              </span>
              <div className="rv-divider" />
            </div>

            {/* Social */}
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
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'; }}
              >
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
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = isDark ? 'rgba(10, 102, 194, 0.15)' : '#f1f5f9'; }}
              >
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
              Zaten hesabınız var mı?{' '}
              <button onClick={() => onNavigate('login')} style={{
                background: 'none', border: 'none', padding: 0,
                color: '#7c6cf0', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: 15,
              }}>
                Giriş Yapın →
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - BRANDING */}
        <div className="split-brand">
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,108,240,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          
          <div style={{ maxWidth: 500, position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', borderRadius: 50,
              background: 'rgba(124,108,240,0.15)',
              border: '1px solid rgba(124,108,240,0.2)',
              color: '#7c6cf0', fontWeight: 700, fontSize: 13,
              letterSpacing: 0.5, marginBottom: 32,
            }}>
              <Sparkles size={15} /> Harika Bir Başlangıç
            </div>

            <h1 style={{
              margin: '0 0 20px', fontSize: 44, fontWeight: 900,
              lineHeight: 1.15, color: isDark ? '#fff' : '#0f172a',
              letterSpacing: '-1px',
            }}>
              Geleceğine<br />
              <span style={{
                background: 'linear-gradient(135deg, #7c6cf0 30%, #00d4aa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Yatırım Yap.</span>
            </h1>

            <p style={{ margin: '0 0 40px', fontSize: 16, lineHeight: 1.7, color: sub, maxWidth: 400 }}>
              Milyonlarca öğrencinin ve binlerce uzman eğitmenin buluştuğu global ağa katılın.
            </p>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
              {[
                { v: '50K+',   l: 'Öğrenci' },
                { v: '8.500+', l: 'Sertifika' },
                { v: '4.9★',   l: 'Ortalama Puan' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
                  borderRadius: 16, padding: '16px 24px',
                }}>
                  <div style={{ fontWeight: 800, fontSize: 24, color: isDark ? '#fff' : '#0f172a', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: sub, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Rotating testimonial */}
            <div key={testiIdx} className="rv-testi" style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
              border: `1px solid ${bdr}`,
              borderRadius: 20, padding: 24,
              boxShadow: isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: isDark ? '#cbd5e1' : '#334155', marginBottom: 20, fontStyle: 'italic' }}>
                {testi.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: testi.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 15, color: '#fff',
                }}>{testi.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#fff' : '#0f172a' }}>{testi.name}</div>
                  <div style={{ fontSize: 13, color: sub }}>{testi.role}</div>
                </div>
              </div>
              {/* Dots */}
              <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
                {TESTIMONIALS.map((_, i) => (
                  <div key={i} onClick={() => setTestiIdx(i)} style={{
                    width: i === testiIdx ? 24 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
                    background: i === testiIdx
                      ? '#7c6cf0'
                      : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                    transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
