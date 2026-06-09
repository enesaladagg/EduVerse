import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { usePomodoro } from "../context/PomodoroContext";
import GlobalNavbar from "../components/GlobalNavbar";
import api from "../services/api";
import { User, Code2, Atom, Palette, Target, PartyPopper, Flame, MessageCircle, CircleDot, PlayCircle, Brain, Globe, ShieldCheck, Calendar, BookOpen, Coffee, Activity, Camera, X, Upload, Video } from 'lucide-react';

/*
 ╔══════════════════════════════════════════════════════════════════╗
 ║  EDUVERSE 2026 — STUDENT DASHBOARD                             ║
 ╚══════════════════════════════════════════════════════════════════╝
*/

const T_DARK = {
  bg0: "#04080f",      bg1: "#06101f",      bg2: "#0c1a30",
  bg3: "#112240",      bg4: "#17305a",
  
  cyan: "#0ef0b2", cyanDim: "rgba(14,240,178,0.08)", cyanMid: "rgba(14,240,178,0.18)", cyanGlow: "rgba(14,240,178,0.35)",
  violet: "#a78bfa", violetDeep: "#7c3aed", violetDim: "rgba(167,139,250,0.08)", violetMid: "rgba(167,139,250,0.18)", violetGlow: "rgba(124,58,237,0.3)",
  amber: "#f59e0b", amberDim: "rgba(245,158,11,0.1)",
  rose: "#f43f5e", roseDim: "rgba(244,63,94,0.1)",
  emerald: "#34d399", emeraldDim: "rgba(52,211,153,0.1)",
  sky: "#38bdf8", skyDim: "rgba(56,189,248,0.1)",
  
  t1: "#eef2ff", t2: "#94a3c8", t3: "#4a5e80", t4: "#2a3a5c",
  b1: "rgba(14,240,178,0.06)", b2: "rgba(14,240,178,0.12)", b3: "rgba(14,240,178,0.25)",
  
  gCyan: "linear-gradient(135deg, #0ef0b2, #0bc5e8)",
  gViolet: "linear-gradient(135deg, #a78bfa, #7c3aed)",
  gWarm: "linear-gradient(135deg, #f59e0b, #f43f5e)",
  gCard: "linear-gradient(165deg, #0c1a30 0%, #112240 100%)",
  
  display: "'Satoshi', 'Plus Jakarta Sans', sans-serif",
  body: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  r1: 8, r2: 14, r3: 20, r4: 28,
};

const T_LIGHT = {
  ...T_DARK,
  bg0: "#f8fafc",      bg1: "#f1f5f9",      bg2: "#ffffff",
  bg3: "#f8fafc",      bg4: "#e2e8f0",
  
  cyan: "#00b894", cyanDim: "rgba(0,184,148,0.08)", cyanMid: "rgba(0,184,148,0.18)", cyanGlow: "rgba(0,184,148,0.25)",
  violet: "#6c5ce7", violetDeep: "#4834d4", violetDim: "rgba(108,92,231,0.08)", violetMid: "rgba(108,92,231,0.18)", violetGlow: "rgba(108,92,231,0.2)",
  
  t1: "#0f172a", t2: "#475569", t3: "#94a3b8", t4: "#cbd5e1",
  b1: "rgba(0,184,148,0.2)", b2: "rgba(0,184,148,0.3)", b3: "rgba(0,184,148,0.5)",
  
  gCard: "linear-gradient(165deg, #ffffff 0%, #f1f5f9 100%)",
};

const USER = { name: "Elif", level: 24, xp: 12450, xpNext: 15000, streak: 14, avatar: <User size={24} /> };

