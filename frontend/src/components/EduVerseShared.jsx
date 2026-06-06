import React from 'react';
import { UserCircle, Briefcase, GraduationCap, Code2, Atom, Palette, Flame, Award, Zap, MessageCircle } from 'lucide-react';

// ═══════════════════════════════════════════
//  DESIGN SYSTEM
// ═══════════════════════════════════════════
export const C = {
  bg: "transparent", bgAlt: "transparent", surface: "var(--c-panelElevated)", surfaceHover: "rgba(var(--c-accent-rgb), 0.05)",
  card: "var(--c-panel)", cardHover: "rgba(var(--c-accent-rgb), 0.02)", border: "var(--c-border)",
  borderActive: "var(--c-accent)", accent: "var(--c-accent)", accentDim: "rgba(var(--c-accent-rgb), 0.08)",
  purple: "var(--c-accentHover)", purpleDim: "rgba(var(--c-accent-rgb), 0.1)", warm: "#ff6b6b",
  gold: "#ffd93d", blue: "#5ba0f5", pink: "#f078b4", green: "var(--c-success)",
  text: "var(--c-text)", textSec: "var(--c-textMuted)", textDim: "var(--c-textSubtle)",
  gradAccent: "linear-gradient(135deg, var(--c-accent), var(--c-accentHover))",
  gradWarm: "linear-gradient(135deg, #ff6b6b, #ffd93d)",
};

export const font = "'Outfit', sans-serif";
export const mono = "'JetBrains Mono', monospace";

// ═══════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════
export const COURSE_DETAIL = {
  title: "Python ile Sıfırdan Uzmanlığa: Kapsamlı Eğitim",
  subtitle: "Python programlama dilini sıfırdan öğrenin, gerçek projelerle pekiştirin ve veri bilimi, web geliştirme, otomasyon alanlarında uzmanlaşın.",
  instructor: { name: "Dr. Ahmet Yılmaz", avatar: <UserCircle size={48} color={C.accent} />, title: "Senior Software Engineer @ Google", students: 84521, courses: 12, rating: 4.9 },
  rating: 4.8, reviewCount: 12450, students: 34521, lastUpdate: "Mayıs 2026",
  price: 199.99, oldPrice: 599.99, hours: 42, lectures: 324, level: "Başlangıç → İleri",
  language: "Türkçe", certificate: true, lifetime: true, mobile: true,
  whatYouLearn: [
    "Python temellerinden ileri seviye OOP kavramlarına",
    "Django & Flask ile web uygulamaları geliştirme",
    "Pandas, NumPy ile veri analizi ve görselleştirme",
    "API geliştirme ve entegrasyon",
    "Veritabanı tasarımı (SQL & NoSQL)",
    "Unit test, debugging ve best practices",
    "Gerçek dünya projeleri ile portföy oluşturma",
    "Web scraping ve otomasyon senaryoları",
  ],
  curriculum: [
    { title: "Python'a Giriş ve Kurulum", lectures: 14, duration: "2s 15dk", free: true },
    { title: "Değişkenler, Veri Tipleri ve Operatörler", lectures: 22, duration: "3s 40dk", free: false },
    { title: "Kontrol Yapıları ve Döngüler", lectures: 18, duration: "2s 55dk", free: false },
    { title: "Fonksiyonlar ve Modüller", lectures: 24, duration: "4s 10dk", free: false },
    { title: "Nesne Yönelimli Programlama (OOP)", lectures: 30, duration: "5s 20dk", free: false },
    { title: "Dosya İşlemleri ve Hata Yönetimi", lectures: 16, duration: "2s 30dk", free: false },
    { title: "Veri Yapıları: İleri Seviye", lectures: 20, duration: "3s 45dk", free: false },
    { title: "Web Geliştirme: Django Framework", lectures: 42, duration: "7s 10dk", free: false },
    { title: "Veri Bilimi: Pandas & NumPy", lectures: 36, duration: "5s 55dk", free: false },
    { title: "Proje: E-Ticaret Uygulaması", lectures: 28, duration: "4s 30dk", free: false },
  ],
  reviews: [
    { name: "Merve T.", rating: 5, date: "2 hafta önce", text: "Türkçe Python eğitimleri arasında açık ara en iyisi. Her konu detaylı anlatılmış, projeler gerçek dünyadan.", avatar: <UserCircle size={28} color={C.textDim} /> },
    { name: "Emre K.", rating: 5, date: "1 ay önce", text: "42 saatlik içerik müthiş değer. Hoca her soruya çok hızlı dönüş yapıyor. Kesinlikle tavsiye ederim.", avatar: <Briefcase size={28} color={C.textDim} /> },
    { name: "Selin A.", rating: 4, date: "3 hafta önce", text: "Django bölümü biraz hızlı geçilmiş ama genel olarak çok faydalı. OOP anlatımı mükemmel.", avatar: <GraduationCap size={28} color={C.textDim} /> },
  ],
};

