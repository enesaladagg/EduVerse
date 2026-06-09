import React, { memo, Suspense, lazy, useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLiveSession } from '../hooks/useLiveSession';
import SessionTopBar from '../components/eduflow/SessionTopBar';
import LiveSidebar from '../components/eduflow/LiveSidebar';
import ParticipantStrip from '../components/eduflow/ParticipantStrip';
import ControlDock from '../components/eduflow/ControlDock';
import LiveVideoPanel from '../components/eduflow/LiveVideoPanel';
import LiveAiPanel from '../components/eduflow/LiveAiPanel';
import api from '../services/api';

import { Layers, Monitor, Share2, Sparkles, Code2, Presentation, Video, Copy, Check, Users, ArrowRight, BookOpen } from 'lucide-react';

const CodeSandbox = lazy(() => import('../components/CodeSandbox'));
const CollaborativeWhiteboard = lazy(() => import('../components/CollaborativeWhiteboard'));

function ModuleLoader() {
  const { palette: p, tokens: t } = useTheme();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, color: p.textMuted, fontSize: t.typography.fontSize.sm,
    }}>
      Modül yükleniyor…
    </div>
  );
}

const ScreenShareVideo = memo(function ScreenShareVideo({ stream }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  if (!stream) return null;
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }}
    />
  );
});

const SlideStage = memo(function SlideStage({ screenStream }) {
  const { isDark, palette: p, tokens: t } = useTheme();

  if (screenStream) {
    return (
      <div style={{
        flex: 1, margin: t.spacing[4], borderRadius: t.borderRadius.xl, overflow: 'hidden',
        background: isDark ? 'rgba(0,0,0,0.4)' : '#000', border: `1px solid ${p.border}`,
        minHeight: 0, display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          padding: '12px 20px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
          borderBottom: `1px solid ${p.border}`, display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 14, color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)'
        }}>
          <Share2 size={16} color="#00d4aa" /> Ekran paylaşımı aktif
        </div>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <ScreenShareVideo stream={screenStream} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, margin: t.spacing[4], padding: t.spacing[10],
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: isDark ? 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))' : 'linear-gradient(135deg, #ffffff, #f8fafc)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      borderRadius: 32, backdropFilter: 'blur(20px)',
      boxShadow: isDark ? '0 32px 64px rgba(0,0,0,0.4)' : '0 32px 64px rgba(0,0,0,0.05)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -100, left: -100, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: -100, width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(124,108,240,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)'
      }} />

      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, border: `1px solid rgba(0,212,170,0.2)`,
        boxShadow: '0 8px 32px rgba(0,212,170,0.2)'
      }}>
        <Presentation size={40} color="#00d4aa" />
      </div>
      
      <h2 style={{
        margin: 0, fontSize: 36, fontWeight: 800,
        color: isDark ? '#fff' : '#0f172a', textAlign: 'center', letterSpacing: '-0.5px'
      }}>
        State Yönetimi Stratejileri
      </h2>
      <p style={{
        marginTop: 16, fontSize: 18, color: isDark ? '#94a3b8' : '#64748b',
        textAlign: 'center', maxWidth: 520, lineHeight: 1.6
      }}>
        Tek yönlü veri akışını ve modern state yönetim araçlarını keşfedeceğimiz modüle hoş geldiniz.
      </p>
      
      <div style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'center', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', padding: '16px 32px', borderRadius: 24, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
        <div style={{
          padding: '10px 20px', background: isDark ? 'rgba(124,108,240,0.1)' : 'rgba(124,108,240,0.15)',
          color: '#7c6cf0', borderRadius: 12, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Layers size={18} /> State
        </div>
        <div style={{ width: 40, height: 2, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', position: 'relative' }}>
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }} />
        </div>
        <div style={{
          padding: '10px 20px', background: isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.15)',
          color: '#00d4aa', borderRadius: 12, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Monitor size={18} /> View
        </div>
      </div>
    </div>
  );
});

