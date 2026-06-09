import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Badge, Card, Tag } from '../components/PageBlocks';
import { Rocket, BarChart, Settings, Smartphone, Map, Users, Star, Lock, Clock, BookOpen } from 'lucide-react';

const ROADMAPS = [
  {
    id: "fullstack", title: "Full Stack Developer", icon: <Rocket size={32} />, color: "#10b981", desc: "Frontend'den backend'e, veritabanından deployment'a tam yol haritası.",
    duration: "6 ay", courses: 12, hours: 180, enrolled: 18450, rating: 4.9,
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    steps: [
      { title: "Web Temelleri", sub: "HTML, CSS, Responsive Design", status: "done", courses: 2, hours: 24 },
      { title: "JavaScript Mastery", sub: "ES6+, DOM, Async/Await", status: "done", courses: 2, hours: 32 },
      { title: "React & Next.js", sub: "Components, Hooks, SSR, SSG", status: "current", courses: 3, hours: 48 },
      { title: "Backend: Node.js", sub: "Express, REST API, Auth", status: "locked", courses: 2, hours: 36 },
      { title: "Veritabanı", sub: "MongoDB, PostgreSQL, ORM", status: "locked", courses: 2, hours: 24 },
      { title: "DevOps & Deploy", sub: "Docker, CI/CD, AWS", status: "locked", courses: 1, hours: 16 },
    ]
  },
  {
    id: "datascience", title: "Data Scientist", icon: <BarChart size={32} />, color: "#6366f1", desc: "Veri analizinden makine öğrenmesine kapsamlı kariyer yolu.",
    duration: "8 ay", courses: 10, hours: 220, enrolled: 12300, rating: 4.8,
    skills: ["Python", "Pandas", "NumPy", "SQL", "TensorFlow", "Tableau", "Statistics", "ML"],
    steps: [
      { title: "Python Temelleri", sub: "Değişkenler, Fonksiyonlar, OOP", status: "done", courses: 1, hours: 42 },
      { title: "Veri Analizi", sub: "Pandas, NumPy, Matplotlib", status: "current", courses: 2, hours: 48 },
      { title: "İstatistik & Olasılık", sub: "Hipotez testi, Dağılımlar", status: "locked", courses: 2, hours: 36 },
      { title: "Makine Öğrenmesi", sub: "Regression, Classification, Clustering", status: "locked", courses: 3, hours: 56 },
      { title: "Derin Öğrenme", sub: "Neural Networks, CNN, RNN", status: "locked", courses: 2, hours: 38 },
    ]
  },
  {
    id: "devops", title: "DevOps Engineer", icon: <Settings size={32} />, color: "#06b6d4", desc: "CI/CD, konteynerizasyon ve bulut altyapı uzmanlığı.",
    duration: "5 ay", courses: 8, hours: 140, enrolled: 7650, rating: 4.7,
    skills: ["Linux", "Docker", "Kubernetes", "Terraform", "AWS", "Jenkins", "Prometheus", "Git"],
    steps: [
      { title: "Linux & Networking", sub: "Komut satırı, SSH, TCP/IP", status: "done", courses: 1, hours: 20 },
      { title: "Git & CI/CD", sub: "GitHub Actions, Jenkins", status: "done", courses: 1, hours: 18 },
      { title: "Docker & Containers", sub: "Dockerfile, Compose, Registry", status: "current", courses: 2, hours: 32 },
      { title: "Kubernetes", sub: "Pods, Services, Deployments", status: "locked", courses: 2, hours: 36 },
      { title: "Cloud & IaC", sub: "AWS, Terraform, Monitoring", status: "locked", courses: 2, hours: 34 },
    ]
  },
  {
    id: "mobile", title: "Mobil Geliştirici", icon: <Smartphone size={32} />, color: "#8b5cf6", desc: "Flutter ve React Native ile cross-platform uygulama geliştirme.",
    duration: "5 ay", courses: 7, hours: 130, enrolled: 9200, rating: 4.8,
    skills: ["Dart", "Flutter", "React Native", "Firebase", "REST API", "State Management"],
    steps: [
      { title: "Dart Temelleri", sub: "Syntax, OOP, Async", status: "locked", courses: 1, hours: 18 },
      { title: "Flutter UI", sub: "Widgets, Layout, Navigation", status: "locked", courses: 2, hours: 32 },
      { title: "State Management", sub: "Provider, Riverpod, BLoC", status: "locked", courses: 1, hours: 20 },
      { title: "Backend Entegrasyon", sub: "Firebase, REST API, Auth", status: "locked", courses: 2, hours: 36 },
      { title: "Yayınlama", sub: "App Store, Play Store, CI/CD", status: "locked", courses: 1, hours: 14 },
    ]
  },
];

