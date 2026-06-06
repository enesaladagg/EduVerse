import React, { memo, useMemo } from 'react';
import { designTokens as t } from '../design-system/tokens';

// ---------------------------------------------------------------------------
// Badge definition catalog
// ---------------------------------------------------------------------------
export const ACHIEVEMENT_CATALOG = [
  { id: 'first_login',   icon: '🚀', label: 'İlk Adım',       desc: 'Platforma ilk kez giriş yaptın',           xp: 50,  rarity: 'common'   },
  { id: 'first_course',  icon: '📚', label: 'İlk Ders',        desc: 'İlk kursunu tamamladın',                   xp: 100, rarity: 'common'   },
  { id: 'streak_3',      icon: '🔥', label: '3 Günlük Seri',   desc: '3 gün üst üste platforma girdin',          xp: 150, rarity: 'uncommon' },
  { id: 'quiz_ace',      icon: '🎯', label: 'Nişancı',         desc: 'Bir sınavdan tam puan aldın',              xp: 200, rarity: 'uncommon' },
  { id: 'code_first',    icon: '💻', label: 'Kodlama Başlangıcı', desc: 'Code Sandbox\'u ilk kez kullandın',    xp: 75,  rarity: 'common'   },
  { id: 'collab',        icon: '🤝', label: 'Takım Oyuncusu',  desc: 'Ortak tahta oturumuna katıldın',           xp: 125, rarity: 'uncommon' },
  { id: 'webrtc',        icon: '📡', label: 'Canlı Uzman',     desc: '10 canlı derse katıldın',                  xp: 300, rarity: 'rare'     },
  { id: 'top_student',   icon: '🏆', label: 'Zirvedeki Öğrenci', desc: 'Bu haftanın en iyi öğrencisisin',       xp: 500, rarity: 'epic'     },
];

const RARITY_STYLES = {
  common:   { border: t.colors.neutral[300],  bg: t.colors.neutral[50],   glow: 'none',                              label: 'Yaygın'     },
  uncommon: { border: t.colors.success[400],  bg: t.colors.success[50],   glow: `0 0 8px ${t.colors.success[300]}`,  label: 'Nadir'      },
  rare:     { border: t.colors.primary[400],  bg: t.colors.primary[50],   glow: `0 0 10px ${t.colors.primary[300]}`, label: 'Ender'      },
  epic:     { border: '#a855f7',              bg: '#faf5ff',              glow: '0 0 14px #c084fc',                  label: 'Efsanevi'   },
};

// ---------------------------------------------------------------------------
// XP level calculation
// ---------------------------------------------------------------------------
function calcLevel(xp) {
  // Level thresholds: 0, 200, 500, 1000, 1800, 3000 …
  const thresholds = [0, 200, 500, 1000, 1800, 3000, 4500, 6500, 9000, 12000];
  let lvl = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) lvl = i + 1;
    else break;
  }
  const current = thresholds[lvl - 1] ?? 0;
  const next = thresholds[lvl] ?? thresholds[thresholds.length - 1] * 1.5;
  const pct = Math.min(100, Math.round(((xp - current) / (next - current)) * 100));
  return { level: lvl, current, next, pct };
}

