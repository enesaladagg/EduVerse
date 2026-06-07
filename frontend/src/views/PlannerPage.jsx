import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Play, Plus, MoreHorizontal, Target } from 'lucide-react';
import Button from '../components/Button';

import api from '../services/api';

export default function PlannerPage() {
  const { palette: p, tokens: t, isDark } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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
    try {
      const res = await api.addPlannerTask({ title: newTaskTitle, duration: '30 dk', status: 'todo' });
      if (res.success) {
        setTasks([...tasks, res.data]);
        setNewTaskTitle('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Görev eklenirken hata:', err);
    }
  };

  const handleStartFocus = (taskTitle) => {
    // Pomodoro timer'ı açması için alert/toast. (İleride global state veya custom event ile entegre edilebilir)
    alert(`"${taskTitle}" görevi için Pomodoro odaklanma modu başlatıldı! Sağ alttaki sayacı kontrol edin.`);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Basit Takvim Grid'i (Demo amaçlı statik gün oluşturma)
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 2); // Geçmiş aydan bikaç gün sarkması için

  return (
    <div style={{ marginTop: '80px', padding: '24px 5% 40px', display: 'flex', gap: t.spacing[8], alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)', background: p.background, fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }}>
      
      {/* Left Column: Calendar Grid & AI Generator */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: p.text, margin: '0 0 8px 0', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CalendarIcon size={32} color={p.accent} /> Akıllı Planlayıcı
            </h1>
            <p style={{ color: p.textMuted, margin: 0, fontSize: 16 }}>Derslerini, ödevlerini ve hedeflerini tek bir yerden yönet.</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '12px 24px', borderRadius: '14px', fontWeight: 800 }}>
            <Plus size={18} style={{ marginRight: 8 }} /> {showAddForm ? 'Kapat' : 'Yeni Etkinlik'}
          </Button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 12, background: p.panelElevated, padding: 16, borderRadius: 16, border: `1px solid ${p.border}` }}>
            <input 
              type="text" 
              value={newTaskTitle} 
              onChange={e => setNewTaskTitle(e.target.value)} 
              placeholder="Görev adı..." 
              style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: `1px solid ${p.border}`, background: p.background, color: p.text, outline: 'none' }} 
              autoFocus
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
              Hangi kursu ne kadar sürede bitirmek istediğini söyle, EduBot senin için günlük takvimine dersleri ve Pomodoro seanslarını otomatik dağıtsın.
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

        {/* Calendar Grid */}
        <div style={{ 
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px', 
          border: `1px solid ${p.border}`, padding: '24px', boxShadow: t.shadows.sm 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: p.text }}>Haziran 2026</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: p.panelElevated, border: `1px solid ${p.border}`, borderRadius: '8px', padding: '6px 12px', color: p.text, cursor: 'pointer' }}>Aylık</button>
              <button style={{ background: p.accent, border: 'none', borderRadius: '8px', padding: '6px 12px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Haftalık</button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {days.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: p.textMuted, marginBottom: 8 }}>{d}</div>)}
            
            {dates.map((d, i) => {
              const isToday = d === 6; // Bugünün 6 Haziran olduğunu farz edelim
              const isCurrentMonth = d > 0 && d <= 30;
              const hasEvent = d === 6 || d === 12 || d === 18 || d === 24;

              return (
                <div key={i} style={{ 
                  aspectRatio: '1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: isToday ? p.accent : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
                  border: isToday ? 'none' : `1px solid ${p.border}`,
                  color: isToday ? '#fff' : (isCurrentMonth ? p.text : p.border),
                  fontWeight: isToday ? 800 : 600,
                  fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                }}>
                  {d > 0 && d <= 30 ? d : (d <= 0 ? 31 + d : d - 30)}
                  {hasEvent && !isToday && (
                    <div style={{ position: 'absolute', bottom: 8, width: 6, height: 6, borderRadius: '50%', background: p.accent }} />
                  )}
                  {isToday && (
                    <div style={{ position: 'absolute', bottom: 8, width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Daily Agenda & Progress */}
      <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Progress Ring Card */}
        <div style={{ 
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px', 
          border: `1px solid ${p.border}`, padding: '32px', boxShadow: t.shadows.md,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: p.text }}>Bugünün İlerlemesi</h3>
          
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

        {/* Daily Tasks */}
        <div style={{ 
          background: isDark ? 'rgba(255,255,255,0.02)' : '#fff', borderRadius: '24px', 
          border: `1px solid ${p.border}`, padding: '24px', boxShadow: t.shadows.md, flex: 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Günün Ajandası</h3>
            <button style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loading ? (
              <div style={{ color: p.textMuted, textAlign: 'center', padding: 20 }}>Yükleniyor...</div>
            ) : tasks.length === 0 ? (
              <div style={{ color: p.textMuted, textAlign: 'center', padding: 20 }}>Görev bulunamadı. Yeni bir tane ekleyin!</div>
            ) : tasks.map(task => (
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
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: p.text, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: 13, color: p.textMuted, fontWeight: 500, marginTop: 4 }}>
                        {task.course || 'Genel Görev'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${p.border}`, paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: p.textMuted, fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {task.time || '12:00'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={14} /> {task.duration || '30 dk'}</span>
                  </div>
                  
                  {task.status !== 'completed' && !task.isLive && (
                    <button onClick={() => handleStartFocus(task.title)} style={{ 
                      background: `${p.accent}15`, color: p.accent, border: 'none', padding: '6px 12px', 
                      borderRadius: '8px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                      transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.background = `${p.accent}30`} onMouseLeave={e => e.currentTarget.style.background = `${p.accent}15`}>
                      <Play size={12} style={{ fill: p.accent }} /> Odağı Başlat
                    </button>
                  )}

                  {task.isLive && (
                    <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 800 }}>
                      🔴 CANLI YAYIN
                    </span>
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
