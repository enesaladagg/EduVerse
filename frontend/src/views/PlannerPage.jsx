import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Play, Plus, MoreHorizontal, Target, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';

const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DAYS_TR = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

export default function PlannerPage() {
  const { palette: p, tokens: t, isDark } = useTheme();

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('09:00');
  const [viewMode, setViewMode] = useState('month');

  React.useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.getPlannerTasks();
        if (res.success) setTasks(res.data);
      } catch (err) {
        console.error('Görevler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id || t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    setTasks(tasks.map(t => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t));
    try {
      await api.updatePlannerTask(id, { status: newStatus });
    } catch (err) {
      console.error('Görev güncellenirken hata:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const dueDate = new Date(selectedDate + 'T' + newTaskTime + ':00');
    try {
      const res = await api.addPlannerTask({
        title: newTaskTitle,
        dueDate: dueDate.toISOString(),
        status: 'todo',
      });
      if (res.success) {
        setTasks(prev => [...prev, res.data]);
        setNewTaskTitle('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Görev eklenirken hata:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    setTasks(prev => prev.filter(t => (t._id || t.id) !== id));
    try {
      await api.deletePlannerTask(id);
    } catch (err) {
      console.error('Görev silinirken hata:', err);
    }
  };

  // Takvim hesaplamaları
  const firstDayOfMonth = new Date(calYear, calMonth, 1);
  // Pazartesi=0 başlangıçlı: getDay() 0=Pazar → 6, 1=Pzt → 0 ...
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  const calCells = [];
  for (let i = 0; i < startOffset; i++) {
    calCells.push({ day: daysInPrevMonth - startOffset + 1 + i, currentMonth: false, date: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calCells.push({ day: d, currentMonth: true, date: dateStr });
  }
  const remaining = 42 - calCells.length;
  for (let i = 1; i <= remaining; i++) {
    calCells.push({ day: i, currentMonth: false, date: null });
  }

  // Seçili tarihe göre görev filtresi
  const dayTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return task.dueDate.slice(0, 10) === selectedDate;
    });
  }, [tasks, selectedDate]);

  // Tüm görevler
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Tarihe göre görev sayısı (takvim dotları için)
  const taskCountByDate = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const d = task.dueDate.slice(0, 10);
        map[d] = (map[d] || 0) + 1;
      }
    });
    return map;
  }, [tasks]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const todayStr = today.toISOString().slice(0, 10);
  const selectedLabel = selectedDate
    ? `${parseInt(selectedDate.slice(8), 10)} ${MONTHS_TR[parseInt(selectedDate.slice(5, 7), 10) - 1]}`
    : '';

  return (
    <div style={{ marginTop: '80px', padding: '24px 5% 40px', display: 'flex', gap: t.spacing[8], alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)', background: p.background, fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }}>

      {/* Sol: Takvim */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 32 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: p.text, margin: '0 0 8px 0', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CalendarIcon size={32} color={p.accent} /> Akıllı Planlayıcı
            </h1>
            <p style={{ color: p.textMuted, margin: 0, fontSize: 16 }}>Derslerini, ödevlerini ve hedeflerini tek bir yerden yönet.</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '12px 24px', borderRadius: '14px', fontWeight: 800 }}>
            <Plus size={18} style={{ marginRight: 8 }} /> {showAddForm ? 'Kapat' : 'Yeni Görev'}
          </Button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', background: p.panelElevated, padding: 16, borderRadius: 16, border: `1px solid ${p.border}` }}>
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder={`${selectedLabel} için görev adı...`}
              style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 12, border: `1px solid ${p.border}`, background: p.background, color: p.text, outline: 'none' }}
              autoFocus
            />
            <input
              type="time"
              value={newTaskTime}
              onChange={e => setNewTaskTime(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 12, border: `1px solid ${p.border}`, background: p.background, color: p.text, outline: 'none' }}
            />
            <Button variant="primary" type="submit" style={{ padding: '10px 20px', borderRadius: 12 }}>Ekle</Button>
          </form>
        )}

        {/* AI Planner Banner */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,0,0,0.2))' : 'linear-gradient(135deg, #e6fcf7, #fff)',
          border: `1px solid ${isDark ? 'rgba(0,212,170,0.3)' : '#00d4aa40'}`,
          borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: t.shadows.sm
        }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 800, color: p.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              ✨ Yapay Zeka ile Çalışma Planı Oluştur
            </h3>
            <p style={{ margin: 0, color: p.textMuted, fontSize: 14, maxWidth: 500 }}>
              Hangi kursu ne kadar sürede bitirmek istediğini söyle, EduBot senin için günlük takvimine dersleri otomatik dağıtsın.
            </p>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #00d4aa, #00b894)', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,212,170,0.3)'
          }}>
            Plan Oluştur
          </button>
        </div>

        {/* Takvim */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px',
          border: `1px solid ${p.border}`, padding: '24px', boxShadow: t.shadows.sm
        }}>
          {/* Ay navigasyonu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={prevMonth} style={{ background: p.panelElevated, border: `1px solid ${p.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: p.text, display: 'flex' }}>
                <ChevronLeft size={18} />
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: p.text, minWidth: 160, textAlign: 'center' }}>
                {MONTHS_TR[calMonth]} {calYear}
              </h2>
              <button onClick={nextMonth} style={{ background: p.panelElevated, border: `1px solid ${p.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: p.text, display: 'flex' }}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setViewMode('month')}
                style={{ background: viewMode === 'month' ? p.accent : p.panelElevated, border: viewMode === 'month' ? 'none' : `1px solid ${p.border}`, borderRadius: '8px', padding: '6px 12px', color: viewMode === 'month' ? '#fff' : p.text, fontWeight: viewMode === 'month' ? 700 : 500, cursor: 'pointer' }}>
                Aylık
              </button>
              <button
                onClick={() => setViewMode('week')}
                style={{ background: viewMode === 'week' ? p.accent : p.panelElevated, border: viewMode === 'week' ? 'none' : `1px solid ${p.border}`, borderRadius: '8px', padding: '6px 12px', color: viewMode === 'week' ? '#fff' : p.text, fontWeight: viewMode === 'week' ? 700 : 500, cursor: 'pointer' }}>
                Haftalık
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {DAYS_TR.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: p.textMuted, marginBottom: 4 }}>{d}</div>
            ))}
            {calCells.map((cell, i) => {
              const isToday = cell.date === todayStr;
              const isSelected = cell.date === selectedDate;
              const count = cell.date ? (taskCountByDate[cell.date] || 0) : 0;

              return (
                <div
                  key={i}
                  onClick={() => cell.currentMonth && cell.date && setSelectedDate(cell.date)}
                  style={{
                    aspectRatio: '1', borderRadius: '14px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: isToday ? p.accent : (isSelected ? (isDark ? 'rgba(0,212,170,0.2)' : '#e6fcf7') : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc')),
                    border: isToday || isSelected ? 'none' : `1px solid ${p.border}`,
                    color: isToday ? '#fff' : (isSelected ? p.accent : (cell.currentMonth ? p.text : p.border)),
                    fontWeight: isToday || isSelected ? 800 : 600,
                    fontSize: 15, cursor: cell.currentMonth ? 'pointer' : 'default',
                    transition: 'all 0.2s', position: 'relative',
                    opacity: cell.currentMonth ? 1 : 0.4,
                  }}
                >
                  {cell.day}
                  {count > 0 && !isToday && (
                    <div style={{
                      position: 'absolute', bottom: 5, width: 6, height: 6,
                      borderRadius: '50%',
                      background: isSelected ? p.accent : '#00d4aa'
                    }} />
                  )}
                  {isToday && count > 0 && (
                    <div style={{ position: 'absolute', bottom: 5, width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sağ: İlerleme + Günlük Ajanda */}
      <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Progress Ring */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px',
          border: `1px solid ${p.border}`, padding: '32px', boxShadow: t.shadows.md,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: p.text }}>Genel İlerleme</h3>
          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r="60" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="12" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="#00d4aa" strokeWidth="12"
                strokeLinecap="round" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={(2 * Math.PI * 60) * (1 - progressPct / 100)}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: p.text }}>%{progressPct}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: p.textMuted, textTransform: 'uppercase' }}>Tamamlandı</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 24, width: '100%', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: p.text }}>{completedCount}</div>
              <div style={{ fontSize: 12, color: p.textMuted, fontWeight: 600 }}>Biten</div>
            </div>
            <div style={{ width: 1, background: p.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: p.text }}>{totalCount - completedCount}</div>
              <div style={{ fontSize: 12, color: p.textMuted, fontWeight: 600 }}>Kalan</div>
            </div>
          </div>
        </div>

        {/* Günlük Ajanda */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px',
          border: `1px solid ${p.border}`, padding: '24px', boxShadow: t.shadows.md, flex: 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>{selectedLabel} Ajandası</h3>
            <button
              onClick={() => setShowAddForm(v => !v)}
              style={{ background: `${p.accent}15`, border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: p.accent, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 13 }}
            >
              <Plus size={14} /> Ekle
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              <div style={{ color: p.textMuted, textAlign: 'center', padding: 20 }}>Yükleniyor...</div>
            ) : dayTasks.length === 0 ? (
              <div style={{ color: p.textMuted, textAlign: 'center', padding: 20, fontSize: 14 }}>
                Bu gün için görev yok.<br />
                <span style={{ fontSize: 12, opacity: 0.7 }}>Üstteki "Ekle" butonuna basın.</span>
              </div>
            ) : dayTasks.map(task => (
              <div key={task._id || task.id} style={{
                padding: '16px', borderRadius: '16px', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                border: `1px solid ${p.border}`, display: 'flex', flexDirection: 'column', gap: 12,
                opacity: task.status === 'completed' ? 0.6 : 1, transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <button onClick={() => toggleTask(task._id || task.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: task.status === 'completed' ? p.accent : p.textMuted, marginTop: 2 }}>
                      {task.status === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: p.text, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ fontSize: 13, color: p.textMuted, fontWeight: 500, marginTop: 4 }}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTask(task._id || task.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: p.textMuted, opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${p.border}`, paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: p.textMuted, fontWeight: 600 }}>
                    {task.dueDate && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {new Date(task.dueDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <span style={{
                      background: task.priority === 'high' ? 'rgba(239,68,68,0.1)' : task.priority === 'medium' ? 'rgba(234,179,8,0.1)' : 'rgba(0,212,170,0.1)',
                      color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#ca8a04' : '#00d4aa',
                      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    }}>
                      {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>

                  {task.status !== 'completed' && (
                    <button onClick={() => alert(`"${task.title}" için Pomodoro başlatıldı!`)} style={{
                      background: `${p.accent}15`, color: p.accent, border: 'none', padding: '6px 12px',
                      borderRadius: '8px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                    }}>
                      <Play size={12} style={{ fill: p.accent }} /> Odağı Başlat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