export default function RoadmapsView({ onNavigate }) {
  const { isDark, palette } = useTheme();
  const [selected, setSelected] = useState(null);
  const rm = selected !== null ? ROADMAPS[selected] : null;

  const C = {
    navBg: isDark ? "#0f172a" : "#ffffff",
    pageBg: isDark ? "#0a0f1d" : "#f1f5f9",
    white: isDark ? "#1e293b" : "#ffffff",
    primary: palette.accent,
    heading: isDark ? "#f8fafc" : "#0f172a",
    body: isDark ? "#cbd5e1" : "#334155",
    muted: isDark ? "#94a3b8" : "#64748b",
    faint: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
    shadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 25px -3px rgba(0,0,0,0.08)",
    font: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
  };

  return (
    <>
      <GlobalNavbar activePage="roadmaps" onNavigate={onNavigate} />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: C.pageBg, padding: '120px 5% 60px', color: C.body, fontFamily: C.font }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            borderRadius: 24, padding: "40px 36px", marginBottom: 32, position: "relative", overflow: "hidden",
            background: `linear-gradient(135deg, ${isDark ? '#0f172a' : '#1e293b'}, ${isDark ? '#020617' : '#0f172a'})`,
            boxShadow: C.shadowLg
          }}>
            <div style={{ position: "absolute", bottom: -30, right: 60, width: 200, height: 200, borderRadius: "50%", background: "#6366f1", filter: "blur(120px)", opacity: .1 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Map size={36} color="#f8fafc" />
                <h1 style={{ fontFamily: C.font, fontSize: 36, fontWeight: 900, color: "#f8fafc", margin: 0 }}>Kariyer Yol Haritaları</h1>
              </div>
              <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 560, lineHeight: 1.6 }}>Hedef mesleğini seç, adım adım ilerle. Her yol haritası sektör uzmanlarıyla birlikte tasarlandı ve gerçek iş ilanlarından türetildi.</p>
            </div>
          </div>

          {selected === null ? (
            <div className="fade-in-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
              {ROADMAPS.map((rmItem, i) => (
                <Card key={rmItem.id} onClick={() => setSelected(i)} style={{ padding: 0, overflow: "hidden", border: `1px solid ${C.border}` }} C={C}>
                  <div style={{ height: 6, background: rmItem.color }} />
                  <div style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: `${rmItem.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: `inset 0 0 0 1px ${rmItem.color}20` }}>{rmItem.icon}</div>
                      <div>
                        <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 800, color: C.heading }}>{rmItem.title}</h3>
                        <div style={{ display: "flex", gap: 10, fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 500 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {rmItem.duration}</span>
                          <span style={{opacity: 0.5}}>|</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} /> {rmItem.courses} kurs</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: C.body, lineHeight: 1.6, marginBottom: 20 }}>{rmItem.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
                      {rmItem.skills.slice(0, 6).map(s => <Tag key={s} color={rmItem.color}>{s}</Tag>)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", gap: 16, fontSize: 14, color: C.muted, fontWeight: 600 }}>
                        <span style={{display: 'flex', alignItems: 'center', gap: 6}}><Users size={16} /> {rmItem.enrolled.toLocaleString("tr-TR")}</span>
                        <span style={{display: 'flex', alignItems: 'center', gap: 6}}><Star size={16} fill="currentColor" color={C.gold || '#f59e0b'} /> {rmItem.rating}</span>
                      </div>
                      <button onClick={() => onNavigate('courses')} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: rmItem.color, color: "#fff", fontFamily: C.font, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: 'transform 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>İncele →</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="fade-in-right">
              <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.primary, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.font, marginBottom: 32, padding: 0 }}>← Tüm Yol Haritaları</button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 20, background: `${rm.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: `inset 0 0 0 1px ${rm.color}30` }}>{rm.icon}</div>
                    <div>
                      <h2 style={{ fontFamily: C.font, fontSize: 32, fontWeight: 800, color: C.heading, marginBottom: 8 }}>{rm.title}</h2>
                      <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6 }}>{rm.desc}</p>
                    </div>
                  </div>

                  <div style={{ position: "relative", paddingLeft: 48 }}>
                    <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 4, background: C.border, borderRadius: 2 }} />

                    {rm.steps.map((step, i) => {
                      const done = step.status === "done";
                      const current = step.status === "current";
                      const dotColor = done ? C.primary : current ? rm.color : C.faint;
                      return (
                        <div key={i} style={{ position: "relative", marginBottom: i < rm.steps.length - 1 ? 24 : 0 }}>
                          <div style={{
                            position: "absolute", left: -36, top: 20, width: 24, height: 24, borderRadius: "50%",
                            background: done ? C.primary : current ? rm.color : C.white,
                            border: `4px solid ${dotColor}`, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: "#fff", fontWeight: 800, zIndex: 2,
                            boxShadow: current ? `0 0 0 6px ${rm.color}20` : "none",
                          }}>{done ? "✓" : i + 1}</div>

                          <Card hover={!!(done || current)} style={{
                            padding: 24, marginLeft: 16,
                            borderLeft: `4px solid ${dotColor}`,
                            opacity: step.status === "locked" ? 0.6 : 1,
                          }} C={C}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                  <h4 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, color: C.heading }}>{step.title}</h4>
                                  {done && <Badge color={C.primary}>✓ Tamamlandı</Badge>}
                                  {current && <Badge color={rm.color} filled>Devam Ediyor</Badge>}
                                  {step.status === "locked" && <Badge color={C.faint}><span style={{display: 'flex', alignItems: 'center', gap: 4}}><Lock size={12}/> Kilitli</span></Badge>}
                                </div>
                                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{step.sub}</p>
                              </div>
                              <div style={{ textAlign: "right", fontSize: 13, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
                                <div style={{marginBottom: 4}}>{step.courses} kurs</div>
                                <div>{step.hours} saat</div>
                              </div>
                            </div>
                            {current && (
                              <button onClick={() => onNavigate('courses')} style={{
                                marginTop: 20, padding: "12px 28px", borderRadius: 12, border: "none",
                                background: rm.color, color: "#fff", fontFamily: C.font, fontSize: 14, fontWeight: 700, cursor: "pointer",
                                boxShadow: `0 4px 12px ${rm.color}40`, transition: 'transform 0.2s'
                              }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>▶ Derse Devam Et</button>
                            )}
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ position: "sticky", top: 100 }}>
                  <Card hover={false} style={{ padding: 24, marginBottom: 24 }} C={C}>
                    <h4 style={{ fontFamily: C.font, fontSize: 16, fontWeight: 800, color: C.heading, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} /> Yol Haritası Bilgileri</h4>
                    {[
                      { l: "Süre", v: rm.duration }, { l: "Toplam Kurs", v: rm.courses },
                      { l: "Toplam Saat", v: `${rm.hours} saat` }, { l: "Kayıtlı", v: rm.enrolled.toLocaleString("tr-TR") },
                      { l: "Puan", v: <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Star size={14} fill="#f59e0b" color="#f59e0b"/> {rm.rating}</span> },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", fontSize: 14 }}>
                        <span style={{ color: C.muted, fontWeight: 500 }}>{r.l}</span>
                        <span style={{ fontWeight: 700, color: C.heading }}>{r.v}</span>
                      </div>
                    ))}
                  </Card>
                  <Card hover={false} style={{ padding: 24 }} C={C}>
                    <h4 style={{ fontFamily: C.font, fontSize: 16, fontWeight: 800, color: C.heading, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={18} /> Kazanacağın Beceriler</h4>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {rm.skills.map(s => <Tag key={s} color={rm.color}>{s}</Tag>)}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
