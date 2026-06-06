import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function LoginView({ onNavigate }) {
  const { palette: p, tokens: t } = useTheme();
  const { login } = useAuth();
  
  const [roleMode, setRoleMode] = useState('student');
  const [email, setEmail] = useState('student@demo.com');
  const [password, setPassword] = useState('Demo12345!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleMode === 'student') {
      setEmail('student@demo.com');
    } else {
      setEmail('teacher@demo.com');
    }
    setPassword('Demo12345!');
    setError('');
  }, [roleMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) onNavigate('home');
    else setError(result.message);
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: t.spacing[8] }}>
      
      <div style={{ display: 'flex', marginBottom: t.spacing[4], background: p.panel, borderRadius: 12, overflow: 'hidden', border: `1px solid ${p.border}` }}>
        <button
          type="button"
          onClick={() => setRoleMode('student')}
          style={{
            flex: 1, padding: '12px 0', border: 'none', background: roleMode === 'student' ? 'rgba(0,212,170,0.1)' : 'transparent',
            color: roleMode === 'student' ? p.accent : p.textMuted,
            fontWeight: roleMode === 'student' ? 600 : 500, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            borderBottom: roleMode === 'student' ? `2px solid ${p.accent}` : '2px solid transparent'
          }}
        >
          Öğrenci Girişi
        </button>
        <button
          type="button"
          onClick={() => setRoleMode('teacher')}
          style={{
            flex: 1, padding: '12px 0', border: 'none', background: roleMode === 'teacher' ? 'rgba(0,212,170,0.1)' : 'transparent',
            color: roleMode === 'teacher' ? p.accent : p.textMuted,
            fontWeight: roleMode === 'teacher' ? 600 : 500, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
            borderBottom: roleMode === 'teacher' ? `2px solid ${p.accent}` : '2px solid transparent'
          }}
        >
          Eğitmen Girişi
        </button>
      </div>

      <Card variant="elevated">
        <h1 style={{ margin: `0 0 ${t.spacing[2]}`, color: p.text, fontSize: t.typography.fontSize['2xl'] }}>
          {roleMode === 'student' ? 'Öğrenci Girişi' : 'Eğitmen Girişi'}
        </h1>
        <p style={{ color: p.textMuted, marginBottom: t.spacing[6], fontSize: t.typography.fontSize.sm }}>
          Demo: {roleMode === 'student' ? 'student@demo.com' : 'teacher@demo.com'} — şifre: Demo12345!
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
          <Input label="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: p.live, margin: 0, fontSize: t.typography.fontSize.sm }}>{error}</p>}
          <Button type="submit" variant="primary" fullWidth loading={loading}>Giriş Yap</Button>
        </form>
        <p style={{ marginTop: t.spacing[4], color: p.textMuted, fontSize: t.typography.fontSize.sm, textAlign: 'center' }}>
          Hesabınız yok mu?{' '}
          <button type="button" onClick={() => onNavigate('register')} style={{ color: p.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Kayıt olun
          </button>
        </p>
      </Card>
    </div>
  );
}
