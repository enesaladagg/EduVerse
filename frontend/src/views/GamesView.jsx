import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Target, Flame, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';

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
  { id: '123', name: 'Sen', xp: 0, avatar: 'S', isCurrentUser: true }, // Will be updated dynamically
  { id: 5, name: 'Can Özgür', xp: 850, avatar: 'C', isCurrentUser: false },
];

export default function GamesView() {
  const { palette: p, tokens: t } = useTheme();
  const { user, addXP, unlockBadge } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const currentStreak = user?.streak || 1;
  const nextLevelXP = currentLevel * 500;
  const xpProgress = Math.min(100, (currentXP / nextLevelXP) * 100);

  // Update leaderboard with real user data
  const sortedLeaderboard = [...MOCK_LEADERBOARD].map(item => {
    if (item.isCurrentUser) {
      return { ...item, name: user?.name || 'Sen', xp: currentXP, avatar: user?.avatarInitials || 'S' };
    }
    return item;
  }).sort((a, b) => b.xp - a.xp);

  const handleTestGamification = () => {
    addXP(150);
    unlockBadge('first_step');
    if (currentXP + 150 >= 1000) {
      unlockBadge('expert');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: t.spacing[6] }}>
      
      {/* ─── HEADER & PROFILE BANNER ─── */}
      <div style={{
        background: `linear-gradient(135deg, ${p.accent}15, ${p.panel})`,
        borderRadius: t.borderRadius['2xl'],
        padding: t.spacing[8],
        marginBottom: t.spacing[8],
        border: `1px solid ${p.border}`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: t.spacing[8],
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Elements */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: p.accent, opacity: 0.05, filter: 'blur(50px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: -50, left: '20%', width: 150, height: 150, background: '#3b82f6', opacity: 0.05, filter: 'blur(40px)', borderRadius: '50%' }}></div>

        {/* Avatar & Basic Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[6], zIndex: 1 }}>
          <div style={{ 
            width: 96, height: 96, 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${p.accent}, #3b82f6)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: '#fff',
            boxShadow: `0 8px 24px ${p.accent}40`,
            border: `4px solid ${p.background}`
          }}>
            {user?.avatarInitials || '👤'}
          </div>
          <div>
            <h1 style={{ margin: 0, color: p.text, fontSize: t.typography.fontSize['3xl'], fontWeight: 800 }}>
              {user?.name || 'Öğrenci'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[3], marginTop: t.spacing[2] }}>
              <Badge style={{ background: `${p.accent}20`, color: p.accent, border: 'none', padding: '4px 12px', fontSize: 14 }}>
                Seviye {currentLevel}
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', fontWeight: 700, fontSize: 15, background: 'rgba(245, 158, 11, 0.1)', padding: '4px 12px', borderRadius: 50 }}>
                <Flame size={18} fill="#f59e0b" /> {currentStreak} Gün Seri
              </div>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ flex: 1, minWidth: 300, zIndex: 1, background: p.panelElevated, padding: t.spacing[5], borderRadius: t.borderRadius.xl, border: `1px solid ${p.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: t.spacing[2], fontWeight: 700 }}>
            <span style={{ color: p.text }}>Sonraki Seviyeye İlerleme</span>
            <span style={{ color: p.accent }}>{currentXP} / {nextLevelXP} XP</span>
          </div>
          <div style={{ height: 12, background: p.background, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${xpProgress}%`, 
              background: `linear-gradient(90deg, ${p.accent}, #3b82f6)`,
              borderRadius: 10,
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>
          <p style={{ margin: `${t.spacing[2]} 0 0`, fontSize: 13, color: p.textMuted }}>
            {nextLevelXP - currentXP} XP daha kazanarak Seviye {currentLevel + 1}'e ulaşabilirsin!
          </p>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div style={{ display: 'flex', gap: t.spacing[2], marginBottom: t.spacing[6], borderBottom: `1px solid ${p.border}`, paddingBottom: t.spacing[2] }}>
        {[
          { id: 'overview', label: 'Özet & Görevler', icon: Target },
          { id: 'badges', label: 'Rozetlerim', icon: Star },
          { id: 'leaderboard', label: 'Liderlik Tablosu', icon: Trophy }
        ].map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: active ? p.panelElevated : 'transparent',
                border: 'none',
                borderRadius: t.borderRadius.lg,
                color: active ? p.accent : p.textMuted,
                fontWeight: active ? 700 : 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── TAB CONTENT ─── */}
      
      {/* 1. ÖZET VE GÖREVLER */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: t.spacing[8] }}>
          <div>
            <h2 style={{ fontSize: 20, color: p.text, marginBottom: t.spacing[4], display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={24} color={p.accent} /> Günlük Hedefler
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
              {[
                { title: 'Güne Merhaba', desc: 'Platforma giriş yap.', xp: 20, done: true },
                { title: 'Derse Dönüş', desc: 'Kayıtlı olduğun bir kurstan 1 video izle.', xp: 50, done: false },
                { title: 'Meraklı', desc: 'Forumda bir soru sor veya cevapla.', xp: 40, done: false }
              ].map((task, i) => (
                <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: t.spacing[4], padding: t.spacing[4], background: task.done ? `${p.accent}0A` : p.panel }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: task.done ? p.accent : p.background, display: 'flex', alignItems: 'center', justifyContent: 'center', color: task.done ? '#fff' : p.textMuted }}>
                    {task.done ? <CheckCircle2 size={24} /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${p.textMuted}` }}></div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: p.text, fontSize: 16 }}>{task.title}</h4>
                    <p style={{ margin: 0, color: p.textMuted, fontSize: 13, marginTop: 2 }}>{task.desc}</p>
                  </div>
                  <div style={{ fontWeight: 800, color: task.done ? p.accent : p.textMuted }}>
                    +{task.xp} XP
                  </div>
                </Card>
              ))}
            </div>

            {/* Test Button for Simulation */}
            <div style={{ marginTop: t.spacing[6], padding: t.spacing[4], background: p.panelElevated, borderRadius: t.borderRadius.lg, border: `1px dashed ${p.accent}` }}>
              <h4 style={{ margin: '0 0 12px 0', color: p.text }}>🛠️ Demo Araçları</h4>
              <p style={{ fontSize: 13, color: p.textMuted, marginBottom: 12 }}>Aşağıdaki butona tıklayarak sistemin XP ve rozet ekleme animasyonlarını test edebilirsiniz.</p>
              <button onClick={handleTestGamification} style={{ padding: '8px 16px', background: p.accent, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                150 XP Ekle & Rozet Kazan
              </button>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 20, color: p.text, marginBottom: t.spacing[4], display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={24} color="#f59e0b" /> Haftalık Özet
            </h2>
            <Card style={{ background: p.panel, padding: t.spacing[5] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, borderBottom: `1px solid ${p.border}`, paddingBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: p.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Kazanılan XP</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: p.text, marginTop: 4 }}>{currentXP}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: p.textMuted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Sıralama</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', marginTop: 4 }}>#{sortedLeaderboard.findIndex(u => u.isCurrentUser) + 1}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 12 }}>Son Rozetlerin</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(user?.badges || []).slice(-4).map(bId => {
                    const bInfo = BADGES_DB.find(b => b.id === bId);
                    return bInfo ? (
                      <div key={bId} title={bInfo.name} style={{ width: 40, height: 40, borderRadius: '50%', background: `${bInfo.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {bInfo.icon}
                      </div>
                    ) : null;
                  })}
                  {(!user?.badges || user.badges.length === 0) && (
                    <span style={{ fontSize: 13, color: p.textMuted }}>Henüz rozet kazanmadın. Görevleri tamamlayarak ilk rozetini al!</span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. ROZETLERİM */}
      {activeTab === 'badges' && (
        <div>
          <h2 style={{ fontSize: 20, color: p.text, marginBottom: t.spacing[2] }}>Rozet Koleksiyonu</h2>
          <p style={{ color: p.textMuted, marginBottom: t.spacing[6] }}>Öğrenme yolculuğunda kazandığın tüm başarımlar burada sergilenir.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: t.spacing[4] }}>
            {BADGES_DB.map(badge => {
              const isEarned = (user?.badges || []).includes(badge.id);
              return (
                <Card key={badge.id} style={{ 
                  background: isEarned ? p.panelElevated : p.background, 
                  border: `1px solid ${isEarned ? badge.color + '40' : p.border}`,
                  opacity: isEarned ? 1 : 0.6,
                  display: 'flex', alignItems: 'center', gap: 16, padding: 16,
                  transition: 'all 0.3s'
                }}>
                  <div style={{ 
                    width: 64, height: 64, borderRadius: '50%', 
                    background: isEarned ? `${badge.color}20` : p.panel, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 32, filter: isEarned ? 'none' : 'grayscale(100%)' 
                  }}>
                    {isEarned ? badge.icon : <Lock size={24} color={p.textMuted} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, color: p.text, fontSize: 16, fontWeight: 700 }}>{badge.name}</h4>
                    <p style={{ margin: '4px 0 0', color: p.textMuted, fontSize: 12, lineHeight: 1.4 }}>{badge.desc}</p>
                    {!isEarned && <div style={{ fontSize: 11, fontWeight: 700, color: p.accent, marginTop: 6 }}>Hedef: {badge.req}</div>}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. LİDERLİK TABLOSU */}
      {activeTab === 'leaderboard' && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: t.spacing[8] }}>
            <Trophy size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 24, color: p.text, margin: 0 }}>Haftanın Liderleri</h2>
            <p style={{ color: p.textMuted, marginTop: 8 }}>En çok XP toplayan öğrencilerle yarış, zirveye yerleş!</p>
          </div>

          <div style={{ background: p.panel, borderRadius: t.borderRadius.xl, border: `1px solid ${p.border}`, overflow: 'hidden' }}>
            {sortedLeaderboard.map((u, i) => (
              <div key={u.id} style={{ 
                display: 'flex', alignItems: 'center', padding: '16px 24px', 
                background: u.isCurrentUser ? `${p.accent}10` : (i % 2 === 0 ? p.panelElevated : 'transparent'),
                borderBottom: i !== sortedLeaderboard.length - 1 ? `1px solid ${p.border}` : 'none'
              }}>
                <div style={{ width: 40, fontWeight: 800, fontSize: 18, color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : p.textMuted }}>
                  #{i + 1}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${p.background}, ${p.border})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: p.text, marginRight: 16 }}>
                  {u.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: u.isCurrentUser ? p.accent : p.text, fontSize: 16 }}>
                    {u.name} {u.isCurrentUser && <span style={{ fontSize: 12, background: p.accent, color: '#fff', padding: '2px 8px', borderRadius: 12, marginLeft: 8 }}>Sen</span>}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: p.text, fontSize: 16 }}>
                  {u.xp} <span style={{ fontSize: 12, color: p.textMuted, fontWeight: 600 }}>XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
