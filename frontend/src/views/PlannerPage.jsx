import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PlannerPage() {
  const { palette: p, tokens: t } = useTheme();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Matematik Ödevini Bitir', status: 'todo' },
    { id: 2, title: 'Fizik Dersi Tekrarı', status: 'in-progress' },
    { id: 3, title: 'Pomodoro Denemesi', status: 'completed' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask, status: 'todo' }]);
    setNewTask('');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'todo';
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  return (
    <div style={{ padding: t.spacing[6], maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: p.text, marginBottom: t.spacing[4] }}>📅 Takvim & Planlayıcı</h1>
      
      <form onSubmit={addTask} style={{ display: 'flex', gap: t.spacing[2], marginBottom: t.spacing[6] }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Yeni görev ekle..."
          style={{
            flex: 1,
            padding: t.spacing[3],
            borderRadius: t.borderRadius.md,
            border: `1px solid ${p.border}`,
            background: p.panelElevated,
            color: p.text,
          }}
        />
        <button
          type="submit"
          style={{
            padding: `0 ${t.spacing[4]}`,
            background: p.accent,
            color: '#fff',
            borderRadius: t.borderRadius.md,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Ekle
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: t.spacing[4] }}>
        {['todo', 'in-progress', 'completed'].map(status => (
          <div key={status} style={{ background: p.panel, padding: t.spacing[4], borderRadius: t.borderRadius.lg, border: `1px solid ${p.border}` }}>
            <h3 style={{ color: p.text, marginBottom: t.spacing[4], textTransform: 'uppercase', fontSize: t.typography.fontSize.sm }}>
              {status === 'todo' ? 'Yapılacaklar' : status === 'in-progress' ? 'Devam Edenler' : 'Tamamlananlar'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[2] }}>
              {tasks.filter(t => t.status === status).map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleStatus(task.id)}
                  style={{
                    padding: t.spacing[3],
                    background: p.panelElevated,
                    borderRadius: t.borderRadius.md,
                    cursor: 'pointer',
                    color: p.text,
                    borderLeft: `4px solid ${status === 'completed' ? p.success : p.accent}`,
                  }}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
