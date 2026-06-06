import React, { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ToggleSwitch = memo(function ToggleSwitch({ on, onChange, label }) {
  const { palette: p, tokens: t } = useTheme();
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing[3],
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: t.typography.fontSize.sm, color: p.text }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!on)}
        style={{
          width: 44,
          height: 24,
          borderRadius: t.borderRadius.full,
          border: 'none',
          background: on ? p.accent : p.pillInactive,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: t.transitions.fast,
        }} />
      </button>
    </label>
  );
});

const LiveAiPanel = memo(function LiveAiPanel({
  open,
  onClose,
  bgRemoval,
  setBgRemoval,
  bgBlur,
  setBgBlur,
  aiNoise,
  setAiNoise,
}) {
  const { palette: p, tokens: t } = useTheme();
  if (!open) return null;

  return (
    <div style={{
      width: 260,
      borderLeft: `1px solid ${p.border}`,
      background: p.panelElevated,
      padding: t.spacing[4],
      display: 'flex',
      flexDirection: 'column',
      gap: t.spacing[4],
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: p.text, fontWeight: t.typography.fontWeight.bold, fontSize: t.typography.fontSize.sm }}>
          AI Kontrolleri
        </span>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: p.textMuted, cursor: 'pointer' }}>✕</button>
      </div>
      <ToggleSwitch
        label="Arka Plan Kaldırma"
        on={bgRemoval}
        onChange={(v) => { setBgRemoval(v); if (v) setBgBlur(false); }}
      />
      <ToggleSwitch
        label="Arka Plan Bulanıklaştırma"
        on={bgBlur}
        onChange={(v) => { setBgBlur(v); if (v) setBgRemoval(false); }}
      />
      <ToggleSwitch label="Gürültü Engelleme (AI)" on={aiNoise} onChange={setAiNoise} />
    </div>
  );
});

export default LiveAiPanel;