const InstructorCodePanel = memo(function InstructorCodePanel({ studentCode }) {
  const { palette: p, tokens: t } = useTheme();
  if (!studentCode) {
    return (
      <div style={{
        padding: t.spacing[4],
        color: p.textMuted,
        fontSize: t.typography.fontSize.sm,
        textAlign: 'center',
      }}>
        Öğrenci kod yazdığında burada canlı görünecek…
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: t.spacing[2],
        borderBottom: `1px solid ${p.border}`,
        fontSize: t.typography.fontSize.xs,
        color: studentCode.submitted ? p.success : p.accent,
      }}>
        {studentCode.submitted ? '✓ Kod teslim edildi' : '● Canlı kod akışı'}
        {' · '}
        {studentCode.language || 'python'}
      </div>
      <pre style={{
        flex: 1,
        margin: 0,
        padding: t.spacing[3],
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: t.typography.fontFamily.mono,
        color: p.text,
        background: p.panelElevated,
      }}>
        {studentCode.code}
      </pre>
    </div>
  );
});

/**
 * Eğitmenin ders oluşturduğu tam sayfa bileşeni.
 */
function TeacherLobby({ onJoinAsHost, onBack, p, t, isDark }) {
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.createLiveSession({
        title: 'Canlı Ders',
        courseId: '000000000000000000000000',
        scheduledAt: new Date().toISOString(),
        duration: 60,
        sessionType: 'lecture',
      });
      setRoomCode(result.data.roomId);
      setSessionId(result.data._id);
    } catch {
      const code = 'EDU-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setRoomCode(code);
      setSessionId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: p.shell, color: p.text,
      fontFamily: t.typography.fontFamily.base,
      padding: 24,
    }}>
      <div style={{
        background: p.panel, border: `1px solid ${p.border}`, borderRadius: 28,
        padding: 48, maxWidth: 500, width: '100%',
        boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
        textAlign: 'center',
      }}>
        {/* İkon */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: isDark ? 'rgba(0,212,170,0.1)' : 'rgba(0,212,170,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          border: '1px solid rgba(0,212,170,0.25)',
          boxShadow: '0 8px 32px rgba(0,212,170,0.2)',
        }}>
          <Video size={40} color="#00d4aa" />
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
          Canlı Ders Başlat
        </h2>
        <p style={{ color: p.textMuted, fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
          Yeni bir ders oluştur, oda kodunu öğrencilerinle paylaş.
        </p>

        {/* Ders Oluşturulmadıysa */}
        {!roomCode ? (
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #00d4aa, #0bc5e8)',
              color: '#fff', fontSize: 17, fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 24px rgba(0,212,170,0.35)',
              transition: 'all 0.2s',
              letterSpacing: '-0.3px',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? (
              <>Ders oluşturuluyor…</>
            ) : (
              <><BookOpen size={20} /> Ders Oluştur</>
            )}
          </button>
        ) : (
          /* Oda Kodu Gösterimi */
          <div>
            <p style={{ color: p.textMuted, fontSize: 13, marginBottom: 12 }}>
              Öğrencilerine bu kodu ver:
            </p>

            {/* Kodu kopyala butonu */}
            <button
              onClick={handleCopy}
              style={{
                width: '100%', padding: '20px 24px', borderRadius: 18,
                border: `2px dashed ${copied ? '#00d4aa' : p.border}`,
                background: isDark ? (copied ? 'rgba(0,212,170,0.08)' : 'rgba(255,255,255,0.03)') : (copied ? 'rgba(0,212,170,0.06)' : '#f8fafc'),
                cursor: 'pointer', marginBottom: 16,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4aa'; e.currentTarget.style.background = isDark ? 'rgba(0,212,170,0.08)' : 'rgba(0,212,170,0.05)'; }}
              onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = p.border; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'; } }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: p.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>
                Oda Kodu
              </span>
              <span style={{
                fontFamily: 'monospace', fontSize: 38, fontWeight: 900,
                color: '#00d4aa', letterSpacing: 6,
              }}>
                {roomCode}
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600,
                color: copied ? '#00d4aa' : p.textMuted,
              }}>
                {copied ? <><Check size={14} /> Kopyalandı!</> : <><Copy size={14} /> Kopyalamak için tıkla</>}
              </span>
            </button>

            {/* Derse Gir */}
            <button
              onClick={() => onJoinAsHost(roomCode, sessionId)}
              style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #00d4aa, #0bc5e8)',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: 'pointer', marginBottom: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 20px rgba(0,212,170,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Users size={18} /> Derse Gir (Host) <ArrowRight size={18} />
            </button>

            <button
              onClick={() => { setRoomCode(''); setSessionId(null); }}
              style={{
                width: '100%', padding: '10px', background: 'transparent',
                border: 'none', color: p.textMuted, fontSize: 13, cursor: 'pointer',
              }}
            >
              Yeni kod oluştur
            </button>
          </div>
        )}

        {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>{error}</p>}

        <button
          onClick={onBack}
          style={{
            marginTop: 20, background: 'transparent', border: 'none',
            color: p.textMuted, fontSize: 14, cursor: 'pointer',
          }}
        >
          ← Geri dön
        </button>
      </div>
    </div>
  );
}