const COURSES = [
  { id: 1, title: "Python ile Sıfırdan Uzmanlığa", instructor: "Dr. Ahmet Yılmaz", progress: 68, icon: <Code2 size={24} color="#00b894" />, color: "#00b894", totalLessons: 324, completed: 220, currentModule: "Nesne Yönelimli Programlama", currentLesson: "Kalıtım ve Polimorfizm", nextLesson: "Soyut Sınıflar ve Interface", timeLeft: "13s 24dk", lastAccess: "2 saat önce", weeklyGoal: 5, weeklyDone: 3 },
  { id: 2, title: "React & Next.js Full Stack", instructor: "Elif Kaya", progress: 34, icon: <Atom size={24} color="#6c5ce7" />, color: "#6c5ce7", totalLessons: 412, completed: 140, currentModule: "React Hooks Derinlemesine", currentLesson: "useEffect Lifecycle", nextLesson: "Custom Hooks Yazımı", timeLeft: "36s 48dk", lastAccess: "dün", weeklyGoal: 4, weeklyDone: 1 },
  { id: 3, title: "UI/UX Tasarım Masterclass", instructor: "Zeynep Arslan", progress: 12, icon: <Palette size={24} color="#f43f5e" />, color: "#f43f5e", totalLessons: 186, completed: 22, currentModule: "Renk Teorisi ve Tipografi", currentLesson: "Renk Psikolojisi", nextLesson: "Tipografi Temelleri", timeLeft: "33s 12dk", lastAccess: "3 gün önce", weeklyGoal: 3, weeklyDone: 0 },
];

const DAILY_GOALS = [
  { label: "2 ders tamamla", done: true, xp: 50 },
  { label: "1 quiz çöz", done: true, xp: 30 },
  { label: "Forumda 1 soru yanıtla", done: false, xp: 20 },
  { label: "30 dk odaklanma modu", done: false, xp: 40 },
];

const SKILL_DATA = [ { name: "Python", value: 78 }, { name: "Algoritmalar", value: 55 }, { name: "Web Dev", value: 42 }, { name: "Veritabanı", value: 60 }, { name: "DevOps", value: 25 }, { name: "UI/UX", value: 18 } ];

const SCHEDULE = [
  { time: "14:00", title: "Canlı: Python OOP", type: "live", instructor: "Dr. Ahmet Y.", duration: "90dk" },
  { time: "16:30", title: "Mentor Görüşmesi", type: "mentor", instructor: "Zeynep A.", duration: "30dk" },
  { time: "19:00", title: "Topluluk AMA: Kariyer", type: "community", duration: "60dk" },
];

const WEEKLY_HOURS = [ { d: "Pzt", h: 2.5 }, { d: "Sal", h: 1.8 }, { d: "Çar", h: 3.2 }, { d: "Per", h: 0.5 }, { d: "Cum", h: 2.1 }, { d: "Cmt", h: 4.0 }, { d: "Paz", h: 0 } ];

const SOCIAL_PULSE = [
  { user: "Burak K.", action: "Python OOP quizinde %95 aldı", time: "5dk", icon: <Target size={16} /> },
  { user: "Merve T.", action: "React kursunu tamamladı!", time: "12dk", icon: <PartyPopper size={16} /> },
  { user: "Can Ö.", action: "28 günlük seri rekorunu kırdı", time: "20dk", icon: <Flame size={16} /> },
  { user: "Ayşe D.", action: "UI/UX projesini paylaştı", time: "1s", icon: <Palette size={16} /> },
  { user: "Emre K.", action: "Forumda 50. cevabını verdi", time: "2s", icon: <MessageCircle size={16} /> },
];

const AI_MESSAGES = [
  { type: "reminder", text: "Python OOP modülünde kaldığın yer: Kalıtım konusunu %72 tamamladın. Bugün 1 ders daha bitirirsen haftalık hedefini tutturursun!", priority: "high" },
  { type: "tip", text: "Polimorfizm konusunda zorlandığını fark ettim. Sana özel hazırladığım 3 mini alıştırmayı denemek ister misin?", priority: "medium" },
  { type: "insight", text: "Bu hafta öğrenme hızın %23 arttı! En verimli saatlerin 14:00–16:00 arasında. Bu saat dilimine ders planlamayı düşünür müsün?", priority: "low" },
];

function ProgressRing({ T, value, size = 52, stroke = 4, color, children }) {
  const c = color || T.cyan;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.b1} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Bar({ T, value, max, color, h = 6 }) {
  const c = color || T.cyan;
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div style={{ width: "100%", height: h, borderRadius: h, background: T.bg1 }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: h, background: c,
        transition: "width 1s ease", boxShadow: `0 0 12px ${c}30` }} />
    </div>
  );
}

function Chip({ T, children, color, active, onClick, style: s }) {
  const c = color || T.cyan;
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      fontFamily: T.body, border: `1px solid ${active ? c : T.b1}`,
      background: active ? `${c}18` : "transparent", color: active ? c : T.t2,
      cursor: "pointer", transition: "all 0.25s", whiteSpace: "nowrap", ...s,
    }}>{children}</button>
  );
}

