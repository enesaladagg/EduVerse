import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Badge, Card, Tag } from '../components/PageBlocks';
import { Globe, Flame, Sparkles, HelpCircle, MessageSquare, Eye, Heart, Trophy, Users, Calendar, Clock, Code2, Atom, Brain, Target, Wrench, Mic, Medal } from 'lucide-react';
import api from '../services/api';

const FORUM_TOPICS = [
  { title: "React 19'daki yeni Server Components nasıl çalışıyor?", author: "Burak K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burak&backgroundColor=b6e3f4", replies: 24, views: 1840, likes: 67, time: "2 saat önce", tags: ["React", "Frontend"], hot: true },
  { title: "Python ile Web Scraping: BeautifulSoup vs Scrapy karşılaştırması", author: "Merve T.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Merve&backgroundColor=c0aede", replies: 18, views: 1230, likes: 45, time: "5 saat önce", tags: ["Python", "Veri"], hot: false },
  { title: "Junior Developer olarak ilk iş görüşmesinde neler sorulur?", author: "Can Ö.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Can&backgroundColor=d1d4f9", replies: 42, views: 3450, likes: 128, time: "1 gün önce", tags: ["Kariyer", "İpucu"], hot: true },
  { title: "MongoDB vs PostgreSQL: Hangi projeye hangisi uygun?", author: "Selin A.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selin&backgroundColor=ffdfbf", replies: 31, views: 2100, likes: 76, time: "1 gün önce", tags: ["Veritabanı", "Backend"], hot: false },
  { title: "Docker öğrenmeye nereden başlamalıyım?", author: "Emre K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emre&backgroundColor=b6e3f4", replies: 15, views: 890, likes: 34, time: "2 gün önce", tags: ["DevOps", "Docker"], hot: false },
  { title: "Freelance yazılımcı olarak nasıl müşteri bulunur?", author: "Ayşe D.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse&backgroundColor=c0aede", replies: 56, views: 4200, likes: 189, time: "3 gün önce", tags: ["Kariyer", "Freelance"], hot: true },
];

