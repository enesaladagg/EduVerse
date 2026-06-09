import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext(null);

export function PomodoroProvider({ children }) {
  const [focusTime, setFocusTime] = useState(25);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'

  const activeTotal =
    mode === 'focus'
      ? (focusTime === 'custom' ? customFocus : focusTime) * 60
      : (focusTime === 'custom' ? customBreak : focusTime > 25 ? 10 : 5) * 60;

  const pct = activeTotal ? timeLeft / activeTotal : 0;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(
          focusTime === 'custom'
            ? customBreak * 60
            : (focusTime > 25 ? 10 : 5) * 60
        );
      } else {
        setMode('focus');
        setTimeLeft((focusTime === 'custom' ? customFocus : focusTime) * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, focusTime, customFocus, customBreak]);

  const toggleTimer = () => setIsActive((v) => !v);

  const resetTimer = () => {
    setIsActive(false);
    const f = focusTime === 'custom' ? customFocus : focusTime;
    const b = focusTime === 'custom' ? customBreak : focusTime > 25 ? 10 : 5;
    setTimeLeft(mode === 'focus' ? f * 60 : b * 60);
  };

  const changeFocusTime = (val) => {
    setFocusTime(val);
    if (val !== 'custom') setTimeLeft(val * 60);
    else setTimeLeft(customFocus * 60);
    setIsActive(false);
    setMode('focus');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <PomodoroContext.Provider
      value={{
        focusTime, setFocusTime, changeFocusTime,
        customFocus, setCustomFocus,
        customBreak, setCustomBreak,
        timeLeft, setTimeLeft,
        isActive, setIsActive,
        mode, setMode,
        activeTotal, pct,
        toggleTimer, resetTimer, formatTime,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
}
