import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles } from 'lucide-react';

export default function ComingSoonView({ title = "Çok Yakında", description = "Bu modül üzerinde çalışıyoruz. Harika güncellemeler için takipte kalın!" }) {
  const { palette: p, tokens: t } = useTheme();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: t.spacing[6] }}>
      <div style={{ 
        width: 100, height: 100, borderRadius: '50%', 
        background: `linear-gradient(135deg, ${p.accent}20, ${p.panelElevated})`, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        marginBottom: t.spacing[6], color: p.accent,
        boxShadow: `0 10px 40px ${p.accent}30`
      }}>
        <Sparkles size={48} strokeWidth={1.5} />
      </div>
      <h1 style={{ color: p.text, fontSize: t.typography.fontSize['4xl'], marginBottom: t.spacing[4], fontWeight: 800 }}>
        {title}
      </h1>
      <p style={{ color: p.textMuted, maxWidth: 450, lineHeight: 1.6, fontSize: t.typography.fontSize.lg }}>
        {description}
      </p>
      
      <div style={{ marginTop: t.spacing[8], padding: t.spacing[5], background: p.panelElevated, borderRadius: t.borderRadius.xl, border: `1px solid ${p.border}` }}>
        <p style={{ color: p.accent, fontWeight: 600, margin: 0 }}>Geliştirme Aşamasında 🚀</p>
      </div>
    </div>
  );
}