export const DASHBOARD_DATA = {
  user: { name: "Elif", streak: 14, xp: 12450, level: 24, badge: "🔥" },
  activeCourses: [
    { title: "Python ile Sıfırdan Uzmanlığa", progress: 68, lastLesson: "OOP: Kalıtım ve Polimorfizm", nextLesson: "Soyut Sınıflar", timeLeft: "13s 24dk", icon: <Code2 size={24} color={C.accent} />, color: C.accent },
    { title: "React & Next.js Full Stack", progress: 34, lastLesson: "useState & useEffect", nextLesson: "Custom Hooks", timeLeft: "36s 48dk", icon: <Atom size={24} color={C.purple} />, color: C.purple },
    { title: "UI/UX Tasarım Masterclass", progress: 12, lastLesson: "Renk Teorisi", nextLesson: "Tipografi Temelleri", timeLeft: "33s 12dk", icon: <Palette size={24} color={C.pink} />, color: C.pink },
  ],
  weeklyActivity: [
    { day: "Pzt", hours: 2.5 }, { day: "Sal", hours: 1.8 }, { day: "Çar", hours: 3.2 },
    { day: "Per", hours: 0.5 }, { day: "Cum", hours: 2.1 }, { day: "Cmt", hours: 4.0 }, { day: "Paz", hours: 1.5 },
  ],
  achievements: [
    { icon: <Flame size={20} color={C.warm} />, title: "14 Gün Serisi", desc: "Kesintisiz öğrenme" },
    { icon: <Award size={20} color={C.gold} />, title: "İlk Sertifika", desc: "Python Temelleri" },
    { icon: <Zap size={20} color={C.accent} />, title: "Hız Ustası", desc: "1 günde 5 ders" },
    { icon: <MessageCircle size={20} color={C.blue} />, title: "Yardımsever", desc: "10 cevap forumda" },
  ],
  certificates: [
    { title: "Python Temelleri", date: "Nisan 2026", id: "CERT-PY-2026-0412" },
    { title: "Git & GitHub", date: "Mart 2026", id: "CERT-GIT-2026-0318" },
  ],
  schedule: [
    { time: "14:00", title: "Canlı Ders: Python OOP", instructor: "Dr. Ahmet Y.", type: "live" },
    { time: "16:30", title: "Mentor Görüşmesi", instructor: "Zeynep A.", type: "mentor" },
    { time: "19:00", title: "Topluluk AMA", instructor: "Topluluk", type: "community" },
  ],
};