// ---------------------------------------------------------------------------
// Individual badge tile
// ---------------------------------------------------------------------------
const AchievementBadge = memo(function AchievementBadge({ badge, earned = false, compact = false }) {
  const rarity = RARITY_STYLES[badge.rarity] ?? RARITY_STYLES.common;

  return (
    <div
      title={`${badge.label}: ${badge.desc}`}
      style={{
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: 'center',
        gap: compact ? t.spacing[3] : t.spacing[2],
        padding: compact ? `${t.spacing[3]} ${t.spacing[4]}` : t.spacing[4],
        borderRadius: t.borderRadius.xl,
        border: `2px solid ${earned ? rarity.border : t.colors.neutral[200]}`,
        background: earned ? rarity.bg : t.colors.neutral[50],
        boxShadow: earned ? rarity.glow : 'none',
        opacity: earned ? 1 : 0.45,
        filter: earned ? 'none' : 'grayscale(1)',
        transition: t.transitions.base,
        cursor: earned ? 'default' : 'not-allowed',
        minWidth: compact ? 'unset' : '90px',
      }}
    >
      <span style={{ fontSize: compact ? '24px' : '32px', lineHeight: 1 }}>{badge.icon}</span>
      <div style={{ textAlign: compact ? 'left' : 'center' }}>
        <div style={{
          fontSize: compact ? t.typography.fontSize.sm : t.typography.fontSize.xs,
          fontWeight: t.typography.fontWeight.semibold,
          color: earned ? t.colors.text.primary : t.colors.text.disabled,
          whiteSpace: 'nowrap',
        }}>
          {badge.label}
        </div>
        {compact && (
          <div style={{ fontSize: t.typography.fontSize.xs, color: t.colors.text.secondary }}>
            {badge.desc}
          </div>
        )}
        <div style={{
          fontSize: '10px',
          color: earned ? rarity.border : t.colors.neutral[300],
          fontWeight: t.typography.fontWeight.bold,
        }}>
          +{badge.xp} XP
        </div>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// XP / Level progress bar (for header)
// ---------------------------------------------------------------------------
export const XPBar = memo(function XPBar({ xp = 0, compact = false }) {
  const { level, pct, next } = useMemo(() => calcLevel(xp), [xp]);

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2] }}>
        <div style={{
          width: '28px', height: '28px',
          borderRadius: t.borderRadius.full,
          background: `linear-gradient(135deg, ${t.colors.primary[500]}, ${t.colors.secondary[500]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '11px', fontWeight: t.typography.fontWeight.bold,
          flexShrink: 0,
        }}>
          {level}
        </div>
        <div style={{ minWidth: '80px' }}>
          <div style={{
            height: '6px',
            borderRadius: t.borderRadius.full,
            background: t.colors.neutral[200],
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${t.colors.primary[500]}, ${t.colors.secondary[400]})`,
              borderRadius: t.borderRadius.full,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: '10px', color: t.colors.text.secondary, marginTop: '2px' }}>
            {xp} / {next} XP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: t.spacing[5],
      borderRadius: t.borderRadius.xl,
      background: `linear-gradient(135deg, ${t.colors.primary[700]}, ${t.colors.secondary[700]})`,
      color: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[3], marginBottom: t.spacing[3] }}>
        <div style={{
          width: '52px', height: '52px',
          borderRadius: t.borderRadius.full,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: t.typography.fontSize['2xl'],
          fontWeight: t.typography.fontWeight.extrabold,
          border: '2px solid rgba(255,255,255,0.4)',
        }}>
          {level}
        </div>
        <div>
          <div style={{ fontSize: t.typography.fontSize.lg, fontWeight: t.typography.fontWeight.bold }}>
            Seviye {level}
          </div>
          <div style={{ fontSize: t.typography.fontSize.sm, opacity: 0.85 }}>
            {xp} XP kazanıldı
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '11px', opacity: 0.75 }}>Sonraki seviye</div>
          <div style={{ fontSize: t.typography.fontSize.sm, fontWeight: t.typography.fontWeight.semibold }}>
            {next} XP
          </div>
        </div>
      </div>
      <div style={{
        height: '10px',
        borderRadius: t.borderRadius.full,
        background: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: t.borderRadius.full,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '11px', marginTop: t.spacing[1], opacity: 0.75 }}>
        %{pct}
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Full achievements panel
// ---------------------------------------------------------------------------
function GamificationBadges({ earnedIds = [], xp = 0, compact = false }) {
  const { earned, locked } = useMemo(() => {
    const e = ACHIEVEMENT_CATALOG.filter((b) => earnedIds.includes(b.id));
    const l = ACHIEVEMENT_CATALOG.filter((b) => !earnedIds.includes(b.id));
    return { earned: e, locked: l };
  }, [earnedIds]);

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[3], flexWrap: 'wrap' }}>
        <XPBar xp={xp} compact />
        <div style={{ display: 'flex', gap: t.spacing[1] }}>
          {earned.slice(0, 5).map((b) => (
            <span key={b.id} title={b.label} style={{ fontSize: '20px', lineHeight: 1 }}>{b.icon}</span>
          ))}
          {earned.length > 5 && (
            <span style={{
              fontSize: '12px', color: t.colors.primary[500],
              fontWeight: t.typography.fontWeight.semibold,
              alignSelf: 'center',
            }}>
              +{earned.length - 5}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[6] }}>
      <XPBar xp={xp} />

      {/* Earned badges */}
      <div>
        <h3 style={{
          fontSize: t.typography.fontSize.base,
          fontWeight: t.typography.fontWeight.bold,
          color: t.colors.text.primary,
          marginBottom: t.spacing[3],
          display: 'flex', alignItems: 'center', gap: t.spacing[2],
        }}>
          🏅 Kazanılan Rozetler
          <span style={{
            background: t.colors.success[100], color: t.colors.success[700],
            borderRadius: t.borderRadius.full, padding: `2px ${t.spacing[2]}`,
            fontSize: '12px',
          }}>
            {earned.length}
          </span>
        </h3>
        {earned.length === 0 ? (
          <p style={{ color: t.colors.text.secondary, fontSize: t.typography.fontSize.sm }}>
            Henüz rozet kazanılmadı. Kurslara katıl ve görevleri tamamla!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: t.spacing[3],
          }}>
            {earned.map((b) => <AchievementBadge key={b.id} badge={b} earned />)}
          </div>
        )}
      </div>

      {/* Locked badges */}
      <div>
        <h3 style={{
          fontSize: t.typography.fontSize.base,
          fontWeight: t.typography.fontWeight.bold,
          color: t.colors.text.secondary,
          marginBottom: t.spacing[3],
          display: 'flex', alignItems: 'center', gap: t.spacing[2],
        }}>
          🔒 Kilitli Rozetler
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: t.spacing[3],
        }}>
          {locked.map((b) => <AchievementBadge key={b.id} badge={b} earned={false} />)}
        </div>
      </div>
    </div>
  );
}

export default memo(GamificationBadges);
