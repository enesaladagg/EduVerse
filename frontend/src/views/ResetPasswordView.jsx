import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ResetPasswordView({ token, onNavigate }) {
  const { isDark } = useTheme();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.background = isDark ? '#0e1628' : '#ffffff';
    return () => { document.body.style.background = ''; };
  }, [isDark]);

  const text = isDark ? '#f1f5f9' : '#0f172a';
  const sub  = isDark ? '#94a3b8' : '#64748b';
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const card = isDark ? '#0e1628' : '#ffffff';

  const inputStyle = {
    width: '100%',
    padding: '14px 46px 14px 46px',
    background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border: `1.5px solid ${bdr}`,
    borderRadius: 12,
    color: text,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      return setError('Şifre en az 8 karakter olmalıdır.');
    }
    if (password !== confirm) {
      return setError('Şifreler eşleşmiyor.');
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => onNavigate('home'), 2500);
    } else {
      setError(result.message || 'Geçersiz veya süresi dolmuş bağlantı.');
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 2
    : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#00d4aa'];
  const strengthLabels = ['', 'Zayıf', 'Orta', 'Güçlü'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        .rp-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 16px 40px; background: ${card}; font-family: 'Outfit', sans-serif; }
        .rp-card { width: 100%; max-width: 440px; }
        .rp-input:focus { border-color: #7c6cf0 !important; background: ${isDark ? 'rgba(124,108,240,0.05)' : '#fff'} !important; box-shadow: 0 0 0 4px rgba(124,108,240,0.1) !important; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.8)} 100%{opacity:1;transform:scale(1)} }
      `}</style>

      <GlobalNavbar activePage="login" onNavigate={onNavigate} />

      <div className="rp-container">
        <div className="rp-card">

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1)', width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,212,170,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={44} color="#00d4aa" />
              </div>
              <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 900, color: text }}>Şifre Güncellendi!</h2>
              <p style={{ margin: '0 0 8px', color: sub, fontSize: 16, lineHeight: 1.6 }}>Şifreniz başarıyla değiştirildi.</p>
              <p style={{ color: sub, fontSize: 14 }}>Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(124,108,240,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShieldCheck size={32} color="#7c6cf0" />
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: text }}>Yeni Şifre Belirle</h2>
                <p style={{ margin: 0, color: sub, fontSize: 15 }}>En az 8 karakter içeren güçlü bir şifre seçin.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* New Password */}
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8', pointerEvents: 'none' }} />
                  <input className="rp-input" type={showPassword ? 'text' : 'password'} placeholder="Yeni şifreniz"
                    value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', padding: 4 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Strength indicator */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColors[strength] : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'), transition: 'background 0.3s' }} />
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 600, color: strengthColors[strength], marginLeft: 8, minWidth: 36 }}>{strengthLabels[strength]}</span>
                  </div>
                )}

                {/* Confirm Password */}
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8', pointerEvents: 'none' }} />
                  <input className="rp-input" type={showConfirm ? 'text' : 'password'} placeholder="Şifreyi tekrar girin"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={inputStyle} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', padding: 4 }}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirm.length > 0 && (
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: password === confirm ? '#00d4aa' : '#ef4444' }}>
                    {password === confirm ? '✓ Şifreler eşleşiyor' : '✗ Şifreler eşleşmiyor'}
                  </p>
                )}

                {error && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '16px', marginTop: 4,
                  background: loading ? 'rgba(124,108,240,0.6)' : 'linear-gradient(135deg, #7c6cf0, #6c5ce7)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(124,108,240,0.3)', boxSizing: 'border-box',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(124,108,240,0.4)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,108,240,0.3)'; }}
                >
                  {loading ? <><Loader2 size={20} className="spin" /> Güncelleniyor...</> : 'Şifremi Güncelle'}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button type="button" onClick={() => onNavigate('login')}
                  style={{ background: 'none', border: 'none', color: sub, fontSize: 14, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                  Giriş sayfasına dön
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
