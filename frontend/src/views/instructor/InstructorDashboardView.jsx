import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlobalNavbar from '../../components/GlobalNavbar';
import {
  Users, BookOpen, DollarSign, TrendingUp,
  MessageCircle, Star, Video, Activity,
  Clock, CheckCircle, ChevronRight, Copy, StopCircle, X
} from 'lucide-react';

// Statik kısımlar bileşen içine taşınacak

const RECENT_SALES = [
  { id: 1, student: 'Ahmet Yılmaz', course: 'React & Next.js Full Stack', date: '2 saat önce', price: '₺450' },
  { id: 2, student: 'Elif Kaya', course: 'UI/UX Tasarım Masterclass', date: '4 saat önce', price: '₺320' },
  { id: 3, student: 'Mehmet Demir', course: 'Python ile Veri Bilimi', date: '1 gün önce', price: '₺380' },
];

const UPCOMING_LIVES = [
  { id: 1, title: 'React Hooks Soru & Cevap', time: 'Bugün, 20:00', students: 45 },
  { id: 2, title: 'UI/UX Portfolyo İncelemesi', time: 'Yarın, 19:30', students: 112 },
];

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function InstructorDashboardView({ onNavigate }) {
  const { isDark, theme } = useTheme();
  const { user } = useAuth();
  
  const [statsData, setStatsData] = useState({ totalStudents: 0, totalCourses: 0, monthlyRevenue: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [liveModal, setLiveModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateLive = async () => {
    setCreateLoading(true);
    try {
      const result = await api.createLiveSession({
        title: 'Canlı Ders',
        courseId: '000000000000000000000000',
        scheduledAt: new Date().toISOString(),
        duration: 60,
        sessionType: 'lecture',
      });
      setRoomCode(result.data.roomId);
      setSessionId(result.data._id);
    } catch (err) {
      const code = 'EDU-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setRoomCode(code);
      setSessionId(null);
    } finally {
      setCreateLoading(false);
      setLiveModal(true);
    }
  };

  const handleEndSession = async () => {
    if (sessionId) { try { await api.endLiveSession(sessionId); } catch (_) {} }
    setLiveModal(false); setSessionId(null); setRoomCode('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.getInstructorStats();
        if (res.success) setStatsData(res.data);
      } catch (error) {
        console.error('Eğitmen istatistikleri çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const STATS = [
    { label: 'Toplam Öğrenci', value: loading ? '...' : statsData.totalStudents, icon: Users, color: '#00d4aa', trend: '+12% bu ay' },
    { label: 'Aktif Kurslar', value: loading ? '...' : statsData.totalCourses, icon: BookOpen, color: '#7C5CFC', trend: 'Stabil' },
    { label: 'Aylık Gelir', value: loading ? '...' : `₺${statsData.monthlyRevenue?.toLocaleString('tr-TR')}`, icon: DollarSign, color: '#f59e0b', trend: '+8% bu ay' },
    { label: 'Ort. Değerlendirme', value: loading ? '...' : `${statsData.averageRating}/5`, icon: Star, color: '#f43f5e', trend: 'Son 30 gün: ' + statsData.averageRating },
  ];
  
  // Eğitmen Paneli için özel koyu/açık palet
  const p = isDark ? {
    bg: '#04080f',
    surface: '#0c1a30',
    surfaceElevated: '#112240',
    border: 'rgba(14,240,178,0.15)',
    text: '#eef2ff',
    textMuted: '#94a3c8',
    accent: '#00d4aa'
  } : {
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#f1f5f9',
    border: 'rgba(0,184,148,0.2)',
    text: '#0f172a',
    textMuted: '#475569',
    accent: '#00b894'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: p.bg,
      color: p.text,
      fontFamily: "'Outfit', sans-serif"
    }}>
      <GlobalNavbar activePage="instructor" onNavigate={onNavigate} />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 5% 60px' }}>
        
        {/* Heder */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
              Eğitmen Paneli
            </h1>
            <p style={{ color: p.textMuted, fontSize: 16 }}>
              Hoş geldin, {user?.name || 'Eğitmen'}! İşte genel performans özetin.
            </p>
          </div>
          <button onClick={handleCreateLive} disabled={createLoading} style={{
            background: `linear-gradient(135deg, ${p.accent}, #0bc5e8)`,
            color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12,
            fontWeight: 600, fontSize: 15, cursor: createLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 8px 24px ${p.accent}40`, opacity: createLoading ? 0.7 : 1
          }}>
            <Video size={18} /> {createLoading ? 'Oluşturuluyor…' : 'Yeni Canlı Ders Oluştur'}
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: p.surface, border: `1px solid ${p.border}`, borderRadius: 20,
              padding: 24, position: 'relative', overflow: 'hidden', transition: 'transform 0.3s'
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: s.color, filter: 'blur(50px)', opacity: 0.15 }} />
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={22} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color, background: `${s.color}10`, padding: '4px 10px', borderRadius: 20 }}>
                  {s.trend}
                </span>
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{s.value}</h3>
              <p style={{ color: p.textMuted, fontSize: 14, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Chart Placeholder / Activity */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity size={20} color={p.accent} /> Satış ve Etkileşim Grafiği
                </h2>
                <select style={{ background: p.surfaceElevated, color: p.text, border: `1px solid ${p.border}`, padding: '6px 12px', borderRadius: 8, outline: 'none' }}>
                  <option>Bu Ay</option>
                  <option>Geçen Ay</option>
                  <option>Bu Yıl</option>
                </select>
              </div>
              <div style={{ height: 240, width: '100%', background: p.surfaceElevated, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.textMuted, border: `1px dashed ${p.border}` }}>
                {/* Buraya Recharts veya Chart.js eklenebilir */}
                Grafik Alanı (Veri Bekleniyor)
              </div>
            </div>

            {/* Recent Sales */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Son Kayıtlar / Satışlar</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {RECENT_SALES.map((sale) => (
                  <div key={sale.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: p.surfaceElevated, borderRadius: 14, border: `1px solid ${p.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: p.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {sale.student.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{sale.student}</div>
                        <div style={{ color: p.textMuted, fontSize: 13, marginTop: 2 }}>{sale.course}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: p.accent }}>{sale.price}</div>
                      <div style={{ color: p.textMuted, fontSize: 12, marginTop: 2 }}>{sale.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', marginTop: 16, padding: 12, background: 'transparent', border: `1px solid ${p.border}`, borderRadius: 12, color: p.text, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                Tümünü Gör
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Upcoming Live Sessions */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={20} color="#f43f5e" /> Yaklaşan Canlı Dersler
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {UPCOMING_LIVES.map((live) => (
                  <div key={live.id} style={{ display: 'flex', gap: 16, paddingBottom: 16, borderBottom: `1px solid ${p.border}` }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Video size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{live.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                        <span style={{ fontSize: 13, color: p.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {live.time}</span>
                        <span style={{ fontSize: 13, color: p.accent, display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {live.students} Kayıtlı</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Hızlı İşlemler</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Yeni Kurs Ekle', 'Öğrencilere Duyuru Yap', 'Ödevleri İncele', 'Gelir Raporu Çıkar'].map((action, i) => (
                  <button key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: p.surfaceElevated, border: 'none', borderRadius: 12, color: p.text, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={18} color={p.textMuted} /> {action}
                    </span>
                    <ChevronRight size={18} color={p.textMuted} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Canlı Ders Modal */}
      {liveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: p.surface, borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, border: `1px solid ${p.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Canlı Ders Oluşturuldu</h2>
              <button onClick={handleEndSession} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: p.textMuted }}><X size={20} /></button>
            </div>
            <p style={{ color: p.textMuted, fontSize: 14, marginBottom: 24 }}>Öğrencilerinizle bu kodu paylaşın.</p>
            <div style={{ background: isDark ? 'rgba(0,212,170,0.08)' : '#f0fdf9', border: `2px dashed ${p.accent}`, borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: p.textMuted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Oda Kodu</div>
              <div style={{ fontFamily: 'monospace', fontSize: 36, fontWeight: 900, color: p.accent, letterSpacing: 6 }}>{roomCode}</div>
            </div>
            <button onClick={handleCopyCode} style={{ width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${p.border}`, background: 'transparent', color: copied ? p.accent : p.textMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <Copy size={15} /> {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
            </button>
            <button onClick={() => { setLiveModal(false); if (onNavigate) onNavigate('live', { roomCode, isHost: true, sessionId }); }}
              style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${p.accent}, #0bc5e8)`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              Derse Katıl (Host) →
            </button>
            <button onClick={handleEndSession} style={{ width: '100%', padding: 12, borderRadius: 14, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <StopCircle size={16} /> Dersi Bitir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
