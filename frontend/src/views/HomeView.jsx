import React, { useState, useEffect, useRef } from "react";
import GlobalNavbar from '../components/GlobalNavbar';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import {
  Code, LineChart, Palette, Smartphone, Cloud, Lock, Bot, TrendingUp,
  Terminal, Blocks, BrainCircuit, Layout, Server,
  Rocket, Database, Settings,
  Users, BookOpen, GraduationCap, Star,
  User, Briefcase, Play, Video, Award, Globe, Clock
} from 'lucide-react';
import '../hero.css';

const DARK_COLORS = {
  primary: "#0a1628",
  secondary: "#0f2140",
  accent: "#00d4aa",
  accentAlt: "#6c5ce7",
  warm: "#ff6b6b",
  gold: "#ffd93d",
  text: "#e8edf5",
  textMuted: "#8899b4",
  surface: "#121e36",
  surfaceLight: "#1a2d4d",
  border: "rgba(0,212,170,0.15)",
};

const LIGHT_COLORS = {
  primary: "#f8fafc",
  secondary: "#f1f5f9",
  accent: "#00b894",
  accentAlt: "#6c5ce7",
  warm: "#ff6b6b",
  gold: "#f39c12",
  text: "#1e293b",
  textMuted: "#64748b",
  surface: "#ffffff",
  surfaceLight: "#e2e8f0",
  border: "rgba(0,184,148,0.2)",
};

const CATEGORIES = [
  { icon: Code, name: "Yazılım", count: 2847, color: "#00d4aa" },
  { icon: LineChart, name: "Veri Bilimi", count: 1523, color: "#6c5ce7" },
  { icon: Palette, name: "Tasarım", count: 983, color: "#ff6b6b" },
  { icon: Smartphone, name: "Mobil Geliştirme", count: 764, color: "#ffd93d" },
  { icon: Cloud, name: "Bulut Teknolojileri", count: 612, color: "#74b9ff" },
  { icon: Lock, name: "Siber Güvenlik", count: 489, color: "#fd79a8" },
  { icon: Bot, name: "Yapay Zeka", count: 1102, color: "#a29bfe" },
  { icon: TrendingUp, name: "Dijital Pazarlama", count: 537, color: "#55efc4" },
];

const COURSES = [
  {
    id: 1, title: "Python ile Sıfırdan Uzmanlığa",
    instructor: "Dr. Ahmet Yılmaz", rating: 4.8, students: 34521,
    price: 199.99, oldPrice: 599.99, image: Terminal,
    level: "Başlangıç", hours: 42, tag: "Çok Satan", tagColor: "#ffd93d",
    category: "Yazılım"
  },
  {
    id: 2, title: "React & Next.js Full Stack Geliştirme",
    instructor: "Elif Kaya", rating: 4.9, students: 21890,
    price: 249.99, oldPrice: 749.99, image: Blocks,
    level: "Orta", hours: 56, tag: "En Yeni", tagColor: "#00d4aa",
    category: "Yazılım"
  },
  {
    id: 3, title: "Makine Öğrenmesi ve Derin Öğrenme",
    instructor: "Prof. Mehmet Demir", rating: 4.7, students: 18432,
    price: 299.99, oldPrice: 899.99, image: BrainCircuit,
    level: "İleri", hours: 68, tag: "Popüler", tagColor: "#6c5ce7",
    category: "Yapay Zeka"
  },
  {
    id: 4, title: "UI/UX Tasarım Masterclass",
    instructor: "Zeynep Arslan", rating: 4.8, students: 15678,
    price: 179.99, oldPrice: 499.99, image: Layout,
    level: "Başlangıç", hours: 38, tag: "Trend", tagColor: "#ff6b6b",
    category: "Tasarım"
  },
  {
    id: 5, title: "AWS Cloud Architect Sertifikası",
    instructor: "Can Özgür", rating: 4.6, students: 12345,
    price: 349.99, oldPrice: 999.99, image: Cloud,
    level: "İleri", hours: 74, tag: "Sertifikalı", tagColor: "#74b9ff",
    category: "Bulut"
  },
  {
    id: 6, title: "Flutter ile Cross-Platform Uygulama",
    instructor: "Selin Aydın", rating: 4.7, students: 9876,
    price: 219.99, oldPrice: 649.99, image: Smartphone,
    level: "Orta", hours: 45, tag: "Yükselen", tagColor: "#55efc4",
    category: "Mobil"
  },
];

