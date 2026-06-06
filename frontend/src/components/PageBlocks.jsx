import React from 'react';

export const Badge = ({ children, color = "#00d4aa", filled = false }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 8,
    fontSize: 12, fontWeight: 600, letterSpacing: .3,
    background: filled ? color : `${color}12`, color: filled ? "#fff" : color,
    border: `1px solid ${color}20`,
  }}>{children}</span>
);

export const ProgressBar = ({ value, color = "#00d4aa", h = 8 }) => (
  <div style={{ width: "100%", height: h, borderRadius: h, background: "rgba(128,128,128,0.2)", overflow: 'hidden' }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: h, background: color, transition: "width 0.8s ease" }} />
  </div>
);

export const Card = ({ children, style: s, hover = true, onClick, C }) => (
  <div onClick={onClick} style={{
    background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
    boxShadow: C.shadow, transition: "all 0.3s", cursor: hover ? "pointer" : "default", ...s,
  }}
    onMouseEnter={hover ? e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = C.shadowLg; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = C.shadow; } : undefined}>
    {children}
  </div>
);

export const SectionHead = ({ title, sub, action, onAction, C }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
    <div>
      <h2 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.heading, marginBottom: sub ? 4 : 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 14, color: C.muted }}>{sub}</p>}
    </div>
    {action && <button onClick={onAction} style={{
      padding: "8px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.white,
      color: C.body, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.font,
    }}>{action}</button>}
  </div>
);

export const Tag = ({ children, color = "#00d4aa" }) => (
  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${color}10`, color }}>{children}</span>
);
