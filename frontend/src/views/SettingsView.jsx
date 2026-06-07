import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { 
  User, Lock, CreditCard, Bell, 
  Save, Shield, Smartphone, Mail,
  Camera, CheckCircle
} from 'lucide-react';
import api from '../services/api';

export default function SettingsView({ onNavigate }) {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    company: '',
    address: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'personal') {
        const response = await api.updateMe({ name: formData.name });
        if (response.success && updateUser) {
          updateUser({ name: response.data.name, avatar: response.data.profilePicture });
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && updateUser) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await api.updateMe({ profilePicture: reader.result });
          if (response.success) {
            updateUser({ avatar: response.data.profilePicture });
          }
        } catch (err) {
          console.error("Avatar upload error:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: User },
    { id: 'security', label: 'Şifre & Güvenlik', icon: Lock },
    { id: 'billing', label: 'Fatura & Ödeme', icon: CreditCard },
    { id: 'notifications', label: 'Bildirimler', icon: Bell }
  ];

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
    color: isDark ? '#fff' : '#1e293b',
    fontSize: 15,
    fontFamily: '"Inter", sans-serif',
    marginTop: 6
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: isDark ? '#cbd5e1' : '#475569',
    marginBottom: 4
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <GlobalNavbar activePage="settings" onNavigate={onNavigate} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 60px', display: 'flex', gap: 40 }}>
        
        {/* SIDEBAR TABS */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Ayarlar</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 20px', borderRadius: 12,
                  background: activeTab === tab.id 
                    ? (isDark ? 'rgba(0,212,170,0.1)' : '#e6fbf7') 
                    : 'transparent',
                  color: activeTab === tab.id 
                    ? '#00d4aa' 
                    : (isDark ? '#94a3b8' : '#64748b'),
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: 15,
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ 
          flex: 1, 
          background: isDark ? '#1e293b' : '#fff',
          borderRadius: 24,
          padding: 40,
          boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
        }}>
          
          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div style={{ animation: 'slideDownFade 0.3s ease' }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                Kişisel Bilgiler
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 800, color: '#fff', position: 'relative'
                }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user?.avatarInitials || 'EA'
                  )}
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarChange} 
                  />
                  <button 
                    onClick={() => document.getElementById('avatar-upload').click()}
                    style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#1e293b', border: '2px solid #fff',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Profil Fotoğrafı</h3>
                  <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontSize: 14 }}>PNG veya JPG. Max 2MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Ad Soyad</label>
                  <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>E-posta Adresi</label>
                  <input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Telefon Numarası</label>
                  <input type="tel" style={inputStyle} placeholder="+90 555 000 0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Meslek / Ünvan</label>
                  <input type="text" style={inputStyle} placeholder="Örn: Frontend Developer" />
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Hakkımda (Biyografi)</label>
                <textarea style={{...inputStyle, height: 100, resize: 'vertical'}} placeholder="Kendinizden kısaca bahsedin..."></textarea>
              </div>

            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div style={{ animation: 'slideDownFade 0.3s ease' }}>
               <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                Şifre & Güvenlik
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 500, marginBottom: 40 }}>
                <div>
                  <label style={labelStyle}>Mevcut Şifre</label>
                  <input type="password" style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Yeni Şifre</label>
                  <input type="password" style={inputStyle} placeholder="En az 8 karakter" />
                </div>
                <div>
                  <label style={labelStyle}>Yeni Şifre (Tekrar)</label>
                  <input type="password" style={inputStyle} placeholder="Şifrenizi doğrulayın" />
                </div>
              </div>

              <div style={{
                padding: 24, borderRadius: 16, background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                display: 'flex', alignItems: 'flex-start', gap: 16
              }}>
                <Shield size={24} style={{ color: '#3b82f6', marginTop: 4 }} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#bfdbfe' : '#1e3a8a', margin: '0 0 8px 0' }}>İki Adımlı Doğrulama (2FA)</h3>
                  <p style={{ margin: '0 0 16px 0', color: isDark ? '#93c5fd' : '#1e40af', fontSize: 14, lineHeight: 1.5 }}>
                    Hesabınızı güvende tutmak için ekstra bir güvenlik katmanı ekleyin.
                  </p>
                  <button style={{
                    background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px',
                    borderRadius: 8, fontWeight: 600, cursor: 'pointer'
                  }}>Aktifleştir</button>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div style={{ animation: 'slideDownFade 0.3s ease' }}>
               <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                Fatura & Ödeme Bilgileri
              </h2>

              <div style={{
                border: `1px dashed ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 40
              }}>
                <CreditCard size={32} style={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: 16 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px 0' }}>Kayıtlı Kart Bulunamadı</h3>
                <p style={{ margin: '0 0 16px 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: 14 }}>Hızlı ödeme için bir kredi kartı ekleyebilirsiniz.</p>
                <button style={{
                  background: 'transparent', color: '#00d4aa', border: '1px solid #00d4aa', 
                  padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer'
                }}>+ Yeni Kart Ekle</button>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Fatura Adresi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Adres</label>
                  <textarea style={{...inputStyle, height: 80, resize: 'vertical'}} placeholder="Açık adresiniz..."></textarea>
                </div>
                <div>
                  <label style={labelStyle}>Ülke</label>
                  <input type="text" style={inputStyle} defaultValue="Türkiye" />
                </div>
                <div>
                  <label style={labelStyle}>Şehir</label>
                  <input type="text" style={inputStyle} placeholder="Örn: İstanbul" />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div style={{ animation: 'slideDownFade 0.3s ease' }}>
               <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                Bildirim Tercihleri
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { title: 'Ders Hatırlatıcıları', desc: 'Canlı ders başlamadan 15 dakika önce haber ver.', icon: Mail },
                  { title: 'Yeni Kurs Duyuruları', desc: 'İlgilendiğim kategorilerde yeni kurs eklendiğinde bildir.', icon: Bell },
                  { title: 'SMS Bildirimleri', desc: 'Önemli hesap hareketlerini telefonuma SMS olarak gönder.', icon: Smartphone }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: 24, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#94a3b8' : '#64748b'
                      }}>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>{item.desc}</p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <div style={{
                      width: 44, height: 24, borderRadius: 24, background: idx === 2 ? (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') : '#00d4aa',
                      position: 'relative', cursor: 'pointer'
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 2, left: idx === 2 ? 2 : 22,
                        transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div style={{ 
            marginTop: 40, paddingTop: 24, 
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16
          }}>
            {saveSuccess && (
              <span style={{ color: '#00d4aa', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, animation: 'slideDownFade 0.3s ease' }}>
                <CheckCircle size={16} /> Kaydedildi!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#00d4aa', color: '#fff', border: 'none',
                padding: '12px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(0,212,170,0.25)',
                transition: 'all 0.2s'
              }}
            >
              <Save size={18} />
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