const LEADERBOARD = [
  { rank: 1, name: "Burak Korkmaz", xp: 28450, streak: 42, level: 38, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Burak&backgroundColor=b6e3f4", badge: <Medal size={20} color="#fbbf24" fill="#f59e0b" /> },
  { rank: 2, name: "Merve Toprak", xp: 26800, streak: 35, level: 36, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Merve&backgroundColor=c0aede", badge: <Medal size={20} color="#94a3b8" fill="#cbd5e1" /> },
  { rank: 3, name: "Can Özdemir", xp: 24100, streak: 28, level: 34, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Can&backgroundColor=d1d4f9", badge: <Medal size={20} color="#b45309" fill="#d97706" /> },
  { rank: 4, name: "Selin Aydın", xp: 22650, streak: 21, level: 32, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selin&backgroundColor=ffdfbf", badge: "" },
  { rank: 5, name: "Emre Kılıç", xp: 21200, streak: 18, level: 31, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emre&backgroundColor=b6e3f4", badge: "" },
  { rank: 6, name: "Elif Yılmaz", xp: 12450, streak: 14, level: 24, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elif&backgroundColor=c0aede", badge: "← Sen", isMe: true },
];

const STUDY_GROUPS = [
  { name: "Python Çalışma Grubu", members: 156, active: 12, icon: <Code2 size={24} />, color: "#10b981", nextSession: "Bugün 20:00" },
  { name: "React Projeler", members: 98, active: 8, icon: <Atom size={24} />, color: "#6366f1", nextSession: "Yarın 19:00" },
  { name: "Algoritma Kulübü", members: 234, active: 18, icon: <Brain size={24} />, color: "#f59e0b", nextSession: "Çarşamba 21:00" },
  { name: "Kariyer Mentorluk", members: 312, active: 24, icon: <Target size={24} />, color: "#f43f5e", nextSession: "Cuma 18:00" },
];

const EVENTS = [
  { title: "Python ile Otomasyon Workshop", date: "12 Haziran", time: "20:00", type: "workshop", speaker: "Dr. Ahmet Yılmaz", spots: 45, color: "#10b981" },
  { title: "CV & Portfolio İnceleme", date: "15 Haziran", time: "19:00", type: "webinar", speaker: "HR Panel", spots: 120, color: "#6366f1" },
  { title: "Hackathon: AI Çözümleri", date: "20-22 Haziran", time: "Tüm gün", type: "hackathon", speaker: "Topluluk", spots: 200, color: "#f59e0b" },
];

export default function CommunityView({ onNavigate }) {
  const { isDark, palette } = useTheme();
  const [forumTab, setForumTab] = useState("hot");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCommunityPosts()
      .then(res => {
        setPosts(res.data || []);
      })
      .catch(err => console.error("Failed to fetch posts:", err))
      .finally(() => setLoading(false));
  }, [forumTab]);

  const handleNewPost = async () => {
    const title = prompt("Yeni konu başlığını giriniz:");
    if (!title) return;
    const content = prompt("Konu içeriği:");
    if (!content) return;
    
    try {
      await api.createCommunityPost({ title, content, tags: ['Genel', 'Soru'] });
      api.getCommunityPosts().then(res => setPosts(res.data || []));
    } catch (err) {
      alert("Gönderi paylaşılamadı: " + err.message);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yıl önce";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " ay önce";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " gün önce";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " saat önce";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " dakika önce";
    return Math.floor(seconds) + " saniye önce";
  };

  const C = {
    navBg: isDark ? "#0f172a" : "#ffffff",
    pageBg: isDark ? "#0a0f1d" : "#f1f5f9",
    white: isDark ? "#1e293b" : "#ffffff",
    primary: palette.accent,
    primaryDim: isDark ? "rgba(0,212,170,0.15)" : "rgba(0,212,170,0.08)",
    primaryBorder: isDark ? "rgba(0,212,170,0.3)" : "rgba(0,212,170,0.2)",
    heading: isDark ? "#f8fafc" : "#0f172a",
    body: isDark ? "#cbd5e1" : "#334155",
    muted: isDark ? "#94a3b8" : "#64748b",
    faint: isDark ? "#64748b" : "#94a3b8",
    gold: "#f59e0b",
    rose: "#f43f5e",
    border: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
    shadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 25px -3px rgba(0,0,0,0.08)",
    font: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
  };

  return (
    <>
      <GlobalNavbar activePage="community" onNavigate={onNavigate} />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: C.pageBg, padding: '120px 5% 60px', color: C.body, fontFamily: C.font }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            borderRadius: 24, padding: "40px 36px", marginBottom: 32, position: "relative", overflow: "hidden",
            background: `linear-gradient(135deg, ${isDark ? '#0f172a' : '#1e293b'}, ${isDark ? '#020617' : '#0f172a'})`,
            boxShadow: C.shadowLg
          }}>
            <div style={{ position: "absolute", top: -40, left: "40%", width: 250, height: 250, borderRadius: "50%", background: C.gold, filter: "blur(140px)", opacity: .08 }} />
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Globe size={36} color="#f8fafc" />
                  <h1 style={{ fontFamily: C.font, fontSize: 36, fontWeight: 900, color: "#f8fafc", margin: 0 }}>Topluluk</h1>
                </div>
                <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 480, lineHeight: 1.6 }}>Soru sor, paylaş, birlikte öğren. 50.000+ aktif üyeyle Türkiye'nin en büyük teknoloji öğrenme topluluğu.</p>
              </div>
              <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
                {[{ v: "50K+", l: "Üye" }, { v: "1.2K", l: "Çevrimiçi" }, { v: "15K+", l: "Konu" }].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: 16, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 800, color: C.primary }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            
            <div className="fade-in-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", gap: 4, background: C.white, borderRadius: 12, padding: 4, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                  {[
                    { k: "hot", l: "Gündem", icon: <Flame size={16} /> }, 
                    { k: "new", l: "Yeni", icon: <Sparkles size={16} /> }, 
                    { k: "unanswered", l: "Cevaplanmamış", icon: <HelpCircle size={16} /> }
                  ].map(t => (
                    <button key={t.k} onClick={() => setForumTab(t.k)} style={{
                      padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: C.font,
                      fontSize: 14, fontWeight: forumTab === t.k ? 700 : 600, transition: 'all 0.2s',
                      background: forumTab === t.k ? C.primaryDim : "transparent", color: forumTab === t.k ? C.primary : C.muted,
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      {t.icon} {t.l}
                    </button>
                  ))}
                </div>
                <button onClick={handleNewPost} style={{
                  padding: "12px 24px", borderRadius: 12, border: "none", background: C.primary, color: "#fff",
                  fontFamily: C.font, fontSize: 15, fontWeight: 800, cursor: "pointer", transition: 'all 0.2s',
                  boxShadow: `0 8px 16px ${C.primaryDim}`
                }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>+ Yeni Konu Aç</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {loading && <div style={{ color: C.muted, textAlign: 'center', padding: 40, background: C.white, borderRadius: 16, border: `1px dashed ${C.border}` }}>Yükleniyor...</div>}
                {!loading && posts.length === 0 && <div style={{ color: C.muted, textAlign: 'center', padding: 60, background: C.white, borderRadius: 16, border: `1px dashed ${C.border}`, fontSize: 16, fontWeight: 600 }}>Bu kategoride henüz gönderi bulunmuyor. İlk konuyu sen aç!</div>}
                {posts.map((topic, i) => {
                  const avatar = topic.author?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.author?.name}&backgroundColor=b6e3f4`;
                  return (
                  <Card key={topic._id || i} style={{ padding: 24 }} C={C}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: C.pageBg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, overflow: 'hidden' }}>
                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                          <h4 style={{ fontFamily: C.font, fontSize: 16, fontWeight: 800, color: C.heading, flex: 1, lineHeight: 1.4 }}>{topic.title}</h4>
                          {topic.likes?.length > 10 && <Badge color={C.rose}><span style={{display: 'flex', alignItems: 'center', gap: 4}}><Flame size={12}/> Gündem</span></Badge>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 14, color: C.muted, fontWeight: 600 }}>{topic.author?.name || 'Anonim'}</span>
                          <span style={{ fontSize: 13, color: C.faint }}>· {getTimeAgo(topic.createdAt)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {(topic.tags || []).map(t => <Tag key={t} color={C.primary}>{t}</Tag>)}
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 14, color: C.muted, fontWeight: 500 }}>
                            <span style={{display: 'flex', alignItems: 'center', gap: 6}}><MessageSquare size={16} /> {topic.comments?.length || 0}</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: 6}}><Eye size={16} /> {Math.floor(Math.random() * 1000) + 100}</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'}} onClick={async () => {
                              await api.likeCommunityPost(topic._id);
                              api.getCommunityPosts().then(res => setPosts(res.data || []));
                            }}><Heart size={16} color={topic.likes?.length > 0 ? C.rose : 'currentColor'} fill={topic.likes?.length > 0 ? C.rose : 'none'} /> {topic.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
            </div>

            <div className="fade-in-right" style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 100 }}>
              
              <Card hover={false} style={{ padding: 24 }} C={C}>
                <h3 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 900, color: C.heading, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Trophy size={20} color={C.gold} fill={C.gold} /> Liderlik Tablosu</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LEADERBOARD.map((u, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12,
                      background: u.isMe ? C.primaryDim : i < 3 ? `${C.gold}10` : "transparent",
                      border: `1px solid ${u.isMe ? C.primaryBorder : i < 3 ? `${C.gold}20` : "transparent"}`,
                    }}>
                      <span style={{ fontFamily: C.mono, fontSize: 14, fontWeight: 900, color: i < 3 ? C.gold : C.faint, width: 24, textAlign: "center" }}>
                        {u.badge || `${u.rank}`}
                      </span>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${C.border}` }}>
                        <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: u.isMe ? 800 : 700, color: u.isMe ? C.primary : C.heading, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {u.name} {u.isMe && <span style={{ fontSize: 12, color: C.primary }}>(Sen)</span>}
                        </div>
                        <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>Lv.{u.level} · 🔥{u.streak}</div>
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: C.primary }}>{(u.xp / 1000).toFixed(1)}K</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card hover={false} style={{ padding: 24 }} C={C}>
                <h3 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 900, color: C.heading, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={20} /> Çalışma Grupları</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {STUDY_GROUPS.map((g, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px", borderRadius: 16,
                      background: C.pageBg, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = g.color + "60"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                      <span style={{ background: `${g.color}15`, color: g.color, padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{g.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.heading, marginBottom: 4 }}>{g.name}</div>
                        <div style={{ fontSize: 12, color: C.faint }}>{g.members} üye · {g.active} çevrimiçi</div>
                      </div>
                      <div style={{ fontSize: 12, color: g.color, fontWeight: 800, textAlign: "right" }}>{g.nextSession.split(' ')[0]}<br/>{g.nextSession.split(' ')[1]}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card hover={false} style={{ padding: 24 }} C={C}>
                <h3 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 900, color: C.heading, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={20} /> Yaklaşan Etkinlikler</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {EVENTS.map((ev, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 16, background: C.pageBg, border: `1px solid ${C.border}`, borderLeft: `4px solid ${ev.color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: C.heading }}>{ev.title}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13, color: C.muted, fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {ev.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {ev.time}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                        <Badge color={ev.color}>
                          <span style={{display: 'flex', alignItems: 'center', gap: 4}}>
                            {ev.type === "workshop" ? <Wrench size={12}/> : ev.type === "webinar" ? <Mic size={12}/> : <Trophy size={12}/>} 
                            {ev.type === "workshop" ? "Workshop" : ev.type === "webinar" ? "Webinar" : "Hackathon"}
                          </span>
                        </Badge>
                        <span style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}>{ev.spots} kota</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
