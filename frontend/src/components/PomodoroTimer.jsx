import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Play, Square, RotateCcw, Target, Coffee, ChevronRight, Timer, Settings2 } from 'lucide-react';

export default function PomodoroTimer() {
  const { palette: p, tokens: t } = useTheme();
  const [focusTime, setFocusTime] = useState(25);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Yeni Ayarlar State'leri
  const [showSettings, setShowSettings] = useState(false);
  const [themeColor, setThemeColor] = useState('#00D4AA');
  const [clockStyle, setClockStyle] = useState('modern'); // 'modern' | 'digital' | 'neon'

  // Sürükleme (Drag) State'leri
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = React.useRef({ startX: 0, startY: 0, initialOffsetX: 0, initialOffsetY: 0 });

  const handleMouseDown = (e) => {
    // Butonlara tıklandığında sürüklemeyi başlatma
    if (e.target.closest('button')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialOffsetX: offset.x,
      initialOffsetY: offset.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setOffset({
        x: dragRef.current.initialOffsetX + dx,
        y: dragRef.current.initialOffsetY + dy
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Kısayol: Alt + P
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const focusOptions = [
    { value: 15, label: '15 dk (Kısa)' },
    { value: 25, label: '25 dk (Klasik)' },
    { value: 45, label: '45 dk (Derin)' },
    { value: 60, label: '60 dk (Uzun)' },
    { value: 'custom', label: 'Özel Seçim' },
  ];

  const activeTotal = mode === 'focus' 
    ? (focusTime === 'custom' ? customFocus : focusTime) * 60 
    : (focusTime === 'custom' ? customBreak : (focusTime > 25 ? 10 : 5)) * 60;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (mode === 'focus') {
        setMode('break');
        if (focusTime === 'custom') {
          setTimeLeft(customBreak * 60);
        } else {
          setTimeLeft((focusTime > 25 ? 10 : 5) * 60);
        }
      } else {
        setMode('focus');
        setTimeLeft((focusTime === 'custom' ? customFocus : focusTime) * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, focusTime, customFocus, customBreak]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    const activeFocus = focusTime === 'custom' ? customFocus : focusTime;
    const activeBrk = focusTime === 'custom' ? customBreak : (focusTime > 25 ? 10 : 5);
    setTimeLeft(mode === 'focus' ? activeFocus * 60 : activeBrk * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const pct = activeTotal ? (timeLeft / activeTotal) : 0;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const strokeOffset = circ - (pct * circ);

  let bgRgba = p.panelElevated;
  if (p.panelElevated && p.panelElevated.length === 7) {
    const r = parseInt(p.panelElevated.slice(1,3), 16);
    const g = parseInt(p.panelElevated.slice(3,5), 16);
    const b = parseInt(p.panelElevated.slice(5,7), 16);
    bgRgba = `rgba(${r}, ${g}, ${b}, 0.85)`;
  }

  const primaryColor = mode === 'focus' ? themeColor : p.live;

  const renderClockFace = () => {
    if (clockStyle === 'neon') {
      return (
        <div style={{
          fontSize: '36px', 
          fontWeight: 800, 
          color: '#fff',
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
          letterSpacing: '1px'
        }}>
          {formatTime(timeLeft)}
        </div>
      );
    }

    if (clockStyle === 'digital') {
      return (
        <div style={{
          fontSize: '34px', 
          fontWeight: 700, 
          color: primaryColor,
          fontFamily: "'Courier New', monospace",
          letterSpacing: '2px',
          background: `rgba(0,0,0,0.1)`,
          padding: '4px 12px',
          borderRadius: '8px',
          border: `1px solid ${primaryColor}40`
        }}>
          {formatTime(timeLeft)}
        </div>
      );
    }

    // Default Modern
    return (
      <div style={{
        fontSize: '32px', 
        fontWeight: 800, 
        color: p.text,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '-1px'
      }}>
        {formatTime(timeLeft)}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap');
        `}
      </style>
      
      {/* Gizlendiğinde Görünen Yüzen Buton */}
      <button
        onClick={() => setIsCollapsed(false)}
        title="Pomodoro'yu Aç (Alt + P)"
        style={{
          position: 'fixed',
          bottom: t.spacing[4],
          right: t.spacing[4],
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: bgRgba,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${p.border}`,
          boxShadow: t.shadows.xl,
          color: isActive ? primaryColor : p.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 49,
          transform: isCollapsed ? 'scale(1)' : 'scale(0) rotate(-90deg)',
          opacity: isCollapsed ? 1 : 0,
          pointerEvents: isCollapsed ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Timer size={24} />
        {isActive && (
          <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 8px ${primaryColor}`, animation: 'pulse 2s infinite' }} />
        )}
      </button>

      {/* Ana Pomodoro Kutusu */}
      <div style={{
        position: 'fixed',
        bottom: t.spacing[4],
        right: t.spacing[4],
        background: bgRgba,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${p.border}`,
        borderRadius: t.borderRadius['2xl'],
        padding: t.spacing[5],
        boxShadow: t.shadows.xl,
        zIndex: 50,
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: t.spacing[5],
        transform: isCollapsed ? 'translateX(120%)' : `translate(${offset.x}px, ${offset.y}px)`,
        opacity: isCollapsed ? 0 : 1,
        pointerEvents: isCollapsed ? 'none' : 'auto',
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div 
          onMouseDown={handleMouseDown}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: primaryColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {mode === 'focus' ? <Target size={14} /> : <Coffee size={14} />}
            {mode === 'focus' ? 'Odaklan' : 'Mola'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isActive && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, boxShadow: `0 0 10px ${primaryColor}`, animation: 'pulse 2s infinite' }} />
            )}
            {!showSettings && (
              <button
                onClick={() => setShowSettings(true)}
                title="Ayarlar"
                style={{
                  background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px',
                  borderRadius: '50%', transition: 'background 0.2s', margin: '-4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${p.border}50`}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Settings2 size={16} />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(true)}
              title="Gizle (Alt + P)"
              style={{
                background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px',
                borderRadius: '50%', transition: 'background 0.2s', margin: '-4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${p.border}50`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {showSettings ? (
          // Ayarlar Görünümü
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.2s ease' }}>
            
            {/* Tema Seçimi */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: p.text }}>Tema Rengi</span>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {['#00D4AA', '#7C5CFC', '#FF8C42', '#EC4899'].map(c => (
                  <button
                    key={c}
                    onClick={() => setThemeColor(c)}
                    style={{ 
                      width: 28, height: 28, borderRadius: '50%', background: c, 
                      border: themeColor === c ? `3px solid ${p.text}` : 'none', 
                      boxShadow: themeColor === c ? `0 0 10px ${c}` : 'none',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Saat Stili Seçimi */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: p.text }}>Saat Görünümü</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {['modern', 'digital', 'neon'].map(s => (
                  <button
                    key={s}
                    onClick={() => setClockStyle(s)}
                    style={{ 
                      padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      background: clockStyle === s ? `${themeColor}20` : p.panel,
                      color: clockStyle === s ? themeColor : p.text,
                      border: `1px solid ${clockStyle === s ? themeColor : p.border}`,
                      fontWeight: clockStyle === s ? 600 : 500,
                      fontSize: 13, transition: 'all 0.2s'
                    }}
                  >
                    {s === 'modern' ? 'Modern (Standart)' : s === 'digital' ? 'Dijital (Retro)' : 'Neon (Parlak)'}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              style={{ 
                padding: '10px', background: themeColor, color: '#fff', 
                border: 'none', borderRadius: 8, cursor: 'pointer', 
                marginTop: 4, fontWeight: 600, fontSize: 14 
              }}
            >
              Tamamla
            </button>
          </div>
        ) : (
          // Ana Zamanlayıcı Görünümü
          <>
            {/* Animated SVG Ring + Time */}
            <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="130" height="130" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="65" cy="65" r={r} fill="transparent" stroke={p.border} strokeWidth="6" />
                <circle 
                  cx="65" cy="65" r={r} fill="transparent" 
                  stroke={primaryColor} 
                  strokeWidth="6" 
                  strokeDasharray={circ} 
                  strokeDashoffset={strokeOffset} 
                  strokeLinecap="round"
                  style={{ transition: isActive ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              {renderClockFace()}
            </div>

            {/* Options */}
            {!isActive && mode === 'focus' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: t.borderRadius.lg,
                      border: `1px solid ${isDropdownOpen ? primaryColor : p.border}`,
                      background: p.panel,
                      color: p.text,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {focusOptions.find(o => o.value === focusTime)?.label || 'Özel Seçim'}
                    <svg 
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: p.textMuted }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  
                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px',
                      background: p.panel, border: `1px solid ${p.border}`, borderRadius: t.borderRadius.lg,
                      boxShadow: t.shadows.xl, zIndex: 60, overflow: 'hidden',
                      animation: 'fadeIn 0.2s ease',
                    }}>
                      {focusOptions.map(opt => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            const val = opt.value;
                            if (val === 'custom') {
                              setFocusTime('custom');
                              setTimeLeft(customFocus * 60);
                            } else {
                              setFocusTime(val);
                              setTimeLeft(val * 60);
                            }
                            setIsDropdownOpen(false);
                          }}
                          onMouseEnter={(e) => {
                            if (focusTime !== opt.value) e.currentTarget.style.background = `rgba(${parseInt(primaryColor.slice(1,3),16)},${parseInt(primaryColor.slice(3,5),16)},${parseInt(primaryColor.slice(5,7),16)}, 0.1)`;
                          }}
                          onMouseLeave={(e) => {
                            if (focusTime !== opt.value) e.currentTarget.style.background = 'transparent';
                          }}
                          style={{
                            padding: '10px 14px', fontSize: '13px', cursor: 'pointer',
                            background: focusTime === opt.value ? `rgba(${parseInt(primaryColor.slice(1,3),16)},${parseInt(primaryColor.slice(3,5),16)},${parseInt(primaryColor.slice(5,7),16)}, 0.2)` : 'transparent',
                            color: focusTime === opt.value ? primaryColor : p.text,
                            fontWeight: focusTime === opt.value ? 700 : 500,
                            transition: 'background 0.2s'
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {focusTime === 'custom' && (
                  <div style={{ display: 'flex', gap: t.spacing[2], animation: 'fadeIn 0.3s ease' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '11px', color: p.textMuted, flex: 1 }}>
                      Odak (dk)
                      <input
                        type="number"
                        min="1"
                        value={customFocus}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value || '1', 10));
                          setCustomFocus(val);
                          if (mode === 'focus') setTimeLeft(val * 60);
                        }}
                        style={{
                          marginTop: '4px', width: '100%', padding: '6px 8px',
                          borderRadius: t.borderRadius.md, border: `1px solid ${p.border}`,
                          background: p.panel, color: p.text, outline: 'none',
                        }}
                      />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '11px', color: p.textMuted, flex: 1 }}>
                      Mola (dk)
                      <input
                        type="number"
                        min="1"
                        value={customBreak}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value || '1', 10));
                          setCustomBreak(val);
                        }}
                        style={{
                          marginTop: '4px', width: '100%', padding: '6px 8px',
                          borderRadius: t.borderRadius.md, border: `1px solid ${p.border}`,
                          background: p.panel, color: p.text, outline: 'none',
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: t.spacing[3], width: '100%', justifyContent: 'center' }}>
              <button
                onClick={toggleTimer}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', padding: '12px 0', borderRadius: t.borderRadius.lg,
                  background: isActive ? 'transparent' : primaryColor,
                  color: isActive ? p.text : (mode === 'focus' ? '#000' : '#fff'),
                  border: isActive ? `1px solid ${p.border}` : 'none',
                  cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                {isActive ? <Square size={16} /> : <Play size={16} fill="currentColor" />}
                {isActive ? 'Durdur' : 'Başlat'}
              </button>
              <button
                onClick={resetTimer}
                style={{
                  width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: t.borderRadius.lg, background: p.panel, color: p.textMuted,
                  border: `1px solid ${p.border}`, cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                title="Sıfırla"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
