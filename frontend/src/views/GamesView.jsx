import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trophy, Star, Target, Flame, CheckCircle2, Lock, Sparkles, TrendingUp, Zap, ChevronRight, Medal, Code2 } from 'lucide-react';

const BADGES_DB = [
  { id: 'first_step', name: 'İlk Adım', desc: 'Platforma kayıt oldun ve ilk adımını attın.', icon: '🎯', color: '#3b82f6', req: 'Kayıt Olmak' },
  { id: 'fast_learner', name: 'Hızlı Öğrenen', desc: 'Bir günde 3 saatten fazla ders izledin.', icon: '⚡', color: '#f59e0b', req: 'Günde 3 saat ders' },
  { id: 'streak_3', name: 'İstikrarlı', desc: '3 gün üst üste giriş yaptın.', icon: '🔥', color: '#ef4444', req: '3 gün streak' },
  { id: 'expert', name: 'Uzman', desc: 'Toplam 1000 XP kazandın.', icon: '🏅', color: '#10b981', req: '1000 XP' },
  { id: 'community_leader', name: 'Topluluk Lideri', desc: 'Forumlarda 10 cevap yazdın.', icon: '💬', color: '#8b5cf6', req: '10 Forum Cevabı' },
  { id: 'course_master', name: 'Kurs Ustası', desc: '5 farklı kursu %100 tamamladın.', icon: '🎓', color: '#ec4899', req: '5 Kurs Bitirmek' }
];

const MOCK_LEADERBOARD = [
  { id: 1, name: 'Ayşe Yılmaz', xp: 2450, avatar: 'A', isCurrentUser: false },
  { id: 2, name: 'Mehmet Demir', xp: 2120, avatar: 'M', isCurrentUser: false },
  { id: 3, name: 'Zeynep Kaya', xp: 1980, avatar: 'Z', isCurrentUser: false },
  { id: '123', name: 'Sen', xp: 0, avatar: 'S', isCurrentUser: true },
  { id: 5, name: 'Can Özgür', xp: 850, avatar: 'C', isCurrentUser: false },
];