export const INSTRUCTOR_DATA = {
  instructor: { name: "Dr. Ahmet Yılmaz", avatar: <GraduationCap size={48} color={C.accent} /> },
  stats: { totalStudents: 84521, totalRevenue: 1247650, avgRating: 4.87, activeCourses: 12, completionRate: 78, responseTime: "2.4 saat" },
  revenueChart: [
    { month: "Oca", amount: 85400 }, { month: "Şub", amount: 92100 }, { month: "Mar", amount: 108300 },
    { month: "Nis", amount: 97600 }, { month: "May", amount: 125800 }, { month: "Haz", amount: 142350 },
  ],
  courses: [
    { title: "Python ile Sıfırdan Uzmanlığa", students: 34521, rating: 4.8, revenue: 487200, status: "active", trend: "+12%" },
    { title: "Django Web Framework", students: 18432, rating: 4.7, revenue: 312400, status: "active", trend: "+8%" },
    { title: "Veri Bilimi: A'dan Z'ye", students: 15890, rating: 4.9, revenue: 268900, status: "active", trend: "+22%" },
    { title: "Python Otomasyon", students: 12345, rating: 4.6, revenue: 198700, status: "draft", trend: "—" },
  ],
  recentReviews: [
    { student: "Merve T.", course: "Python Sıfırdan", rating: 5, text: "Harika eğitim, çok teşekkürler!", time: "2 saat önce", replied: false },
    { student: "Burak K.", course: "Django Web", rating: 4, text: "Deployment kısmı biraz daha detaylı olabilir.", time: "5 saat önce", replied: true },
    { student: "Ayşe D.", course: "Veri Bilimi", rating: 5, text: "En kapsamlı Türkçe veri bilimi eğitimi!", time: "1 gün önce", replied: true },
  ],
  messages: [
    { from: "Emre K.", text: "Hocam, OOP bölümünde bir sorum var...", time: "10dk", unread: true },
    { from: "Selin A.", text: "Proje ödevimi gönderdim, kontrol edebilir misiniz?", time: "1s", unread: true },
    { from: "Can Ö.", text: "Teşekkürler hocam, anladım.", time: "3s", unread: false },
  ],
};

// ═══════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════
export const Stars = ({ r, size = 13 }) => (
  <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(r) ? C.gold : C.textDim, fontSize: size }}>★</span>)}
    <span style={{ color: C.gold, fontWeight: 700, fontSize: size, marginLeft: 4 }}>{r}</span>
  </span>
);

export const Badge = ({ children, color = C.accent, bg }) => (
  <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg || `${color}18`, color, letterSpacing: 0.3 }}>{children}</span>
);

export const ProgressBar = ({ value, color = C.accent, height = 6, showLabel = false }) => (
  <div style={{ position: "relative" }}>
    <div style={{ width: "100%", height, borderRadius: height, background: C.bgAlt }}>
      <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 1s ease", boxShadow: `0 0 12px ${color}40` }} />
    </div>
    {showLabel && <span style={{ position: "absolute", right: 0, top: -20, fontSize: 12, fontWeight: 600, color }}>{value}%</span>}
  </div>
);

export const MiniChart = ({ data, color = C.accent, height = 80 }) => {
  const max = Math.max(...data.map(d => d.amount || d.hours || 0));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height }}>
      {data.map((d, i) => {
        const val = d.amount || d.hours || 0;
        const h = max ? (val / max) * height : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: h, borderRadius: 6, background: `linear-gradient(180deg, ${color}, ${color}60)`, transition: "height 0.6s ease", minHeight: 4, position: "relative" }}>
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 600, color: C.textSec, whiteSpace: "nowrap" }}>
                {d.amount ? `₺${(d.amount / 1000).toFixed(0)}K` : `${d.hours}s`}
              </div>
            </div>
            <span style={{ fontSize: 10, color: C.textDim, fontWeight: 500 }}>{d.month || d.day}</span>
          </div>
        );
      })}
    </div>
  );
};

export const SectionTitle = ({ children, sub, accent = C.accent }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontFamily: font, fontSize: 28, fontWeight: 700, marginBottom: sub ? 8 : 0, color: accent }}>{children}</h2>
    {sub && <p style={{ color: C.textSec, fontSize: 15 }}>{sub}</p>}
  </div>
);

export const Card = ({ children, style: s, hover = true, ...props }) => (
  <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, transition: "all 0.35s", ...(hover ? { cursor: "pointer" } : {}), ...s }} {...props}>{children}</div>
);
