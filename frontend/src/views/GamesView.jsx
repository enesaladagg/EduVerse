import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Badge from '../components/Badge';

const GAMES = [
  { id: 1, title: 'Kelime Avcısı', category: 'Sözel Yetenek', icon: '📝', color: '#3b82f6', desc: 'Harfleri birleştir, kelimeleri bul!' },
  { id: 2, title: 'Matematik Yarışı', category: 'Sayısal Zeka', icon: '🧮', color: '#10b981', desc: 'Süre bitmeden en çok işlemi sen çöz.' },
  { id: 3, title: 'Kodlama Macerası', category: 'Mantık & Algoritma', icon: '🤖', color: '#8b5cf6', desc: 'Robotunu kodlayarak labirentten çıkar.' },
  { id: 4, title: 'Tarih Çarkı', category: 'Genel Kültür', icon: '🏛️', color: '#f59e0b', desc: 'Tarihi olayları kronolojik olarak sırala.' },
  { id: 5, title: 'Uzay Kaşifi', category: 'Bilim', icon: '🚀', color: '#ec4899', desc: 'Gezegenleri ve yıldızları keşfet.' },
  { id: 6, title: 'Hızlı Klavye', category: 'Pratik', icon: '⌨️', color: '#6366f1', desc: 'Ekrana düşen kelimeleri hızla yaz.' },
];

export default function GamesView() {
  const { palette: p, tokens: t } = useTheme();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: t.spacing[6] }}>
      <div style={{
        background: `linear-gradient(135deg, ${p.accent}20, transparent)`,
        borderRadius: t.borderRadius.xl,
        padding: t.spacing[8],
        marginBottom: t.spacing[8],
        border: `1px solid ${p.border}`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: t.spacing[2] }}>🎮</div>
        <h1 style={{ color: p.text, fontSize: t.typography.fontSize['3xl'], margin: 0 }}>
          İnteraktif Oyunlar
        </h1>
        <p style={{ color: p.textMuted, fontSize: t.typography.fontSize.lg, maxWidth: 600, margin: `${t.spacing[4]} auto 0` }}>
          Öğrenmeyi eğlenceli hale getiren eğitici mini oyunlar ve bulmacalar. Puan topla, arkadaşlarınla yarış!
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: t.spacing[6],
      }}>
        {GAMES.map(game => (
          <Card
            key={game.id}
            variant="elevated"
            hoverable
            interactive
            style={{ background: p.panel, border: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{
              height: 140,
              borderRadius: t.borderRadius.lg,
              background: `linear-gradient(135deg, ${game.color}20, ${p.panelElevated})`,
              border: `1px solid ${game.color}40`,
              marginBottom: t.spacing[4],
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
            }}>
              {game.icon}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.spacing[2] }}>
              <Badge style={{ background: `${game.color}20`, color: game.color, border: 'none' }}>{game.category}</Badge>
            </div>
            <h3 style={{ margin: 0, fontWeight: t.typography.fontWeight.bold, color: p.text, fontSize: t.typography.fontSize.xl }}>
              {game.title}
            </h3>
            <p style={{ fontSize: t.typography.fontSize.sm, color: p.textMuted, marginTop: t.spacing[2], flex: 1 }}>
              {game.desc}
            </p>
            <button style={{
              marginTop: t.spacing[4],
              padding: `${t.spacing[2]} ${t.spacing[4]}`,
              background: game.color,
              color: '#fff',
              border: 'none',
              borderRadius: t.borderRadius.md,
              fontWeight: t.typography.fontWeight.bold,
              cursor: 'pointer'
            }}>
              Oyuna Başla
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