/**
 * Öğrencinin oda kodunu girdiği tam sayfa bileşeni.
 * Kod backend'e doğrulandıktan sonra onJoin(roomCode) çağrılır.
 */
function RoomCodeEntry({ onJoin, onBack, p, t }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      await api.joinLiveSession(trimmed);
      onJoin(trimmed);
    } catch (err) {
      setError(err.message || 'Oturum bulunamadı. Kodu kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: p.shell, color: p.text,
      fontFamily: t.typography.fontFamily.base,
      padding: 24,
    }}>
      <div style={{
        background: p.panel, border: `1px solid ${p.border}`, borderRadius: 24,
        padding: 40, maxWidth: 420, width: '100%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `${p.accent}15`, color: p.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 36,
        }}>
          🎓
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Canlı Derse Katıl</h2>
        <p style={{ color: p.textMuted, fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>
          Eğitmenin verdiği oda kodunu gir ve derse anında katıl.
        </p>

        <form onSubmit={handleJoin}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="EDU-XXXX"
            maxLength={8}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '14px 18px', borderRadius: 12,
              border: `2px solid ${error ? '#ef4444' : p.border}`,
              background: p.panelElevated, color: p.text,
              fontSize: 22, fontWeight: 700, textAlign: 'center',
              letterSpacing: 4, outline: 'none',
              fontFamily: t.typography.fontFamily.mono || 'monospace',
              marginBottom: 8,
              transition: 'border-color 0.2s',
            }}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'left' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: p.accent, color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !code.trim() ? 0.65 : 1,
              marginTop: 4, transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Kontrol ediliyor…' : 'Katıl'}
          </button>
        </form>

        <button
          onClick={onBack}
          style={{
            marginTop: 16, background: 'transparent', border: 'none',
            color: p.textMuted, fontSize: 14, cursor: 'pointer',
          }}
        >
          ← Geri dön
        </button>
      </div>
    </div>
  );
}