export default function GamesView() {
  const { palette: p, isDark } = useTheme();
  const { user, addXP, unlockBadge } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [ctfChallenges, setCtfChallenges] = useState([]);
  const [loadingCtf, setLoadingCtf] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchCtf() {
      try {
        const res = await api.getCtfChallenges();
        if (res.success) setCtfChallenges(res.data);
      } catch (err) {
        console.error('CTF çekilemedi:', err);
      } finally {
        setLoadingCtf(false);
      }
    }
    fetchCtf();
  }, []);

  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const currentStreak = user?.streak || 1;
  const nextLevelXP = currentLevel * 500;
  const xpProgress = Math.min(100, (currentXP / nextLevelXP) * 100);

  const sortedLeaderboard = [...MOCK_LEADERBOARD].map(item => {
    if (item.isCurrentUser) {
      return { ...item, name: user?.name || 'Sen', xp: currentXP, avatar: user?.avatarInitials || 'S' };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp);

  const handleTestGamification = () => {
    addXP(150);
    unlockBadge('first_step');
    if (currentXP + 150 >= 1000) unlockBadge('expert');
  };

  // SVG Circular Progress
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (xpProgress / 100) * circleCircumference;

  return (
    <div style={{ 
      maxWidth: 1280, 
      margin: '0 auto', 
      padding: '120px 24px 80px', 
      minHeight: '85vh',
      fontFamily: '"Inter", sans-serif',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      boxSizing: 'border-box'
    }}>
      
      {/* ─── HEADER ─── */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: p.text, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Kariyer & Ödüller
          </h1>
          <p style={{ margin: 0, color: p.textMuted, fontSize: '16px' }}>Öğrenme yolculuğunuzu takip edin ve başarılarınızı kutlayın.</p>
        </div>
        <button 
          onClick={handleTestGamification} 
          style={{ 
            padding: '10px 20px', background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', 
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
            color: p.text, borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Zap size={16} color="#f59e0b" /> Simüle Et (+150 XP)
        </button>
      </div>

      {/* ─── BENTO GRID LAYOUT ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* 1. KULLANICI PROFİL KARTI */}
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff', 
          borderRadius: '24px', padding: '32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.03)',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: p.accent, opacity: 0.05, filter: 'blur(40px)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', zIndex: 1 }}>
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <svg width="90" height="90" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
                <circle cx="45" cy="45" r={circleRadius} stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} strokeWidth="6" fill="none" />
                <circle 
                  cx="45" cy="45" r={circleRadius} 
                  stroke={p.accent} strokeWidth="6" fill="none" 
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </svg>
              <div style={{ 
                position: 'absolute', top: 5, left: 5, right: 5, bottom: 5, 
                background: `linear-gradient(135deg, ${p.accent}, #3b82f6)`, 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '24px', fontWeight: 800, border: `3px solid ${isDark ? '#1e293b' : '#fff'}`
              }}>
                {user?.avatarInitials || '👤'}
              </div>
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: p.text, fontWeight: 800 }}>{user?.name || 'Öğrenci'}</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ color: p.accent, fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Medal size={16} /> Seviye {currentLevel}
                </div>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: p.textMuted }} />
                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={16} fill="#f59e0b" /> {currentStreak} Gün
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: '20px', borderRadius: '16px', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: p.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>XP İlerlemesi</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: p.text }}>{currentXP} <span style={{ color: p.textMuted }}>/ {nextLevelXP}</span></span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: p.textMuted }}>
              Sonraki seviyeye sadece <strong style={{ color: p.text }}>{nextLevelXP - currentXP} XP</strong> kaldı. Harika gidiyorsun!
            </p>
          </div>
        </div>

        {/* 2. GÜNLÜK GÖREVLER */}
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff', 
          borderRadius: '24px', padding: '32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.03)',
          gridColumn: 'span 1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: p.text }}>Günlük Hedefler</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Güne Merhaba', desc: 'Platforma giriş yap.', xp: 20, done: true },
              { title: 'Derse Dönüş', desc: 'Kayıtlı olduğun bir kurstan en az 1 ders videosu izle.', xp: 50, done: false },
              { title: 'Topluluk Ruhu', desc: 'Soru-cevap forumunda aktif ol.', xp: 40, done: false }
            ].map((task, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'flex-start', gap: '16px',
                padding: '16px', borderRadius: '16px',
                background: task.done ? (isDark ? 'rgba(0,212,170,0.05)' : 'rgba(0,212,170,0.03)') : (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'),
                border: `1px solid ${task.done ? `${p.accent}30` : 'transparent'}`,
                transition: 'all 0.2s', cursor: 'default'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', 
                  background: task.done ? p.accent : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'), 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: '#fff', flexShrink: 0, marginTop: '2px'
                }}>
                  {task.done && <CheckCircle2 size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: task.done ? p.text : p.text, opacity: task.done ? 1 : 0.8 }}>{task.title}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: p.textMuted, lineHeight: 1.4 }}>{task.desc}</p>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: task.done ? p.accent : p.textMuted, paddingTop: '4px' }}>
                  +{task.xp} <span style={{ fontSize: '11px', fontWeight: 600 }}>XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LİDERLİK TABLOSU */}
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff', 
          borderRadius: '24px', padding: '32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.03)',
          gridColumn: '1 / -1' // Span full width on smaller screens, but controlled by grid on large
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: p.text }}>Haftalık Sıralama</h3>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: p.accent, background: `${p.accent}15`, padding: '6px 12px', borderRadius: '20px' }}>
              Sıranız: #{sortedLeaderboard.findIndex(u => u.isCurrentUser) + 1}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {sortedLeaderboard.slice(0, 3).map((u, i) => (
              <div key={u.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', 
                background: u.isCurrentUser ? (isDark ? 'rgba(0,212,170,0.08)' : '#f0fdfa') : (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'),
                borderRadius: '16px', border: u.isCurrentUser ? `1px solid ${p.accent}40` : `1px solid transparent`,
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: `linear-gradient(135deg, ${isDark ? '#334155' : '#e2e8f0'}, ${isDark ? '#0f172a' : '#cbd5e1'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: p.text, fontSize: '18px' }}>
                  {u.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : p.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>
                    {i === 0 ? '🏆 1. SIRA' : i === 1 ? '🥈 2. SIRA' : '🥉 3. SIRA'}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: p.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {u.name} {u.isCurrentUser && <span style={{ fontSize: '10px', background: p.accent, color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>SEN</span>}
                  </div>
                  <div style={{ fontSize: '13px', color: p.textMuted, marginTop: '2px', fontWeight: 600 }}>{u.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ROZETLERİM */}
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff', 
          borderRadius: '24px', padding: '32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.03)',
          gridColumn: '1 / -1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: p.text }}>Başarı Rozetleri</h3>
          </div>

          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'thin' }}>
            {BADGES_DB.map(badge => {
              const isEarned = (user?.badges || []).includes(badge.id);
              return (
                <div key={badge.id} style={{ 
                  minWidth: 160, padding: '24px 16px', 
                  background: isEarned ? `${badge.color}08` : (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'),
                  border: `1px solid ${isEarned ? `${badge.color}30` : (isDark ? 'rgba(255,255,255,0.05)' : 'transparent')}`,
                  borderRadius: '20px', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  transition: 'transform 0.2s', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    width: 64, height: 64, borderRadius: '16px', 
                    background: isEarned ? `${badge.color}15` : (isDark ? 'rgba(0,0,0,0.2)' : '#e2e8f0'), 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '28px', filter: isEarned ? 'none' : 'grayscale(100%) opacity(0.4)',
                    boxShadow: isEarned ? `0 8px 20px ${badge.color}30` : 'none',
                    border: `1px solid ${isEarned ? `${badge.color}50` : 'transparent'}`
                  }}>
                    {isEarned ? badge.icon : <Lock size={20} color={p.textMuted} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: isEarned ? p.text : p.textMuted }}>{badge.name}</div>
                    {!isEarned && <div style={{ fontSize: '11px', color: p.textMuted, marginTop: '4px' }}>Hedef: {badge.req}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. CTF / LABORATUVAR GÖREVLERİ */}
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff', 
          borderRadius: '24px', padding: '32px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.03)',
          gridColumn: '1 / -1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Code2 size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: p.text }}>CTF & Laboratuvar Görevleri</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {loadingCtf ? (
               <div style={{ color: p.textMuted }}>Görevler yükleniyor...</div>
            ) : ctfChallenges.map(challenge => {
               const isCompleted = user?.completedLabs?.includes(challenge._id) || user?.gamification?.completedChallenges?.some(c => c.challengeKey === challenge.key);
               return (
                 <div key={challenge.key} style={{
                   background: isCompleted ? (isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)') : (isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc'),
                   border: `1px solid ${isCompleted ? '#10b98150' : (isDark ? 'rgba(255,255,255,0.05)' : p.border)}`,
                   borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
                 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div>
                       <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: p.text }}>{challenge.title}</h4>
                       <div style={{ fontSize: '12px', color: p.textMuted, marginTop: '4px' }}>{challenge.category} • {challenge.level}</div>
                     </div>
                     <div style={{ background: '#10b98120', color: '#10b981', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                       +{challenge.points} XP
                     </div>
                   </div>
                   <p style={{ margin: 0, fontSize: '13px', color: p.textMuted, lineHeight: 1.4 }}>{challenge.description}</p>
                   <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                     <button
                       disabled={isCompleted}
                       onClick={async () => {
                         // Simulate completing task (In real life this needs the payload for the CTF)
                         try {
                           const payload = challenge.key === 'directory-traversal-101' ? { path: '../../etc/passwd' } : { requestedRole: 'admin' };
                           const res = await api.completeCtfChallenge(challenge.key, payload);
                           if (res.success) {
                             alert(`Tebrikler! ${res.awardedPoints} XP kazandınız.`);
                             window.location.reload(); // Quick refresh to update state
                           } else {
                             alert('Görev tamamlanamadı.');
                           }
                         } catch (err) {
                           alert('Görevi tamamlarken bir hata oluştu veya zaten tamamlandı.');
                         }
                       }}
                       style={{
                         background: isCompleted ? 'transparent' : p.accent,
                         color: isCompleted ? p.textMuted : '#fff',
                         border: isCompleted ? `1px solid ${p.border}` : 'none',
                         padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
                         cursor: isCompleted ? 'not-allowed' : 'pointer'
                       }}
                     >
                       {isCompleted ? 'Tamamlandı' : 'Laboratuvarı Çöz'}
                     </button>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