function Glow({ T, color, size = 200, x = "50%", y = "50%", opacity = 0.06 }) {
  const c = color || T.cyan;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: c, filter: `blur(${size/2}px)`, opacity, pointerEvents: "none" }} />;
}

function TypeBadge({ T, type }) {
  const map = { live: { c: T.rose, l: "CANLI", i: <PlayCircle size={10} /> }, mentor: { c: T.violet, l: "MENTOR", i: <Brain size={10} /> }, community: { c: T.emerald, l: "TOPLULUK", i: <Globe size={10} /> } };
  const m = map[type] || map.community;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, background: `${m.c}15`, color: m.c, border: `1px solid ${m.c}25` }}>{m.i} {m.l}</span>;
}

function SkillRadar({ T, data, size = 240 }) {
  const cx = size / 2, cy = size / 2, maxR = size * 0.38;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i, v) => ({ x: cx + Math.cos(angleStep * i - Math.PI / 2) * maxR * (v / 100), y: cy + Math.sin(angleStep * i - Math.PI / 2) * maxR * (v / 100) });
  const gridLevels = [25, 50, 75, 100];
  const polyPoints = data.map((d, i) => `${getPoint(i, d.value).x},${getPoint(i, d.value).y}`).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(lv => (
        <polygon key={lv} points={data.map((_, i) => `${getPoint(i, lv).x},${getPoint(i, lv).y}`).join(" ")} fill="none" stroke={T.b2} strokeWidth={0.5} />
      ))}
      {data.map((_, i) => <line key={i} x1={cx} y1={cy} x2={getPoint(i, 100).x} y2={getPoint(i, 100).y} stroke={T.b1} strokeWidth={0.5} />)}
      <polygon points={polyPoints} fill={`${T.cyan}15`} stroke={T.cyan} strokeWidth={2} />
      {data.map((d, i) => (
        <g key={d.name}>
          <circle cx={getPoint(i, d.value).x} cy={getPoint(i, d.value).y} r={4} fill={T.cyan} stroke={T.bg2} strokeWidth={2} />
          <text x={getPoint(i, 118).x} y={getPoint(i, 118).y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 10, fontFamily: T.body, fontWeight: 600, fill: T.t2 }}>{d.name}</text>
          <text x={getPoint(i, d.value).x} y={getPoint(i, d.value).y - 12} textAnchor="middle" style={{ fontSize: 9, fontFamily: T.mono, fontWeight: 700, fill: T.cyan }}>{d.value}%</text>
        </g>
      ))}
    </svg>
  );
}

