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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

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
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Dosya boyutu 5MB\'ı geçemez.');
      return;
    }

    setAvatarUploading(true);
    setAvatarError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        const fullUrl = result.data.profilePictureUrl;
        if (updateUser) {
          updateUser({ avatar: fullUrl, profilePicture: fullUrl });
        }
      } else {
        setAvatarError(result.error?.message || 'Yükleme başarısız.');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setAvatarError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setAvatarUploading(false);
      // Input'u sıfırla (aynı dosyayı tekrar seçebilmek için)
      e.target.value = '';
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
    marginTop: 6,
    boxSizing: 'border-box'
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
      fontFamily: '"Outfit", sans-serif',
      boxSizing: 'border-box'
    }}>
      <GlobalNavbar activePage="settings" onNavigate={onNavigate} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 60px', display: 'flex', gap: 40, flexWrap: 'wrap', boxSizing: 'border-box' }}>
        
        {/* SIDEBAR TABS */}
        <div style={{ width: '100%', maxWidth: 280, flexShrink: 0, boxSizing: 'border-box' }}>
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
          flex: 1, minWidth: 300,
          background: isDark ? '#1e293b' : '#fff',
          borderRadius: 24,
          padding: '40px 5%',
          boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxSizing: 'border-box'
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
                  fontSize: 36, fontWeight: 800, color: '#fff', position: 'relative',
                  opacity: avatarUploading ? 0.6 : 1, transition: 'opacity 0.2s'
                }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user?.avatarInitials || 'EA'
                  )}
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/jpeg,image/jpg,image/png,image/webp" 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarChange} 
                  />
                  <button 
                    onClick={() => document.getElementById('avatar-upload').click()}
                    disabled={avatarUploading}
                    style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 32, height: 32, borderRadius: '50%',
                    background: avatarUploading ? '#64748b' : '#1e293b', border: '2px solid #fff',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: avatarUploading ? 'not-allowed' : 'pointer'
                  }}>
                    {avatarUploading ? (
                      <div style={{ width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Profil Fotoğrafı</h3>
                  <p style={{ margin: '0 0 6px 0', color: isDark ? '#94a3b8' : '#64748b', fontSize: 14 }}>JPG, PNG veya WEBP. Max 5MB.</p>
                  {avatarError && (
                    <p style={{ margin: 0, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>{avatarError}</p>
                  )}
                  {avatarUploading && (
                    <p style={{ margin: 0, color: '#00d4aa', fontSize: 13, fontWeight: 600 }}>Yükleniyor...</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 24 }}>
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

              {/* Danger Zone: Hesabı Sil */}
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)'}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Tehlikeli Bölge</h3>
                <p style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 16 }}>
                  Hesabınızı sildiğinizde geri dönüşü yoktur. Tüm ilerlemeleriniz, kurslarınız ve verileriniz kalıcı olarak silinecektir.
                </p>
                <button 
                  onClick={() => {
                    const pass = prompt("Hesabınızı silmek istediğinize emin misiniz? Devam etmek için şifrenizi girin:");
                    if (pass) {
                      alert("Hesap silme işlemi başlatıldı."); // Burada gerçek silme servisi çağrılabilir.
                      // api.deleteAccount({ password: pass }); 
                    }
                  }}
                  style={{
                    background: 'transparent', color: '#ef4444', border: '1px solid #ef4444',
                    padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                >
                  Hesabı Kalıcı Olarak Sil
                </button>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
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