const LiveSessionView = memo(function LiveSessionView({ user, isAuthenticated, onNavigateHome, onNavigate, params }) {
  const { isDark, palette: p, tokens: t } = useTheme();
  const [joinedRoomCode, setJoinedRoomCode] = useState(params?.roomCode || null);
  const [hostSessionId, setHostSessionId] = useState(params?.sessionId || null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [mountedModes, setMountedModes] = useState(new Set(['slide']));

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const inLobby = !joinedRoomCode && !params?.isHost;

  const effectiveParams = joinedRoomCode
    ? { ...params, roomCode: joinedRoomCode, isHost: isTeacher || params?.isHost }
    : params;
  const viewRole = (effectiveParams?.isHost || isTeacher) ? 'teacher' : 'student';

  const session = useLiveSession({
    user,
    viewRole,
    onLeave: onNavigateHome,
    roomId: joinedRoomCode || effectiveParams?.roomCode || null,
  });

  useEffect(() => {
    if (inLobby) return;
    setMountedModes(prev => new Set(prev).add(session.activeMode));
  }, [session.activeMode, inLobby]);

  useEffect(() => {
    if (inLobby) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [inLobby]);

  // --- Early returns AFTER all hooks ---

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: p.shell, color: p.text,
        fontFamily: t.typography.fontFamily.base
      }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 800 }}>Canlı derse katılmak için giriş yapmalısınız</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => onNavigate('login')} style={{ padding: '10px 24px', background: p.accent, color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>Giriş Yap</button>
          <button onClick={() => onNavigate('register')} style={{ padding: '10px 24px', background: 'transparent', color: p.accent, border: `2px solid ${p.accent}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>Kayıt Ol</button>
        </div>
      </div>
    );
  }

  // Eğitmen → henüz oda kodu yoksa TeacherLobby göster
  if (isTeacher && inLobby) {
    return (
      <TeacherLobby
        p={p}
        t={t}
        isDark={isDark}
        onJoinAsHost={(code, sid) => {
          setJoinedRoomCode(code);
          setHostSessionId(sid);
        }}
        onBack={onNavigateHome}
      />
    );
  }

  // Öğrenci → oda kodu girme ekranı
  if (!isTeacher && inLobby) {
    return (
      <RoomCodeEntry
        p={p}
        t={t}
        onJoin={(code) => setJoinedRoomCode(code)}
        onBack={onNavigateHome}
      />
    );
  }

  if (session.sessionError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: p.shell,
        color: p.text,
        flexDirection: 'column',
        gap: t.spacing[4],
      }}>
        <p>Oturum başlatılamadı: {session.sessionError}</p>
        <button type="button" onClick={onNavigateHome} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Geri dön
        </button>
      </div>
    );
  }

  if (!session.sessionReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: p.shell,
        color: p.textMuted,
      }}>
        Canlı ders oturumu hazırlanıyor…
      </div>
    );
  }

  const isVideoActive = Boolean(session.localStream || Object.keys(session.remoteStreams || {}).length > 0);

  const renderStage = () => {
    return (
      <div style={{ flex: 1, position: 'relative', display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        
        {/* SLIDE MODE */}
        <div style={{
          display: session.activeMode === 'slide' ? 'flex' : 'none',
          flex: 1, width: '100%', height: '100%', minHeight: 0, transition: 'opacity 0.2s', position: 'relative'
        }}>
          <SlideStage screenStream={session.screenStream} />
          {isVideoActive && (
            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 240, height: 160, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: `1px solid ${p.border}` }}>
              <LiveVideoPanel localStream={session.localStream} remoteStreams={session.remoteStreams} participants={session.participants} selfId={session.self?.userId} compact onExpand={() => session.handleModeChange('video')} />
            </div>
          )}
          <div style={{ display: session.showAiPanel ? 'block' : 'none' }}>
            <LiveAiPanel
              open={session.showAiPanel}
              onClose={() => session.handleDockAction('ai')}
              bgRemoval={session.bgRemoval}
              setBgRemoval={session.setBgRemoval}
              bgBlur={session.bgBlur}
              setBgBlur={session.setBgBlur}
              aiNoise={session.aiNoise}
              setAiNoise={session.setAiNoise}
            />
          </div>
        </div>

        {/* VIDEO MODE */}
        <div style={{
          display: session.activeMode === 'video' ? 'flex' : 'none',
          flex: 1, width: '100%', height: '100%', padding: t.spacing[4], transition: 'opacity 0.2s'
        }}>
          <div style={{ flex: 1, borderRadius: t.borderRadius.xl, overflow: 'hidden', border: `1px solid ${p.border}`, background: p.panelElevated, position: 'relative' }}>
             <LiveVideoPanel 
               localStream={session.localStream} 
               remoteStreams={session.remoteStreams} 
               participants={session.participants} 
               selfId={session.self?.userId} 
               onMinimize={() => session.handleModeChange('slide')} 
             />
          </div>
        </div>

        {/* WHITEBOARD MODE */}
        <div style={{
          display: session.activeMode === 'whiteboard' ? 'grid' : 'none',
          flex: 1, width: '100%', height: '100%', padding: t.spacing[2], gap: t.spacing[2],
          gridTemplateColumns: isVideoActive ? '280px 1fr auto' : '1fr auto',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {isVideoActive && session.activeMode === 'whiteboard' && (
            <div style={{
               borderRadius: t.borderRadius.lg, overflow: 'hidden', border: `1px solid ${p.border}`,
               background: p.panelElevated, display: 'flex', flexDirection: 'column', minHeight: 0,
            }}>
              <div style={{ padding: t.spacing[2], fontSize: t.typography.fontSize.xs, color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>
                Canlı video
              </div>
              <LiveVideoPanel localStream={session.localStream} remoteStreams={session.remoteStreams} participants={session.participants} selfId={session.self?.userId} compact onExpand={() => session.handleModeChange('video')} />
            </div>
          )}
          {mountedModes.has('whiteboard') && (
            <div style={{ flex: 1, minWidth: 0, display: 'flex', borderRadius: t.borderRadius.lg, overflow: 'hidden', border: `1px solid ${p.border}`, background: p.panelElevated }}>
              <Suspense fallback={<ModuleLoader />}>
                <CollaborativeWhiteboard roomId={session.roomId} sessionLabel="Beyaz Tahta — fareyle çizin" />
              </Suspense>
            </div>
          )}
          <div style={{ display: session.showAiPanel ? 'block' : 'none' }}>
            <LiveAiPanel open={session.showAiPanel} onClose={() => session.handleDockAction('ai')} bgRemoval={session.bgRemoval} setBgRemoval={session.setBgRemoval} bgBlur={session.bgBlur} setBgBlur={session.setBgBlur} aiNoise={session.aiNoise} setAiNoise={session.setAiNoise} />
          </div>
        </div>

        {/* SANDBOX MODE */}
        <div style={{
          display: session.activeMode === 'sandbox' ? 'grid' : 'none',
          flex: 1, width: '100%', height: '100%', padding: t.spacing[2], gap: t.spacing[2],
          gridTemplateColumns: isVideoActive ? '280px 1fr' : '1fr',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {isVideoActive && session.activeMode === 'sandbox' && (
            <div style={{
               borderRadius: t.borderRadius.lg, overflow: 'hidden', border: `1px solid ${p.border}`,
               background: p.panelElevated, display: 'flex', flexDirection: 'column', minHeight: 0,
            }}>
              <div style={{ padding: t.spacing[2], fontSize: t.typography.fontSize.xs, color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>
                Canlı video
              </div>
              <LiveVideoPanel localStream={session.localStream} remoteStreams={session.remoteStreams} participants={session.participants} selfId={session.self?.userId} compact onExpand={() => session.handleModeChange('video')} />
            </div>
          )}
          {mountedModes.has('sandbox') && (
            <div style={{
               borderRadius: t.borderRadius.lg, overflow: 'hidden', border: `1px solid ${p.border}`,
               background: p.panelElevated, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              {viewRole === 'teacher' ? (
                <InstructorCodePanel studentCode={session.studentCode} />
              ) : (
                <Suspense fallback={<ModuleLoader />}>
                  <CodeSandbox roomId={session.roomId} streamToHost defaultLanguage="python" />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="eduflow-live-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: p.shell,
        color: p.text,
      }}
    >
      <style>{`
        .eduflow-live-body {
          animation: liveFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes liveFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <SessionTopBar
        courseTitle={`Canlı Ders ${joinedRoomCode ? `· ${joinedRoomCode}` : ''}`}
        moduleTitle={viewRole === 'teacher' ? "Senin Dersin — Host" : "Sınıftasın"}
        sessionTimer={session.timerLabel}
        viewRole={viewRole}
        participantCount={session.participants.length || 1}
        user={user}
        connected={session.connected}
        onNavigateHome={onNavigateHome}
        recording={session.recording}
      />

      {session.connectError && (
        <div style={{
          background: `${p.live}20`,
          color: p.live,
          textAlign: 'center',
          padding: '6px',
          fontSize: '12px',
        }}>
          Bağlantı hatası: {session.connectError}. Backend çalışıyor mu?
        </div>
      )}

      <div className="eduflow-live-body" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {renderStage()}
          <ParticipantStrip participants={session.participants} selfId={session.self?.userId} />
        </div>
        <LiveSidebar
          viewRole={viewRole}
          selfId={session.self?.userId}
          messages={session.messages}
          participants={session.participants}
          poll={session.poll}
          onSendMessage={session.sendMessage}
          onVotePoll={session.votePoll}
          onEndPoll={session.endPoll}
        />
      </div>

      <ControlDock
        activeMode={session.activeMode}
        mic={session.mic}
        cam={session.cam}
        screen={session.screen}
        hand={session.hand}
        recording={session.recording}
        showAiPanel={session.showAiPanel}
        viewRole={viewRole}
        connected={session.connected}
        onAction={session.handleDockAction}
        onEndSession={() => setShowEndModal(true)}
      />

      {showEndModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: p.panel, border: `1px solid ${p.border}`, borderRadius: t.borderRadius.xl,
            padding: t.spacing[6], maxWidth: 400, width: '90%',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            textAlign: 'center'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <span style={{ fontSize: 28 }}>⚠️</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: p.text, marginBottom: 12 }}>Dersi Bitir</h3>
            <p style={{ color: p.textMuted, fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>
              Bu dersi herkes için bitirmek istediğinize emin misiniz? Tüm öğrenciler oturumdan çıkarılacaktır.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => setShowEndModal(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, background: p.panelElevated,
                  color: p.text, border: `1px solid ${p.border}`, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = p.panelElevated}
              >
                İptal
              </button>
              <button 
                onClick={() => { setShowEndModal(false); session.endSession(); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, background: '#ef4444',
                  color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Evet, Bitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default LiveSessionView;
