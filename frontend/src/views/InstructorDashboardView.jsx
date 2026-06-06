import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import {
  Users, BookOpen, DollarSign, TrendingUp,
  MessageCircle, Star, Video, Activity,
  Clock, CheckCircle, ChevronRight
} from 'lucide-react';

const STATS = [
  { label: 'Toplam Öğrenci', value: '1,284', icon: Users, color: '#00d4aa', trend: '+12% bu ay' },
  { label: 'Aktif Kurslar', value: '4', icon: BookOpen, color: '#7C5CFC', trend: 'Stabil' },
  { label: 'Aylık Gelir', value: '₺24,500', icon: DollarSign, color: '#f59e0b', trend: '+8% bu ay' },
  { label: 'Ort. Değerlendirme', value: '4.8/5', icon: Star, color: '#f43f5e', trend: 'Son 30 gün: 4.9' },
];

const RECENT_SALES = [
  { id: 1, student: 'Ahmet Yılmaz', course: 'React & Next.js Full Stack', date: '2 saat önce', price: '₺450' },
  { id: 2, student: 'Elif Kaya', course: 'UI/UX Tasarım Masterclass', date: '4 saat önce', price: '₺320' },
  { id: 3, student: 'Mehmet Demir', course: 'Python ile Veri Bilimi', date: '1 gün önce', price: '₺380' },
];

const UPCOMING_LIVES = [
  { id: 1, title: 'React Hooks Soru & Cevap', time: 'Bugün, 20:00', students: 45 },
  { id: 2, title: 'UI/UX Portfolyo İncelemesi', time: 'Yarın, 19:30', students: 112 },
];

export default function InstructorDashboardView({ onNavigate }) {
  const { isDark, theme } = useTheme();
  
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
              Hoş geldin, Dr. Ahmet Yılmaz! İşte genel performans özetin.
            </p>
          </div>
          <button style={{
            background: `linear-gradient(135deg, ${p.accent}, #0bc5e8)`,
            color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12,
            fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 8px 24px ${p.accent}40`
          }}>
            <Video size={18} /> Yeni Canlı Ders Oluştur
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
    </div>
  );
}
