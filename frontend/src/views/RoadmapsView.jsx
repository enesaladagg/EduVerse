import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function RoadmapsView() {
  const { palette: p } = useTheme();
  return (
    <div style={{ padding: 40, color: p.text, background: p.shell, minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, marginBottom: 16 }}>Kariyer Yol Haritaları</h1>
      <p style={{ color: p.textMuted }}>Adım adım ilerleyebileceğin, sektör odaklı öğrenme yolları burada olacak.</p>
    </div>
  );
}
