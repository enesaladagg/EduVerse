import React, { useState } from 'react';
import { Users, Wallet, Star, BookOpen, TrendingUp, Zap, BarChart2, MessageCircle, Mail, Video, X } from 'lucide-react';
import { C, font, mono, INSTRUCTOR_DATA, Card, SectionTitle, MiniChart, Badge, Stars } from '../components/EduVerseShared';

export default function InstructorView({ onNavigate }) {
  const d = INSTRUCTOR_DATA;
  const [liveModal, setLiveModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleCreateLive = () => {
    const code = 'EDU-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setLiveModal(true);
  };

  return (
    <div style={{ boxSizing: 'border-box', fontFamily: "'DM Sans', 'Outfit', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 5%", boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: `2px solid ${C.accent}` }}>{d.instructor.avatar}</div>
            <div>
              <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 800 }}>Eğitmen Paneli</h1>
              <p style={{ color: C.textSec, fontSize: 14 }}>Hoş geldin, {d.instructor.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleCreateLive} style={{ padding: "12px 20px", borderRadius: 14, border: `1px solid ${C.accent}`, background: `${C.accent}15`, color: C.accent, fontFamily: font, fontSize: 14, fontWeight: 700, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 8 }}>
              <Video size={18} /> Canlı Ders Başlat
            </button>
            <button onClick={() => alert("Kurs oluşturma modülü yapım aşamasındadır.")} style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: C.gradAccent, color: "white", fontFamily: font, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              + Yeni Kurs Oluştur
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
          {[
            { label: "Toplam Öğrenci", value: d.stats.totalStudents.toLocaleString("tr-TR"), icon: <Users size={28} />, color: C.accent },
            { label: "Toplam Gelir", value: `₺${(d.stats.totalRevenue / 1000).toFixed(0)}K`, icon: <Wallet size={28} />, color: C.gold },
            { label: "Ortalama Puan", value: d.stats.avgRating, icon: <Star size={28} />, color: C.gold },
            { label: "Aktif Kurs", value: d.stats.activeCourses, icon: <BookOpen size={28} />, color: C.purple },
            { label: "Tamamlama Oranı", value: `%${d.stats.completionRate}`, icon: <TrendingUp size={28} />, color: C.green },
            { label: "Yanıt Süresi", value: d.stats.responseTime, icon: <Zap size={28} />, color: C.blue },
          ].map((s, i) => (
            <Card key={i} hover={false} style={{ textAlign: "center", padding: "20px 16px" }}>
              <div style={{ marginBottom: 8, color: s.color, display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>{s.label}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
          {/* LEFT */}
          <div>
            {/* Revenue chart */}
            <Card hover={false} style={{ marginBottom: 28, padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center' }}><BarChart2 size={20} style={{marginRight: 8}} color={C.accent} /> Gelir Grafiği</h3>
                <Badge color={C.green}>+18% bu ay</Badge>
              </div>
              <MiniChart data={d.revenueChart} color={C.accent} height={120} />
            </Card>

            {/* Courses table */}
            <SectionTitle sub="Kurslarını yönet ve performansını takip et">Kurslarım</SectionTitle>
            <div style={{ borderRadius: 18, border: `1px solid ${C.border}`, overflowX: "auto", marginBottom: 28 }}>
              <div style={{ minWidth: 600 }}>
                {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 0.8fr 1fr 0.8fr", gap: 12, padding: "14px 20px", background: C.surface, fontSize: 12, fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <span>Kurs</span><span>Öğrenci</span><span>Puan</span><span>Gelir</span><span>Durum</span>
              </div>
              {d.courses.map((course, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 0.8fr 1fr 0.8fr", gap: 12, padding: "16px 20px", borderTop: `1px solid ${C.border}`, alignItems: "center", background: C.card, transition: "background 0.2s", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{course.title}</div>
                    <div style={{ fontSize: 12, color: C.textDim }}>{course.trend !== "—" && <span style={{ color: C.green }}>{course.trend} </span>}bu ay</div>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600 }}>{course.students.toLocaleString("tr-TR")}</span>
                  <span><Stars r={course.rating} size={11} /></span>
                  <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: C.gold }}>₺{(course.revenue / 1000).toFixed(0)}K</span>
                  <Badge color={course.status === "active" ? C.green : C.textDim}>{course.status === "active" ? "Yayında" : "Taslak"}</Badge>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            {/* Recent reviews */}
            <Card hover={false} style={{ marginBottom: 20, padding: 24 }}>
              <h3 style={{ fontFamily: font, fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center' }}><MessageCircle size={18} style={{marginRight: 8}} color={C.accent} /> Son Yorumlar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {d.recentReviews.map((rev, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 14, background: C.surface }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{rev.student}</span>
                      <span style={{ fontSize: 11, color: C.textDim }}>{rev.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>{rev.course}</div>
                    <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5, marginBottom: 8 }}>{rev.text}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stars r={rev.rating} size={10} />
                      {rev.replied ? <Badge color={C.green}>Yanıtlandı</Badge> : <button onClick={() => alert("Yanıt gönderme işlevi yapım aşamasındadır.")} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${C.accent}`, background: "transparent", color: C.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: font }}>Yanıtla</button>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Messages */}
            <Card hover={false} style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontFamily: font, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center' }}><Mail size={18} style={{marginRight: 8}} color={C.accent} /> Mesajlar</h3>
                <Badge color={C.warm}>{d.messages.filter(m => m.unread).length} yeni</Badge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, background: msg.unread ? C.accentDim : C.surface, border: `1px solid ${msg.unread ? C.borderActive : "transparent"}`, cursor: "pointer", transition: "all 0.3s" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: msg.unread ? C.accent : "transparent", marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{msg.from}</span>
                        <span style={{ fontSize: 11, color: C.textDim }}>{msg.time}</span>
                      </div>
                      <p style={{ fontSize: 12, color: C.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Live Class Modal */}
      {liveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: C.card, padding: 32, borderRadius: 24, maxWidth: 400, width: '100%', border: `1px solid ${C.border}`, position: 'relative' }}>
            <button onClick={() => setLiveModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: C.textDim, cursor: 'pointer' }}><X size={20} /></button>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${C.accent}15`, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Video size={32} />
            </div>
            <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Canlı Ders Oluşturuldu</h2>
            <p style={{ color: C.textSec, fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>Öğrencilerin derse katılabilmesi için aşağıdaki kodu onlarla paylaşın.</p>
            
            <div style={{ background: C.surface, border: `1px dashed ${C.accent}`, padding: 16, borderRadius: 12, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Oda Kodu</div>
              <div style={{ fontFamily: mono, fontSize: 32, fontWeight: 800, color: C.accent, letterSpacing: 4 }}>{roomCode}</div>
            </div>

            <button 
              onClick={() => {
                setLiveModal(false);
                if (onNavigate) onNavigate('live', { roomCode, isHost: true });
              }} 
              style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: C.gradAccent, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Derse Katıl
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
