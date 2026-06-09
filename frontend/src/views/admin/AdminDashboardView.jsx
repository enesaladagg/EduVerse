import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlobalNavbar from '../../components/GlobalNavbar';
import api from '../../services/api';
import {
  Users, BookOpen, DollarSign, Activity,
  CheckCircle, XCircle, Shield, Settings,
  TrendingUp, Search
} from 'lucide-react';

export default function AdminDashboardView({ onNavigate }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, coursesRes, statsRes, appsRes] = await Promise.all([
        api.getUsers().catch(() => ({ data: [] })),
        api.getCourses({ limit: 10 }).catch(() => ({ data: [] })),
        api.getAdminStats().catch(() => ({ data: { totalUsers: 0, totalCourses: 0, monthlyRevenue: 0 } })),
        api.getInstructorApplications().catch(() => ({ data: [] }))
      ]);
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data || []);
      setStats(statsRes.data || { totalUsers: 0, totalCourses: 0, monthlyRevenue: 0 });
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error("Admin paneli veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateRole = async (userId, role) => {
    setProcessing(true);
    try {
      await api.updateUserRole(userId, role);
      await fetchDashboardData();
      setSelectedUser(null);
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Kullanıcıyı tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    setProcessing(true);
    try {
      await api.deleteUser(userId);
      await fetchDashboardData();
      setSelectedUser(null);
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateCourseStatus = async (courseId, isActive) => {
    setProcessing(true);
    try {
      await api.updateCourseStatus(courseId, isActive);
      await fetchDashboardData();
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Kursu silmek istediğinize emin misiniz?")) return;
    setProcessing(true);
    try {
      await api.deleteCourse(courseId);
      await fetchDashboardData();
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveInstructor = async (id) => {
    setProcessing(true);
    try {
      await api.approveInstructor(id);
      await fetchDashboardData();
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectInstructor = async (id) => {
    setProcessing(true);
    try {
      await api.rejectInstructor(id);
      await fetchDashboardData();
    } catch (err) {
      alert("Hata: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const p = isDark ? {
    bg: '#04080f',
    surface: '#0c1a30',
    surfaceElevated: '#112240',
    border: 'rgba(255,255,255,0.05)',
    text: '#eef2ff',
    textMuted: '#94a3c8',
    accent: '#ef4444' // Admin paneli için otoriter kırmızı/bordo
  } : {
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#f1f5f9',
    border: 'rgba(0,0,0,0.05)',
    text: '#0f172a',
    textMuted: '#475569',
    accent: '#dc2626'
  };

  return (
    <div style={{ minHeight: '100vh', background: p.bg, color: p.text, fontFamily: '"Inter", sans-serif' }}>
      <GlobalNavbar activePage="admin" onNavigate={onNavigate} />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px 80px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${p.accent}20`, color: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                Yönetici Paneli
              </h1>
            </div>
            <p style={{ color: p.textMuted, margin: 0, fontSize: 16 }}>Platformun tüm kontrolü ve genel bakış.</p>
          </div>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
          {[
            { label: 'Toplam Kullanıcı', value: loading ? '...' : stats.totalUsers, icon: Users, color: '#3b82f6' },
            { label: 'Aktif Kurslar', value: loading ? '...' : stats.totalCourses, icon: BookOpen, color: '#10b981' },
            { label: 'Aylık Ciro', value: loading ? '...' : `₺${stats.monthlyRevenue?.toLocaleString('tr-TR')}`, icon: DollarSign, color: '#f59e0b' },
            { label: 'Sistem Yükü', value: '%24', icon: Activity, color: '#8b5cf6' }
          ].map((s, i) => (
            <div key={i} style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={28} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', color: p.textMuted, fontSize: 14, fontWeight: 600 }}>{s.label}</p>
                <h3 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          {/* Main Users Table */}
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Son Kayıt Olan Kullanıcılar</h2>
              <div style={{ position: 'relative' }}>
                <Search size={16} color={p.textMuted} style={{ position: 'absolute', left: 12, top: 10 }} />
                <input 
                  type="text" 
                  placeholder="Kullanıcı ara..." 
                  style={{ background: p.surfaceElevated, border: `1px solid ${p.border}`, color: p.text, padding: '8px 12px 8px 36px', borderRadius: 8, outline: 'none' }}
                />
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: `2px solid ${p.border}` }}>
                  <th style={{ padding: '12px 8px', color: p.textMuted, fontWeight: 600, fontSize: 13 }}>KULLANICI</th>
                  <th style={{ padding: '12px 8px', color: p.textMuted, fontWeight: 600, fontSize: 13 }}>ROL</th>
                  <th style={{ padding: '12px 8px', color: p.textMuted, fontWeight: 600, fontSize: 13 }}>DURUM</th>
                  <th style={{ padding: '12px 8px', color: p.textMuted, fontWeight: 600, fontSize: 13, textAlign: 'right' }}>İŞLEM</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ padding: 20, textAlign: 'center', color: p.textMuted }}>Yükleniyor...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: 20, textAlign: 'center', color: p.textMuted }}>Kullanıcı bulunamadı.</td></tr>
                ) : users.slice(0, 10).map((u) => (
                  <tr key={u._id || u.id} style={{ borderBottom: `1px solid ${p.border}` }}>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</div>
                      <div style={{ color: p.textMuted, fontSize: 13 }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ 
                        background: u.role === 'admin' ? 'rgba(239,68,68,0.1)' : u.role === 'teacher' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                        color: u.role === 'admin' ? '#ef4444' : u.role === 'teacher' ? '#3b82f6' : '#10b981',
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ color: '#10b981', fontWeight: 600, fontSize: 14 }}>
                        Aktif
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <button onClick={() => setSelectedUser(u)} style={{ background: p.surfaceElevated, border: 'none', padding: '6px 12px', borderRadius: 6, color: p.text, cursor: 'pointer', fontWeight: 600 }}>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column: Pending Approvals & Applications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#3b82f6" /> Eğitmen Başvuruları
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loading ? (
                   <p style={{ color: p.textMuted }}>Yükleniyor...</p>
                ) : applications.length === 0 ? (
                   <p style={{ color: p.textMuted }}>Bekleyen başvuru yok.</p>
                ) : applications.map(app => (
                  <div key={app._id} style={{ background: p.surfaceElevated, padding: 16, borderRadius: 16, border: `1px solid ${p.border}` }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{app.name}</h4>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: p.textMuted }}>{app.email} • {new Date(app.createdAt).toLocaleDateString('tr-TR')}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button disabled={processing} onClick={() => handleApproveInstructor(app._id)} style={{ flex: 1, padding: '8px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                        Onayla
                      </button>
                      <button disabled={processing} onClick={() => handleRejectInstructor(app._id)} style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={20} color="#f59e0b" /> Onay Bekleyen Kurslar
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loading ? (
                   <p style={{ color: p.textMuted }}>Yükleniyor...</p>
                ) : courses.length === 0 ? (
                   <p style={{ color: p.textMuted }}>Gösterilecek kurs bulunamadı.</p>
                ) : courses.slice(0, 3).map(course => (
                  <div key={course._id || course.id} style={{ background: p.surfaceElevated, padding: 16, borderRadius: 16, border: `1px solid ${p.border}` }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{course.title}</h4>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: p.textMuted }}>{course.category} • {new Date(course.createdAt).toLocaleDateString('tr-TR')}</p>
                    
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleUpdateCourseStatus(course._id || course.id, !course.isActive)} style={{ flex: 1, padding: '8px', background: course.isActive ? '#f59e0b' : '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                        {course.isActive ? 'Pasife Al' : 'Onayla'}
                      </button>
                      <button onClick={() => handleDeleteCourse(course._id || course.id)} style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 24, padding: 28 }}>
               <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Sistem Ayarları</h2>
               <button onClick={() => setShowSettings(true)} style={{ width: '100%', padding: '12px', background: p.surfaceElevated, border: `1px solid ${p.border}`, color: p.text, borderRadius: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                 <Settings size={18} /> Genel Ayarlara Git
               </button>
            </div>
          </div>

        </div>
      </main>

      {/* User Edit Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: p.surface, padding: 32, borderRadius: 24, width: '100%', maxWidth: 400, border: `1px solid ${p.border}` }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>Kullanıcıyı Düzenle</h3>
            <p style={{ margin: '0 0 24px', color: p.textMuted }}>{selectedUser.name} ({selectedUser.email})</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <button disabled={processing} onClick={() => handleUpdateRole(selectedUser._id || selectedUser.id, 'teacher')} style={{ padding: 12, borderRadius: 8, border: `1px solid ${selectedUser.role === 'teacher' ? '#3b82f6' : p.border}`, background: selectedUser.role === 'teacher' ? 'rgba(59,130,246,0.1)' : 'transparent', color: p.text, cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>Eğitmen Yap</button>
              <button
                disabled={processing || (selectedUser.role === 'teacher' && selectedUser.instructorStatus === 'approved')}
                onClick={() => handleUpdateRole(selectedUser._id || selectedUser.id, 'student')}
                title={selectedUser.role === 'teacher' && selectedUser.instructorStatus === 'approved' ? 'Onaylı eğitmen öğrenciye düşürülemez' : undefined}
                style={{
                  padding: 12, borderRadius: 8,
                  border: `1px solid ${selectedUser.role === 'student' ? '#10b981' : p.border}`,
                  background: selectedUser.role === 'student' ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: p.text, textAlign: 'left', fontWeight: 600,
                  cursor: (selectedUser.role === 'teacher' && selectedUser.instructorStatus === 'approved') ? 'not-allowed' : 'pointer',
                  opacity: (selectedUser.role === 'teacher' && selectedUser.instructorStatus === 'approved') ? 0.4 : 1,
                }}
              >Öğrenci Yap</button>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedUser(null)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: p.surfaceElevated, color: p.text, cursor: 'pointer', fontWeight: 600 }}>İptal</button>
              <button disabled={processing} onClick={() => handleDeleteUser(selectedUser._id || selectedUser.id)} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: p.surface, padding: 32, borderRadius: 24, width: '100%', maxWidth: 400, border: `1px solid ${p.border}` }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800 }}>Sistem Ayarları</h3>
            <p style={{ margin: '0 0 24px', color: p.textMuted }}>Genel platform ayarları yapılandırması.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontWeight: 600, color: p.text }}>Bakım Modu</span>
                <input type="checkbox" style={{ transform: 'scale(1.5)' }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontWeight: 600, color: p.text }}>Yeni Kayıtları Kapat</span>
                <input type="checkbox" style={{ transform: 'scale(1.5)' }} />
              </label>
            </div>

            <button onClick={() => { alert('Ayarlar başarıyla kaydedildi.'); setShowSettings(false); }} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: p.accent, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Değişiklikleri Kaydet</button>
          </div>
        </div>
      )}

    </div>
  );
}