function AIMentor({ T, expanded, onToggle }) {
  const [msgIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const msg = AI_MESSAGES[msgIndex];

  const handleSend = async () => {
    if (!chatInput.trim() || typing) return;
    const userMessage = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: userMessage }]);
    setTyping(true);
    
    try {
      const messagesPayload = chatHistory.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', content: m.text }));
      messagesPayload.push({ role: 'user', content: userMessage });
      
      const res = await api.sendMessageToAI(messagesPayload);
      if (res.success) {
        setChatHistory(prev => [...prev, { role: "ai", text: res.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: res.message || "Bir hata oluştu, lütfen API anahtarınızı kontrol edin." }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "ai", text: "Bağlantı hatası oluştu. Lütfen tekrar deneyin." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{
      borderRadius: T.r3, overflow: "hidden", border: `1px solid ${expanded ? T.violetMid : T.b2}`, background: expanded ? T.bg2 : T.bg3, transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)", position: "relative",
    }}>
      {expanded && <Glow T={T} color={T.violetDeep} size={300} x="80%" y="20%" opacity={0.08} />}
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: T.gViolet, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${T.violetGlow}` }}>
            <span style={{ fontSize: 20, display: 'flex' }}><Brain size={24} color="#fff" /></span>
          </div>
          <div>
            <div style={{ fontFamily: T.display, fontWeight: 700, fontSize: 15, color: T.t1, display: "flex", alignItems: "center", gap: 8 }}>
              AI Mentör
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald }} />
            </div>
            <div style={{ fontSize: 12, color: T.violet, fontWeight: 500 }}>{expanded ? "Sana nasıl yardımcı olabilirim?" : msg.text.slice(0, 60) + "..."}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!expanded && <span style={{ width: 22, height: 22, borderRadius: 8, background: T.roseDim, color: T.rose, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono }}>{AI_MESSAGES.length}</span>}
          <span style={{ color: T.t3, transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {AI_MESSAGES.map((m, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: T.r2, background: i === 0 ? T.violetDim : T.bg3, border: `1px solid ${i === 0 ? T.violetMid : T.b1}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.priority === "high" ? T.amber : m.priority === "medium" ? T.violet : T.t2, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.type}</span>
                </div>
                <p style={{ fontSize: 13, color: T.t2, lineHeight: 1.6 }}>{m.text}</p>
              </div>
            ))}
          </div>
          {chatHistory.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, paddingRight: 4 }}>
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.6, maxWidth: "85%", background: msg.role === "user" ? T.cyanMid : T.violetDim, color: msg.role === "user" ? T.t1 : T.t2, alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.text}
                </div>
              ))}
              {typing && <div style={{ padding: "10px 14px", borderRadius: 14, background: T.violetDim, alignSelf: "flex-start", fontSize: 13, color: T.violet }}>● ● ●</div>}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Mentörüne sor..." style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: `1px solid ${T.b2}`, background: "transparent", color: T.t1, fontSize: 13, fontFamily: T.body, outline: "none" }} />
            <button onClick={handleSend} style={{ padding: "0 18px", borderRadius: 14, border: "none", background: T.gViolet, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Gönder</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FocusMode({ T }) {
  const {
    isActive, toggleTimer, resetTimer,
    timeLeft, mode, setMode, setTimeLeft,
    activeTotal, formatTime,
  } = usePomodoro();

  const pct = activeTotal ? ((activeTotal - timeLeft) / activeTotal) * 100 : 0;
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');

  return (
    <div style={{ padding: 24, borderRadius: T.r3, background: isActive ? `linear-gradient(165deg, ${T.bg2}, rgba(14,240,178,0.03))` : T.gCard, border: `1px solid ${isActive ? T.b3 : T.b1}`, textAlign: "center", transition: "all 0.5s", position: "relative", overflow: "hidden" }}>
      {isActive && <Glow T={T} color={T.cyan} size={180} x="50%" y="30%" opacity={0.05} />}
      <div style={{ fontFamily: T.display, fontSize: 14, fontWeight: 700, color: T.t2, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {mode === "focus" ? <><Target size={16} /> ODAKLANMA MODU</> : <><Coffee size={16} /> MOLA</>}
      </div>
      <ProgressRing T={T} value={pct} size={110} stroke={5} color={mode === "focus" ? T.cyan : T.amber}>
        <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.t1, letterSpacing: 2 }}>{min}:{sec}</div>
      </ProgressRing>
      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
        <button
          onClick={toggleTimer}
          style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: isActive ? T.roseDim : T.gCyan, color: isActive ? T.rose : "#000", fontFamily: T.body, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          {isActive ? "Durdur" : "Başlat"}
        </button>
        {!isActive && (
          <button
            onClick={resetTimer}
            style={{ padding: "10px 16px", borderRadius: 12, border: `1px solid ${T.b2}`, background: "transparent", color: T.t2, fontFamily: T.body, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Sıfırla
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardView({ user, onNavigate }) {
  const { isDark } = useTheme();
  const { user: authUser, updateUser } = useAuth();
  const T = isDark ? T_DARK : T_LIGHT;
  const [activeCourse, setActiveCourse] = useState(0);
  const [mentorOpen, setMentorOpen] = useState(true);
  const [joinModal, setJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);

  const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala&backgroundColor=ffdfbf'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUser({ avatar: url });
      setShowAvatarPicker(false);
    }
  };

  const goalsCompleted = DAILY_GOALS.filter(g => g.done).length;
  const goalsPct = (goalsCompleted / DAILY_GOALS.length) * 100;

  const displayCourses = useMemo(() => {
    const pc = authUser?.purchasedCourses;
    if (!pc || pc.length === 0) return [];
    return pc.map(c => ({
      ...c,
      progress: c.progress || 0,
      icon: c.icon || <Code2 size={24} color={c.color || T.cyan} />,
      color: c.color || T.cyan,
      currentModule: c.currentModule || "Başlangıç Modülü",
      lastAccess: c.lastAccess || "şimdi",
      instructor: c.instructor?.name || c.instructor || "EduVerse Eğitmeni"
    }));
  }, [authUser, T]);

  return (
    <div className="layout-container" style={{ minHeight: "100vh", background: T.bg0, color: T.t1, fontFamily: T.body, display: "flex", flexDirection: "column" }}>
      <GlobalNavbar onNavigate={onNavigate} />

      <main style={{ flex: 1, padding: "30px 5%", maxWidth: 1400, margin: "0 auto", width: "100%", marginTop: 80 }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: T.display, fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>Tekrar Hoş Geldin, {authUser?.name || user?.name}</h1>
            <p style={{ color: T.t2, fontSize: 16 }}>Bugün harika şeyler öğrenmek için mükemmel bir gün!</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: 'wrap' }}>
            <button onClick={() => setJoinModal(true)} style={{ padding: "12px 20px", borderRadius: 14, border: `1px solid ${T.violetMid}`, background: `${T.violetDim}`, color: T.violet, fontFamily: T.display, fontSize: 14, fontWeight: 700, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 8 }}>
              <Video size={18} /> Canlı Derse Katıl
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: T.r2, background: T.bg2, border: `1px solid ${T.b1}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={26} color={T.amber} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Seri</div>
                <div style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: T.amber }}>{authUser?.streak || user?.streak || 1} Gün</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderRadius: T.r2, background: T.bg2, border: `1px solid ${T.b1}` }}>
              <div 
                onClick={() => setShowAvatarPicker(true)}
                className="avatar-hover"
                style={{ 
                  width: 48, height: 48, borderRadius: 16, background: T.bg1, border: `1px solid ${T.b1}`, 
                  display: "flex", alignItems: "center", justifyContent: "center", color: T.t1,
                  cursor: "pointer", position: "relative", overflow: "hidden"
                }}
              >
                <style>{`
                  .avatar-hover::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s; }
                  .avatar-hover:hover::after { opacity: 1; }
                  .avatar-hover:hover .camera-icon { opacity: 1; z-index: 2; }
                  .camera-icon { position: absolute; color: white; opacity: 0; transition: opacity 0.2s; }
                `}</style>
                {authUser?.avatar ? (
                  <img src={authUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={24} />
                )}
                <Camera size={20} className="camera-icon" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Seviye {authUser?.level || user?.level || 1}</span>
                  <span style={{ fontSize: 10, color: T.t2 }}>{authUser?.xp || user?.xp || 0} / {(authUser?.level || user?.level || 1) * 1000} XP</span>
                </div>
                <Bar T={T} value={authUser?.xp || user?.xp || 0} max={(authUser?.level || user?.level || 1) * 1000} color={T.cyan} h={4} />
              </div>
            </div>
          </div>
        </div>

        <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <AIMentor T={T} expanded={mentorOpen} onToggle={() => setMentorOpen(!mentorOpen)} />

            {displayCourses.length === 0 ? (
              <div style={{ padding: 40, borderRadius: T.r3, border: `1px dashed ${T.b2}`, background: T.bg3, textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: T.b1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Code2 size={40} color={T.cyan} />
                </div>
                <h3 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Henüz Hiç Kurs Almadın!</h3>
                <p style={{ color: T.t2, fontSize: 16, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>Yeni yetenekler keşfetmek ve kariyerine değer katmak için kurslarımızı inceleyebilirsin.</p>
                <button 
                  onClick={() => onNavigate('courses')}
                  style={{ padding: '14px 32px', borderRadius: 14, border: 'none', background: T.gCyan, color: '#000', fontFamily: T.display, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 24px ${T.cyanGlow}` }}
                >
                  Kurslara Göz At
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h2 style={{ fontFamily: T.display, fontSize: 18, fontWeight: 800 }}>Devam Eden Kurslar</h2>
                    <div style={{ display: "flex", gap: 4 }}>
                      {displayCourses.map((c, i) => <Chip T={T} key={c.id || i} active={activeCourse === i} color={c.color} onClick={() => setActiveCourse(i)}>{c.icon} {c.title.split(" ")[0]}</Chip>)}
                    </div>
                  </div>

                  {(() => {
                    const c = displayCourses[activeCourse];
                    if (!c) return null;
                    return (
                      <div className="card-hover" style={{ borderRadius: T.r3, border: `1px solid ${T.b2}`, background: `linear-gradient(165deg, ${T.bg2} 0%, ${c.color}06 100%)`, overflow: "hidden", position: "relative" }}>
                        <Glow T={T} color={c.color} size={250} x="90%" y="20%" opacity={0.06} />
                        <div style={{ padding: 28, position: "relative", zIndex: 2 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <span style={{ fontSize: 32 }}>{c.icon}</span>
                                <div>
                                  <h3 style={{ fontFamily: T.display, fontSize: 20, fontWeight: 800 }}>{c.title}</h3>
                                  <span style={{ fontSize: 13, color: T.t3 }}>{c.instructor} · Son erişim: {c.lastAccess}</span>
                                </div>
                              </div>
                            </div>
                            <ProgressRing T={T} value={c.progress} size={72} stroke={5} color={c.color}>
                              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 800, color: c.color }}>{c.progress}%</span>
                            </ProgressRing>
                          </div>
                          <Bar T={T} value={c.progress} max={100} color={c.color} h={8} />
                          <button onClick={() => onNavigate('course-detail')} style={{ width: "100%", marginTop: 24, padding: 16, borderRadius: T.r2, border: "none", background: c.color, color: "#000", fontFamily: T.display, fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.3s" }}>▶ Derse Devam Et</button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={{ borderRadius: T.r3, border: `1px solid ${T.b1}`, background: T.gCard, padding: 24, textAlign: "center" }}>
                    <h3 style={{ fontFamily: T.display, fontSize: 16, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Activity size={18} color={T.violet} /> Yetkinlik Radarı</h3>
                    <SkillRadar T={T} data={SKILL_DATA} size={220} />
                  </div>
                  <div style={{ borderRadius: T.r3, border: `1px solid ${T.b1}`, background: T.gCard, padding: 24 }}>
                    <h3 style={{ fontFamily: T.display, fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} color={T.cyan} /> Tüm Kursların</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: 300, overflowY: 'auto', paddingRight: 8 }}>
                      {displayCourses.map((c, i) => {
                        const isActive = activeCourse === i;
                        return (
                          <div key={c.id || i} onClick={() => setActiveCourse(i)} className="card-hover" style={{ 
                            display: "flex", alignItems: "flex-start", gap: 16, padding: "16px", 
                            borderRadius: "20px", 
                            background: isActive ? `linear-gradient(145deg, ${T.bg2}, ${c.color}0a)` : T.bg3, 
                            border: `1px solid ${isActive ? `${c.color}50` : T.b1}`, 
                            cursor: "pointer", transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                            boxShadow: isActive ? `0 12px 32px ${c.color}15` : 'none',
                            position: 'relative', overflow: 'hidden'
                          }}>
                            {isActive && <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: c.color }} />}
                            <div style={{ 
                              width: 48, height: 48, borderRadius: '14px', 
                              background: `${c.color}15`, border: `1px solid ${c.color}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', 
                              flexShrink: 0
                            }}>
                              {c.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: isActive ? T.t1 : T.t2, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {c.title}
                              </div>
                              <div style={{ fontSize: 12, color: T.t3, fontWeight: 600, marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {c.currentModule}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ flex: 1 }}><Bar T={T} value={c.progress} max={100} color={c.color} h={6} /></div>
                                <span style={{ fontSize: 12, fontFamily: T.mono, fontWeight: 800, color: c.color }}>{c.progress}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>
            <div style={{ borderRadius: T.r3, border: `1px solid ${T.b1}`, background: T.gCard, padding: 24, position: "relative", overflow: "hidden" }}>
              <Glow T={T} color={T.amber} size={150} x="80%" y="20%" opacity={0.04} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative", zIndex: 2 }}>
                <h3 style={{ fontFamily: T.display, fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={18} color={T.amber} /> Günlük Hedefler</h3>
                <ProgressRing T={T} value={goalsPct} size={40} stroke={3} color={T.amber}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 800, color: T.amber }}>{goalsCompleted}/{DAILY_GOALS.length}</span>
                </ProgressRing>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 2 }}>
                {DAILY_GOALS.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: T.r2, background: g.done ? T.emeraldDim : T.bg3, border: `1px solid ${g.done ? "rgba(52,211,153,0.15)" : T.b1}` }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${g.done ? T.emerald : T.t4}`, background: g.done ? T.emerald : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 800 }}>{g.done ? "✓" : ""}</span>
                    <span style={{ flex: 1, fontSize: 13, color: g.done ? T.t3 : T.t1, fontWeight: 500, textDecoration: g.done ? "line-through" : "none" }}>{g.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <FocusMode T={T} />

            <div style={{ borderRadius: T.r3, border: `1px solid ${T.b1}`, background: T.gCard, padding: 24 }}>
              <h3 style={{ fontFamily: T.display, fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} color={T.violet} /> Bugünün Programı</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SCHEDULE.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 48, textAlign: "right", paddingTop: 4 }}>
                      <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.cyan }}>{s.time}</div>
                    </div>
                    <div style={{ width: 2, background: T.b2, borderRadius: 1, position: "relative" }}>
                      <div style={{ position: "absolute", top: 8, left: -3, width: 8, height: 8, borderRadius: "50%", background: s.type === "live" ? T.rose : s.type === "mentor" ? T.violet : T.emerald, border: `2px solid ${T.bg2}` }} />
                    </div>
                    <div style={{ flex: 1, padding: "8px 14px", borderRadius: T.r2, background: T.bg3, border: `1px solid ${T.b1}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</span>
                        <TypeBadge T={T} type={s.type} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: T.bg2, border: `1px solid ${T.b2}`, borderRadius: 24, padding: 32,
            width: '90%', maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAvatarPicker(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: T.t2, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontFamily: T.display, fontSize: 20, fontWeight: 800, marginBottom: 24, color: T.t1 }}>Profil Fotoğrafını Değiştir</h2>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 12, textTransform: 'uppercase' }}>Standart Avatarlar</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {PRESET_AVATARS.map((url, i) => (
                  <img 
                    key={i} src={url} alt={`Preset ${i}`} 
                    onClick={() => { updateUser({ avatar: url }); setShowAvatarPicker(false); }}
                    style={{ 
                      width: '100%', aspectRatio: '1/1', borderRadius: 16, cursor: 'pointer',
                      border: authUser?.avatar === url ? `2px solid ${T.cyan}` : `2px solid transparent`,
                      background: T.bg1, transition: 'all 0.2s', objectFit: 'cover'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 12, textTransform: 'uppercase' }}>Özel Fotoğraf Yükle</div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  width: '100%', padding: '16px', borderRadius: 16, border: `2px dashed ${T.b2}`,
                  background: T.bg1, color: T.cyan, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.background = `${T.cyan}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.b2; e.currentTarget.style.background = T.bg1; }}
              >
                <Upload size={24} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Dosya Yükle</span>
              </button>
              <input 
                type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/jpeg,image/jpg,image/png,image/webp" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Join Live Class Modal */}
      {joinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: T.bg2, padding: 32, borderRadius: 24, maxWidth: 400, width: '100%', border: `1px solid ${T.b2}`, position: 'relative' }}>
            <button onClick={() => setJoinModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: T.t2, cursor: 'pointer' }}><X size={20} /></button>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.violetDim, color: T.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Video size={32} />
            </div>
            <h2 style={{ fontFamily: T.display, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Canlı Derse Katıl</h2>
            <p style={{ color: T.t2, fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>Eğitmeninizin paylaştığı canlı ders kodunu girin.</p>
            
            <input 
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Örn: EDU-ABCD"
              style={{ width: '100%', padding: '16px', borderRadius: 14, border: `1px solid ${T.b2}`, background: T.bg1, color: T.t1, fontSize: 16, fontFamily: T.mono, outline: 'none', textAlign: 'center', letterSpacing: 2, marginBottom: 24, textTransform: 'uppercase', boxSizing: 'border-box' }}
            />

            <button 
              disabled={!roomCode || roomCode.length < 4}
              onClick={() => {
                setJoinModal(false);
                onNavigate('live', { roomCode, isHost: false });
              }} 
              style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: T.gViolet, color: '#fff', fontSize: 16, fontWeight: 700, cursor: (!roomCode || roomCode.length < 4) ? 'not-allowed' : 'pointer', opacity: (!roomCode || roomCode.length < 4) ? 0.5 : 1, boxSizing: 'border-box' }}>
              Derse Katıl
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
