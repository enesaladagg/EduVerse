import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function RegisterView({ onNavigate }) {
  const { palette: p, tokens: t } = useTheme();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(form);
    setLoading(false);
    if (result.success) onNavigate('home');
    else setError(result.message);
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: t.spacing[8] }}>
      <Card variant="elevated" style={{ background: p.panel, border: `1px solid ${p.border}` }}>
        <h1 style={{ margin: `0 0 ${t.spacing[6]}`, color: p.text, fontSize: t.typography.fontSize['2xl'] }}>
          Kayıt Ol
        </h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
          <Input label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="E-posta" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Şifre" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <label style={{ color: p.text, fontSize: t.typography.fontSize.sm }}>
            Rol
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{
                display: 'block',
                width: '100%',
                marginTop: t.spacing[2],
                padding: t.spacing[3],
                borderRadius: t.borderRadius.md,
                border: `1px solid ${p.border}`,
                background: p.panelElevated,
                color: p.text,
              }}
            >
              <option value="student">Öğrenci</option>
              <option value="teacher">Eğitmen</option>
            </select>
          </label>
          {error && <p style={{ color: p.live, margin: 0, fontSize: t.typography.fontSize.sm }}>{error}</p>}
          <Button type="submit" variant="primary" fullWidth loading={loading}>Kayıt Ol</Button>
        </form>
        <p style={{ marginTop: t.spacing[4], color: p.textMuted, fontSize: t.typography.fontSize.sm }}>
          Zaten hesabınız var mı?{' '}
          <button type="button" onClick={() => onNavigate('login')} style={{ color: p.accent, background: 'none', border: 'none', cursor: 'pointer' }}>
            Giriş yapın
          </button>
        </p>
      </Card>
    </div>
  );
}