const PATHS = [
  {
    title: "Full Stack Geliştirici",
    desc: "Frontend'den backend'e, veritabanından deployment'a tam yol haritası",
    courses: 12, hours: 180, icon: Rocket, color: "#00d4aa",
    skills: ["React", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    title: "Veri Bilimcisi",
    desc: "Veri analizinden makine öğrenmesine kapsamlı kariyer yolu",
    courses: 10, hours: 156, icon: Database, color: "#6c5ce7",
    skills: ["Python", "TensorFlow", "SQL", "Tableau"]
  },
  {
    title: "DevOps Mühendisi",
    desc: "CI/CD, konteynerizasyon ve bulut altyapı uzmanlığı",
    courses: 8, hours: 120, icon: Settings, color: "#74b9ff",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"]
  },
];

const STATS = [
  { value: "50K+", label: "Aktif Öğrenci", icon: Users },
  { value: "3200+", label: "Online Kurs", icon: BookOpen },
  { value: "850+", label: "Uzman Eğitmen", icon: GraduationCap },
  { value: "%94", label: "Memnuniyet", icon: Star },
];

const TESTIMONIALS = [
  { name: "Merve T.", role: "Yazılım Geliştirici @ Trendyol", text: "Bu platform sayesinde 6 ayda yazılım kariyerime başladım. Eğitim kalitesi ve mentor desteği muhteşem.", avatar: User },
  { name: "Burak K.", role: "Veri Analisti @ Getir", text: "Veri bilimi yol haritası tam ihtiyacım olan şeydi. Sertifikalar CV'mde gerçekten fark yarattı.", avatar: Briefcase },
  { name: "Ayşe D.", role: "UX Tasarımcı @ Hepsiburada", text: "Tasarım kursları sektördeki en güncel bilgileri sunuyor. Proje tabanlı öğrenme çok etkili.", avatar: Palette },
];

function StarRating({ rating }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.floor(rating) ? "#ffd93d" : s - 0.5 <= rating ? "#ffd93d" : "#3a4a6b", fontSize: 13 }}>★</span>
      ))}
      <span style={{ color: "#ffd93d", fontWeight: 700, fontSize: 13, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target.replace(/\D/g, "")) || 0;
    if (!num) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(target); clearInterval(timer); }
      else setCount(start.toLocaleString("tr-TR"));
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomeView({ onNavigate }) {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState(0);
  const [activeTab, setActiveTab] = useState("popular");

  const particlesRef = useRef(null);
  const editorBodyRef = useRef(null);
  const editorContainerRef = useRef(null);

  

  useEffect(() => { 
    const pe = particlesRef.current;
    if (!pe) return;
    pe.innerHTML = ''; 
    /* Legacy static particles removed in favor of trail */
  }, []);
  useEffect(() => { 
    const handleMouseMove = (e) => { 
      // Parallax for cards
      const mx = (e.clientX / window.innerWidth - 0.5); 
      const my = (e.clientY / window.innerHeight - 0.5); 
      document.querySelectorAll('.cat-card').forEach((card, i) => { 
        const d = (i % 2 === 0 ? 1 : -1) * (6 + i * 1.5); 
        card.style.marginLeft = (mx * d) + 'px'; 
        card.style.marginTop = (my * d * 0.5) + 'px'; 
      }); 
      
      // Cursor Glow
      const glow = document.getElementById('cursor-glow');
      if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }
      
      const trailContainer = document.getElementById('trail-container');
      if (trailContainer && Math.random() > 0.85) {
        const p = document.createElement('div');
        p.className = 'trail-bubble';
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        
        const size = Math.random() * 10 + 6;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        
        p.style.transform = `translate(-50%, -50%) scale(1)`;
        
        trailContainer.appendChild(p);
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            p.style.opacity = '0';
            p.style.transform = `translate(-50%, -50%) scale(0.1)`;
          });
        });
        
        setTimeout(() => p.remove(), 600);
      }
    }; 
    window.addEventListener('mousemove', handleMouseMove); 
    return () => window.removeEventListener('mousemove', handleMouseMove); 
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredCourses = activeTab === "popular"
    ? COURSES.sort((a, b) => b.students - a.students)
    : activeTab === "new"
    ? [...COURSES].reverse()
    : COURSES.sort((a, b) => b.rating - a.rating);

  return (
    <div className={isDark ? "bg-dark-animated" : "bg-light-animated"} style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif", color: COLORS.text, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      {/* Fareyi takip eden yeşil animasyon (Cursor Glow) */}
      <div id="cursor-glow" style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, rgba(0,212,170,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        transition: 'transform 0.1s ease-out, top 0.1s ease-out, left 0.1s ease-out'
      }} />
      <div id="trail-container" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />
      <style>{`
        .trail-bubble {
          position: absolute;
          border-radius: 50%;
          background: #00D4AA;
          pointer-events: none;
          transition: transform 0.6s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.6s ease-out;
          opacity: 0.8;
        }

        .bg-light-animated {
          background: linear-gradient(-45deg, #f0fdfa, #ffffff, #f8fafc, #eef2ff);
          background-size: 400% 400%;
          animation: softBgAnim 15s ease infinite;
        }
        .bg-dark-animated {
          background: linear-gradient(-45deg, #04080f, #0a1628, #0c1a30, #06101f);
          background-size: 400% 400%;
          animation: softBgAnim 15s ease infinite;
        }
        @keyframes softBgAnim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.primary}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.accent}; border-radius: 3px; }
        
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(0,212,170,0.15); } 50% { box-shadow: 0 0 40px rgba(0,212,170,0.3); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes borderGlow { 0%,100% { border-color: rgba(0,212,170,0.2); } 50% { border-color: rgba(0,212,170,0.5); } }
        
        .nav-link { color: ${COLORS.textMuted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.3s; position: relative; padding: 6px 0; cursor: pointer; }
        .nav-link:hover { color: ${COLORS.accent}; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: ${COLORS.accent}; transition: width 0.3s; }
        .nav-link:hover::after { width: 100%; }
        
        .cat-card { cursor: pointer; padding: 20px 16px; border-radius: 16px; background: ${COLORS.surface}; border: 1px solid transparent; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); text-align: center; min-width: 130px; }
        .cat-card:hover { transform: translateY(-6px); border-color: var(--cat-color); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        
        .cat-deck-container { width: 100%; padding: 20px 0 40px; display: flex; justify-content: center; }
        .cat-deck { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; max-width: 1200px; margin: 0 auto; padding-bottom: 20px; width: 100%; }
        .cat-deck-card { box-sizing: border-box; width: 160px; height: 150px; flex-shrink: 0; background: ${COLORS.surface}; border: 2px solid ${COLORS.border}; border-radius: 20px; padding: 16px 8px; text-align: center; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.05); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .cat-deck-card:hover { width: 220px; border-color: var(--cat-color) !important; transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; z-index: 20; }
        .cat-deck-card > .cat-content { transition: transform 0.4s ease; display: flex; flex-direction: column; align-items: center; width: 100%; }
        .cat-deck-card:hover > .cat-content { transform: translateY(-12px); }
        .cat-explore { position: absolute; bottom: -30px; opacity: 0; font-weight: 700; font-size: 14px; color: var(--cat-color); transition: all 0.4s ease; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .cat-deck-card:hover .cat-explore { bottom: 20px; opacity: 1; transition-delay: 0.1s; }

        .course-card { background: ${COLORS.surface}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275); cursor: pointer; }
        .course-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); border-color: ${COLORS.accent}; }
        
        .path-card { background: ${COLORS.surface}; border-radius: 20px; padding: 32px; border: 2px solid transparent; transition: all 0.4s; cursor: pointer; position: relative; overflow: hidden; }
        .path-card.active { border-color: var(--path-color); }
        .path-card:hover { transform: translateY(-4px); }
        
        .btn-primary { background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt}); color: white; border: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s; font-family: inherit; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,212,170,0.3); }
        
        .btn-secondary { background: transparent; color: ${COLORS.accent}; border: 2px solid ${COLORS.accent}; padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s; font-family: inherit; }
        .btn-secondary:hover { background: rgba(0,212,170,0.1); transform: translateY(-2px); }
        
        .tab-btn { background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; color: ${COLORS.textMuted}; font-size: 15px; font-weight: 600; padding: 10px 24px; cursor: pointer; border-radius: 50px; transition: all 0.3s; font-family: inherit; }
        .tab-btn.active { background: ${COLORS.accent}; color: #fff; border-color: ${COLORS.accent}; box-shadow: 0 4px 12px rgba(0,212,170,0.3); }
        .tab-btn:hover:not(.active) { color: ${COLORS.text}; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}; border-color: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; }
        
        .testimonial-card { background: ${COLORS.surface}; border-radius: 20px; padding: 32px; border: 1px solid ${COLORS.border}; transition: all 0.4s; }
        .testimonial-card:hover { border-color: ${COLORS.accentAlt}; transform: translateY(-4px); }
        
        .search-input { width: 100%; background: ${COLORS.surfaceLight}; border: 2px solid ${COLORS.border}; border-radius: 16px; padding: 18px 24px 18px 56px; color: ${COLORS.text}; font-size: 16px; font-family: inherit; outline: none; transition: all 0.3s; }
        .search-input:focus { border-color: ${COLORS.accent}; box-shadow: 0 0 30px rgba(0,212,170,0.15); }
        .search-input::placeholder { color: ${COLORS.textMuted}; }
        
        .stat-card { text-align: center; padding: 32px 24px; border-radius: 20px; background: linear-gradient(145deg, ${COLORS.surface}, ${COLORS.surfaceLight}); border: 1px solid ${COLORS.border}; transition: all 0.4s; }
        .stat-card:hover { transform: translateY(-6px); animation: borderGlow 2s ease infinite; }
        
        .skill-tag { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; background: rgba(0,212,170,0.1); color: ${COLORS.accent}; }
        
        .feature-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        
        .mobile-menu-btn { display: none; background: none; border: none; color: ${COLORS.text}; font-size: 24px; cursor: pointer; }
        
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-title { font-size: 32px !important; }
          .courses-grid { grid-template-columns: 1fr !important; }
          .categories-row { flex-wrap: wrap !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .paths-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .hero-content { padding: 0 16px !important; }
        }
      
        .hero { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 2rem 5%; overflow: hidden; }
        .bg-mesh { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.35; }
        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,212,170,0.35), transparent 70%); top: -10%; right: -5%; animation: of1 22s ease-in-out infinite; }
        .orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(124,92,252,0.2), transparent 70%); bottom: -8%; left: 8%; animation: of2 26s ease-in-out infinite; }
        .orb-3 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(0,240,192,0.2), transparent 70%); top: 35%; left: 45%; animation: of3 19s ease-in-out infinite; }
        @keyframes of1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-50px,35px) scale(1.08)} }
        @keyframes of2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(45px,-35px) scale(1.12)} }
        @keyframes of3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(35px,25px)} 66%{transform:translate(-25px,-18px)} }
        .particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .particle { position: absolute; border-radius: 50%; background: var(--mint); }
        .particle.dot { width: 4px; height: 4px; opacity: 0.45; }
        .particle.dot-lg { width: 7px; height: 7px; opacity: 0.3; box-shadow: 0 0 10px var(--mint-glow); }
        .particle.ring { background: none; border: 1.5px solid var(--mint); opacity: 0.2; }
        @keyframes pf {
          0%,100% { transform: translateY(0) translateX(0); opacity: var(--o,0.4); }
          25% { transform: translateY(var(--dy,-18px)) translateX(var(--dx,8px)); }
          50% { transform: translateY(calc(var(--dy,-18px)*0.4)) translateX(calc(var(--dx,8px)*-1)); opacity: calc(var(--o,0.4)*1.4); }
          75% { transform: translateY(calc(var(--dy,-18px)*-0.3)) translateX(calc(var(--dx,8px)*0.6)); }
        }
        .hero-content { position: relative; z-index: 10; max-width: 560px; flex-shrink: 0; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border-radius: 50px; border: 1.5px solid rgba(0,212,170,0.3); background: rgba(0,212,170,0.08); backdrop-filter: blur(10px); font-size: 0.85rem; font-weight: 500; margin-bottom: 2rem; animation: fiu 0.8s ease-out both; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mint); position: relative; }
        .pulse-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: var(--mint); opacity: 0.4; animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(2.2);opacity:0} }
        .hero-title { font-size: clamp(2.4rem, 4.8vw, 3.6rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .hero-title .hl { color: var(--mint); }
        .hero-title .l { display: inline-block; animation: fiu 0.8s ease-out both; }
        .hero-title .l:nth-child(1) { animation-delay: 0.15s; }
        .hero-title .l:nth-child(2) { animation-delay: 0.3s; }
        .hero-title .l:nth-child(3) { animation-delay: 0.45s; }
        .hero-desc { font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; max-width: 470px; animation: fiu 0.8s ease-out 0.55s both; }
        .search-wrap { animation: fiu 0.8s ease-out 0.65s both; }
        .search-bar { display: flex; align-items: center; border-radius: 16px; padding: 6px 6px 6px 20px; max-width: 520px; transition: box-shadow 0.3s; }
        .search-bar svg { flex-shrink: 0; color: #aaa; }
        .search-bar input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 0.95rem; padding: 12px; background: none; }
        .search-bar input::placeholder { color: #b0b8c0; }
        .search-bar .btn { padding: 12px 28px; border: none; border-radius: 12px; background: var(--mint); color: #fff; font-family: inherit; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.25s; white-space: nowrap; }
        .search-bar .btn:hover { background: var(--mint-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,212,170,0.35); }
        .tags { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; animation: fiu 0.8s ease-out 0.75s both; }
        .tag { padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(136, 153, 180, 0.3); font-size: 0.82rem; cursor: pointer; transition: all 0.25s; backdrop-filter: blur(4px); }
        .tag:hover { border-color: var(--mint); color: var(--mint-dark); background: rgba(0,212,170,0.06); transform: translateY(-2px); }
        .hero-visual { position: relative; flex: 1; min-height: 580px; z-index: 5; margin-left: 3%; }
        .cat-card { position: absolute; backdrop-filter: blur(18px); border-radius: 18px; padding: 20px; cursor: pointer; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); overflow: hidden; }
        .cat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 18px 18px 0 0; background: var(--accent, var(--mint)); opacity: 0; transition: opacity 0.3s; }
        .cat-card:hover::before { opacity: 1; }
        .cat-card:hover { transform: translateY(-8px) scale(1.03) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,212,170,0.15); }
        .cat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 12px; position: relative; }
        .cat-icon::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: var(--accent, var(--mint)); opacity: 0.1; }
        .cat-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; }
        .cat-sub { font-size: 0.75rem; margin-bottom: 12px; line-height: 1.4; }
        .cat-meta { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; }
        .cat-bar { flex: 1; height: 4px; background: rgba(0,0,0,0.06); border-radius: 4px; overflow: hidden; }
        .cat-bar-fill { height: 100%; border-radius: 4px; background: var(--accent, var(--mint)); transition: width 1.5s cubic-bezier(0.16,1,0.3,1); width: 0; }
        .cat-students { display: flex; align-items: center; gap: 4px; }
        .cat-avatars { display: flex; }
        .cat-avatars span { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff; margin-left: -6px; font-size: 0.55rem; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; }
        .cat-avatars span:first-child { margin-left: 0; }
        .cat-card.c1 { --accent: var(--mint); top: 2%; left: 8%; width: 200px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both, fy 7s ease-in-out 2s infinite; }
        .cat-card.c2 { --accent: var(--purple); top: 0%; left: 55%; width: 210px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both, fy2 8s ease-in-out 2.3s infinite; }
        .cat-card.c3 { --accent: var(--orange); top: 36%; left: 0%; width: 195px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s both, fy 6.5s ease-in-out 2.6s infinite; }
        .cat-card.c4 { --accent: var(--blue); top: 33%; left: 46%; width: 220px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 1.1s both, fy2 7.5s ease-in-out 2.9s infinite; }
        .cat-card.c5 { --accent: var(--pink); top: 67%; left: 10%; width: 205px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 1.3s both, fy 8.5s ease-in-out 3.2s infinite; }
        .cat-card.c6 { --accent: #F59E0B; top: 70%; left: 55%; width: 190px; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 1.5s both, fy2 7s ease-in-out 3.5s infinite; }
        @keyframes ci { from { opacity:0; transform:translateY(35px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fy { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fy2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .stat-pill { position: absolute; backdrop-filter: blur(12px); border-radius: 50px; padding: 8px 18px 8px 10px; display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 600; z-index: 20; white-space: nowrap; }
        .stat-pill .icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .pill-1 { top: 18%; right: 0%; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 1.6s both, fy 9s ease-in-out 3s infinite; }
        .pill-2 { bottom: 10%; right: 5%; left: auto; animation: ci 0.9s cubic-bezier(0.16,1,0.3,1) 1.8s both, fy2 8s ease-in-out 3.3s infinite; }
        .lines-svg { position: absolute; inset: 0; z-index: 2; pointer-events: none; animation: fadeIn 2.5s ease-out 1.5s both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fiu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--mint); animation: pulse 2s infinite; flex-shrink: 0; }
        @media (max-width: 1100px) { .hero { flex-direction: column; padding-top: 5rem; } .hero-visual { min-height: 500px; margin-left: 0; margin-top: 2rem; width: 100%; } }
        @media (max-width: 640px) { .hero-visual { min-height: 440px; } .cat-card { padding: 14px; } .cat-card.c1 { top: 0; left: 2%; width: 46%; } .cat-card.c2 { top: 0; left: 52%; width: 46%; } .cat-card.c3 { top: 34%; left: 2%; width: 46%; } .cat-card.c4 { top: 34%; left: 52%; width: 46%; } .cat-card.c5 { top: 68%; left: 2%; width: 46%; } .cat-card.c6 { top: 68%; left: 52%; width: 46%; } .pill-1, .pill-2 { display: none; } }
`}</style>

      {/* ───── GLOBAL NAVBAR ───── */}
      <GlobalNavbar activePage="home" onNavigate={onNavigate} />

            {/* ───── HERO ───── */}
      <section className="hero" style={{ 
        '--mint': '#00D4AA',
        '--mint-light': '#00F0C0',
        '--mint-dark': '#00B894',
        '--mint-glow': 'rgba(0, 212, 170, 0.25)',
        '--purple': '#7C5CFC',
        '--orange': '#FF8C42',
        '--blue': '#3B82F6',
        '--pink': '#EC4899',
        '--text': isDark ? '#fff' : '#1A1A2E',
        '--text-secondary': isDark ? '#8899b4' : '#5A6670',
        background: 'transparent'
      }}>
        <div className="bg-mesh">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="particles" ref={particlesRef}></div>

        <div className="hero-content">
          <div className="badge" style={{ color: '#00D4AA' }}>
            <span className="pulse-dot"></span>
            12.450+ öğrenci şu an çevrimiçi
          </div>

          <h1 className="hero-title" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>
            <span className="l">Geleceğin </span><br/>
            <span className="l hl">Teknoloji Kariyerine </span><br/>
            <span className="l">Bugün Başla.</span>
          </h1>

          <p className="hero-desc" style={{ color: isDark ? '#8899b4' : '#5A6670' }}>
            Sektör uzmanlarından canlı dersler, proje tabanlı öğrenme ve uluslararası geçerliliğe sahip sertifikalarla kariyerinde fark yarat.
          </p>

          <div className="search-wrap">
            <div className="search-bar" style={{ background: isDark ? '#1a2035' : '#fff', boxShadow: `0 4px 28px rgba(0,0,0,${isDark ? '0.3' : '0.06'}), 0 0 0 1px rgba(0,212,170,0.1)` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" placeholder="Ne öğrenmek istiyorsun? (ör. Python, React...)" style={{ color: isDark ? '#fff' : '#1A1A2E' }} />
              <button className="btn" onClick={() => onNavigate && onNavigate('courses')} style={{ background: '#00d4aa', color: '#fff', borderRadius: 10, padding: '10px 24px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,212,170,0.25)' }}>Keşfet</button>
            </div>
            <div className="hero-tags">
              <span className="tag" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', color: isDark ? '#cbd5e1' : '#5A6670' }}>İngilizce</span>
              <span className="tag" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', color: isDark ? '#cbd5e1' : '#5A6670' }}>Yazılım</span>
              <span className="tag" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', color: isDark ? '#cbd5e1' : '#5A6670' }}>Girişimcilik</span>
              <span className="tag" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', color: isDark ? '#cbd5e1' : '#5A6670' }}>Tasarım</span>
              <span className="tag" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', color: isDark ? '#cbd5e1' : '#5A6670' }}>Sınavlar</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="cat-card c1" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><Globe size={24} color="#00D4AA" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>Yabancı Dil</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>İngilizce, Almanca vb.</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '82%' }}></div></div>
              <span>24 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#00D4AA' }}>A</span>
                <span style={{ background: '#7C5CFC' }}>M</span>
                <span style={{ background: '#3B82F6' }}>K</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>3.2k öğrenci</span>
            </div>
          </div>

          <div className="cat-card c2" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><Code size={24} color="#7C5CFC" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>Yazılım & Teknoloji</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>Web, Mobil, Yapay Zeka</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '74%' }}></div></div>
              <span>18 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#7C5CFC' }}>E</span>
                <span style={{ background: '#EC4899' }}>S</span>
                <span style={{ background: '#FF8C42' }}>D</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>2.8k öğrenci</span>
            </div>
          </div>

          <div className="cat-card c3" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><TrendingUp size={24} color="#FF8C42" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>İşletme & Finans</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>Pazarlama, Borsa, E-Ticaret</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '68%' }}></div></div>
              <span>15 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#FF8C42' }}>B</span>
                <span style={{ background: '#00D4AA' }}>T</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>1.9k öğrenci</span>
            </div>
          </div>

          <div className="cat-card c4" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><Star size={24} color="#3B82F6" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>Kişisel Gelişim</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>Liderlik, İletişim, Zaman Y.</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '56%' }}></div></div>
              <span>12 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#3B82F6' }}>Y</span>
                <span style={{ background: '#EC4899' }}>N</span>
                <span style={{ background: '#7C5CFC' }}>C</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>2.1k öğrenci</span>
            </div>
          </div>

          <div className="cat-card c5" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><Palette size={24} color="#EC4899" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>Tasarım & Sanat</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>Çizim, Animasyon, Müzik</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '71%' }}></div></div>
              <span>14 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#EC4899' }}>G</span>
                <span style={{ background: '#F59E0B' }}>R</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>1.5k öğrenci</span>
            </div>
          </div>

          <div className="cat-card c6" style={{ background: isDark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.82)', boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? '0.3' : '0.06'})` }}>
            <div className="cat-icon"><BookOpen size={24} color="#F59E0B" /></div>
            <div className="cat-name" style={{ color: isDark ? '#fff' : '#1A1A2E' }}>Sınavlara Hazırlık</div>
            <div className="cat-sub" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>YKS, KPSS, IELTS, TOEFL</div>
            <div className="cat-meta" style={{ color: isDark ? '#94a3b8' : '#5A6670' }}>
              <div className="cat-bar"><div className="cat-bar-fill" style={{ width: '63%' }}></div></div>
              <span>11 kurs</span>
            </div>
            <div className="cat-students" style={{ marginTop: 8 }}>
              <div className="cat-avatars">
                <span style={{ background: '#F59E0B' }}>H</span>
                <span style={{ background: '#3B82F6' }}>O</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: isDark ? '#94a3b8' : '#5A6670' }}>1.3k öğrenci</span>
            </div>
          </div>

          <div className="stat-pill pill-1" style={{ background: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)', color: isDark ? '#fff' : '#1A1A2E' }}>
            <div className="icon" style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa' }}><Award size={14} /></div>
            <span>+340 sertifika bu hafta</span>
          </div>

          <div className="stat-pill pill-2" style={{ background: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)', color: isDark ? '#fff' : '#1A1A2E' }}>
            <div className="icon" style={{ background: 'rgba(124,92,252,0.12)' }}>
              <span className="live-dot"></span>
            </div>
            <span>86 canlı ders şu an</span>
          </div>

          <svg className="lines-svg" viewBox="0 0 700 580" fill="none">
            <path d="M 170 100 Q 250 180, 200 250" stroke="url(#lg)" strokeWidth="1" strokeDasharray="4 6" opacity="0.25"/>
            <path d="M 430 90 Q 380 160, 420 230" stroke="url(#lg)" strokeWidth="1" strokeDasharray="4 6" opacity="0.2"/>
            <path d="M 180 370 Q 280 340, 350 370" stroke="url(#lg)" strokeWidth="1" strokeDasharray="4 6" opacity="0.2"/>
            <path d="M 400 360 Q 350 430, 400 490" stroke="url(#lg)" strokeWidth="1" strokeDasharray="4 6" opacity="0.18"/>
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,212,170,0)"/>
                <stop offset="50%" stopColor="rgba(0,212,170,0.5)"/>
                <stop offset="100%" stopColor="rgba(0,212,170,0)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section style={{ padding: "80px 5%", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            Kategorilere <span style={{ color: COLORS.accent }}>Göz At</span>
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: 16 }}>İlgi alanına uygun binlerce kurs seni bekliyor</p>
        </div>
        <div className="cat-deck-container">
          <div className="cat-deck">
            {CATEGORIES.map((cat, index) => (
              <div
                key={index}
                className="cat-deck-card"
                style={{ "--cat-color": cat.color, width: '160px' }}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              >
                <div className="cat-content">
                  <cat.icon size={44} color={cat.color} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: cat.name.length > 12 ? '14px' : '16px', fontWeight: '800', marginBottom: '6px', lineHeight: 1.2, wordBreak: 'break-word', padding: '0 4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, fontWeight: '600' }}>{cat.count.toLocaleString('tr-TR')} kurs</p>
                </div>
                <div className="cat-explore">
                  Eğitimleri Keşfet
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURED COURSES ───── */}
      <section style={{ padding: "60px 5% 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
              Öne Çıkan <span style={{ color: COLORS.accentAlt }}>Kurslar</span>
            </h2>
            <p style={{ color: COLORS.textMuted, fontSize: 16 }}>En çok tercih edilen ve en yüksek puanlı eğitimler</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { key: "popular", label: "Popüler" },
              { key: "new", label: "En Yeni" },
              { key: "top", label: "En Yüksek Puan" },
            ].map(({ key, label }) => (
              <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="courses-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24,
        }}>
          {filteredCourses.map((course, i) => (
            <div key={course.id} className="course-card" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => onNavigate && onNavigate('course-detail')}>
              {/* Premium Course image area */}
              <div style={{
                height: 180, 
                background: isDark ? '#0f172a' : '#f8fafc',
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '120%', height: '120%', background: `radial-gradient(circle at center, ${course.tagColor}40 0%, transparent 70%)`, filter: 'blur(30px)', opacity: 0.8 }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '100%', height: '100%', background: `radial-gradient(circle at center, ${COLORS.accent}30 0%, transparent 60%)`, filter: 'blur(30px)', opacity: 0.6 }} />
                
                <course.image size={140} color={course.tagColor} style={{ position: 'absolute', opacity: isDark ? 0.08 : 0.04, transform: 'rotate(-15deg) scale(1.2)' }} strokeWidth={1} />

                <div style={{ 
                  position: 'relative', zIndex: 2,
                  width: '80px', height: '80px', borderRadius: '24px', 
                  background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)',
                  backdropFilter: 'blur(16px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 20px 40px -10px ${course.tagColor}40, inset 0 2px 4px rgba(255,255,255,0.3)`,
                  animation: "float 4s ease-in-out infinite",
                }}>
                  <course.image size={40} color={course.tagColor} strokeWidth={2.5} style={{ filter: `drop-shadow(0 4px 6px ${course.tagColor}60)` }} />
                </div>
                
                <span style={{
                  position: "absolute", top: 12, left: 12, zIndex: 3,
                  background: course.tagColor, color: "#000", padding: "4px 12px",
                  borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px"
                }}>{course.tag}</span>
                <span style={{
                  position: "absolute", top: 12, right: 12, zIndex: 3,
                  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                  color: "white", padding: "4px 10px", borderRadius: 8,
                  fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4
                }}><Clock size={11} /> {course.hours} saat</span>
              </div>
              {/* Course info */}
              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 500, marginBottom: 8 }}>{course.category} • {course.level}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{course.title}</h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>{course.instructor}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <StarRating rating={course.rating} />
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>({course.students.toLocaleString("tr-TR")})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: COLORS.accent }}>₺{course.price}</span>
                    <span style={{ fontSize: 14, color: COLORS.textMuted, textDecoration: "line-through", marginLeft: 8 }}>₺{course.oldPrice}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart({...course, _id: course.id, priceStr: course.price}); }}
                    style={{
                      background: "rgba(0,212,170,0.1)", border: `1px solid ${COLORS.accent}`,
                      color: COLORS.accent, padding: "8px 16px", borderRadius: 10,
                      fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.accent; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,212,170,0.1)"; e.currentTarget.style.color = COLORS.accent; }}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="btn-secondary" onClick={() => onNavigate && onNavigate('courses')}>Tüm Kursları Görüntüle →</button>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section style={{
        padding: "80px 5%",
        background: `linear-gradient(180deg, rgba(0,212,170,0.03) 0%, transparent 100%)`,
      }}>
        <div className="stats-grid" style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div style={{ marginBottom: 12, color: COLORS.accent }}><stat.icon size={40} strokeWidth={1.5} /></div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 42, fontWeight: 800,
                color: COLORS.accent,
                marginBottom: 8,
              }}>
                <AnimatedCounter target={stat.value} />
              </div>
              <div style={{ fontSize: 15, color: COLORS.textMuted, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── LEARNING PATHS ───── */}
      <section style={{ padding: "80px 5%", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            Kariyer <span style={{ color: COLORS.accent }}>Yol Haritaları</span>
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
            Adım adım ilerleyebileceğin, sektör odaklı öğrenme yolları ile hedefine ulaş
          </p>
        </div>

        <div className="paths-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {PATHS.map((path, i) => (
            <div
              key={path.title}
              className={`path-card ${activePath === i ? "active" : ""}`}
              style={{ "--path-color": path.color }}
              onClick={() => setActivePath(i)}
            >
              <div style={{
                position: "absolute", top: 0, right: 0, width: 120, height: 120,
                background: `radial-gradient(circle, ${path.color}15 0%, transparent 70%)`,
                borderRadius: "0 20px 0 0"
              }} />
              <div className="feature-icon" style={{ background: `${path.color}18`, marginBottom: 20 }}>
                <path.icon size={24} color={path.color} />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{path.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20 }}>{path.desc}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {path.skills.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
              <div style={{
                display: "flex", gap: 20, fontSize: 13, color: COLORS.textMuted,
                borderTop: `1px solid ${COLORS.border}`, paddingTop: 16
              }}>
                <span style={{display: 'flex', alignItems: 'center', gap: 6}}><BookOpen size={14} /> {path.courses} Kurs</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 6}}><Clock size={14} /> {path.hours} Saat</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── WHY US ───── */}
      <section style={{
        padding: "80px 5%",
        background: `linear-gradient(180deg, ${COLORS.surface}80 0%, transparent 100%)`
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              Neden <span style={{ color: COLORS.accent }}>EduVerse</span>?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: Video, title: "Canlı & Kayıtlı Dersler", desc: "Uzman eğitmenlerle canlı oturumlar ve istediğin zaman izleyebileceğin kayıtlar", color: COLORS.accent },
              { icon: Briefcase, title: "Proje Tabanlı Öğrenme", desc: "Gerçek dünya projeleriyle portföyünü güçlendir ve iş başvurularında öne çık", color: COLORS.accentAlt },
              { icon: Award, title: "Uluslararası Sertifikalar", desc: "Sektörde tanınan ve LinkedIn profiline ekleyebileceğin geçerli sertifikalar", color: COLORS.gold },
              { icon: Users, title: "Mentor Desteği", desc: "Her kursiyere özel atanan mentorlarla birebir destek ve kariyer rehberliği", color: COLORS.warm },
              { icon: LineChart, title: "Kişisel İlerleme Takibi", desc: "AI destekli analitik panelle güçlü ve zayıf yönlerini keşfet", color: "#74b9ff" },
              { icon: Globe, title: "Topluluk & Networking", desc: "10.000+ üyeli aktif toplulukta sektör profesyonelleriyle bağlantı kur", color: "#55efc4" },
              { icon: Smartphone, title: "Mobil Uygulama Desteği", desc: "İstediğin her yerde, telefon veya tabletinden eğitime kesintisiz devam et", color: "#a29bfe" },
              { icon: BrainCircuit, title: "Mülakat Hazırlığı", desc: "Teknik mülakat simülasyonları ve CV danışmanlığı ile iş bulma sürecini hızlandır", color: "#fd79a8" }
            ].map((f) => (
              <div key={f.title} style={{
                padding: 28, borderRadius: 18, background: COLORS.primary,
                border: `1px solid ${COLORS.border}`, transition: "all 0.3s",
              }}>
                <div className="feature-icon" style={{ background: `${f.color}18`, marginBottom: 16 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section style={{ padding: "80px 5%", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            Öğrencilerimiz <span style={{ color: COLORS.accentAlt }}>Ne Diyor?</span>
          </h2>
        </div>
        <div className="testimonials-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24
        }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div style={{ fontSize: 32, color: COLORS.accent, marginBottom: 16, opacity: 0.4, fontFamily: "serif" }}>"</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.text, marginBottom: 24 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: COLORS.surfaceLight, display: "flex", alignItems: "center", justifyContent: "center"
                }}><t.avatar size={24} color={COLORS.accent} /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.accent }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section style={{
        padding: "80px 5%", margin: "40px 5%", borderRadius: 32,
        background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.surfaceLight} 50%, rgba(108,92,231,0.15) 100%)`,
        border: `1px solid ${COLORS.border}`, textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.accent}10, transparent)`,
        }} />
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 16, position: "relative", color: COLORS.text }}>
          Öğrenmeye Başlamak İçin
          <span style={{ color: COLORS.accent }}> Geç Değil!</span>
        </h2>
        <p style={{ color: COLORS.textMuted, fontSize: 17, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7, position: "relative" }}>
          Ücretsiz hesap oluştur, ilk kursunu seç ve geleceğine yatırım yapmaya hemen başla.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <button style={{ 
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentAlt})`, 
            color: 'white', border: 'none', padding: '16px 40px', borderRadius: 12, 
            fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: `0 8px 24px ${COLORS.accent}40`
          }} onClick={() => onNavigate && onNavigate('register')}>
            Ücretsiz Hesap Oluştur
          </button>
          <button style={{ 
            background: 'transparent', color: COLORS.text, border: `2px solid ${COLORS.border}`, 
            padding: '16px 40px', borderRadius: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer', 
            transition: 'all 0.3s'
          }} 
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.text; }}
          onClick={() => onNavigate && onNavigate('courses')}>
            Kursları İncele
          </button>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{
        padding: "64px 5% 32px", borderTop: `1px solid ${COLORS.border}`,
        marginTop: 60, background: COLORS.surface
      }}>
        <div className="footer-grid" style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#00d4aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, color: 'white'
              }}>E</div>
              <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
                <span style={{ color: isDark ? '#fff' : '#1e293b' }}>Edu</span>
                <span style={{ color: '#00d4aa' }}>Verse</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 300 }}>
              Teknoloji eğitiminde yeni nesil öğrenme deneyimi. Sektörün en iyi eğitmenleriyle, proje tabanlı ve sertifikalı eğitimler.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Tüm Kurslar", "Yol Haritaları", "Sertifikalar", "Fiyatlandırma", "Kurumsal Çözümler"] },
            { title: "Topluluk", links: ["Blog", "Forum", "Discord", "Etkinlikler", "Hackathonlar"] },
            { title: "Destek", links: ["SSS", "İletişim", "Gizlilik Politikası", "Kullanım Koşulları", "Kariyer"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, marginBottom: 16, fontSize: 15 }}>{col.title}</h4>
              {col.links.map((l) => (
                <span key={l} style={{
                  display: "block", color: COLORS.textMuted, textDecoration: "none",
                  fontSize: 14, marginBottom: 10, transition: "color 0.3s", cursor: "pointer"
                }}>{l}</span>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: `1px solid ${COLORS.border}`, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16, maxWidth: 1280, margin: "0 auto"
        }}>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>© 2026 EduVerse. Tüm hakları saklıdır.</span>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { id: 'x', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              { id: 'linkedin', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              { id: 'instagram', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
              { id: 'youtube', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
              { id: 'gmail', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> }
            ].map((s) => (
              <span key={s.id} style={{
                width: 36, height: 36, borderRadius: 10, background: COLORS.surfaceLight, color: COLORS.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.3s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.accent; e.currentTarget.style.background = `${COLORS.accent}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.background = COLORS.surfaceLight; }}
              >
                {s.svg}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
