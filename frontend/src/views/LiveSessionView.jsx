import React, { memo, Suspense, lazy, useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLiveSession } from '../hooks/useLiveSession';
import SessionTopBar from '../components/eduflow/SessionTopBar';
import LiveSidebar from '../components/eduflow/LiveSidebar';
import ParticipantStrip from '../components/eduflow/ParticipantStrip';
import ControlDock from '../components/eduflow/ControlDock';
import LiveVideoPanel from '../components/eduflow/LiveVideoPanel';
import LiveAiPanel from '../components/eduflow/LiveAiPanel';

import { Layers, Monitor, Share2, Sparkles, Code2, Presentation } from 'lucide-react';

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

const LiveSessionView = memo(function LiveSessionView({ user, onNavigateHome }) {
  const { palette: p, tokens: t } = useTheme();
  const [viewRole, setViewRole] = useState('teacher');

  const session = useLiveSession({
    user,
    viewRole,
    onLeave: onNavigateHome,
  });

  const [mountedModes, setMountedModes] = useState(new Set(['slide']));

  useEffect(() => {
    setMountedModes(prev => new Set(prev).add(session.activeMode));
  }, [session.activeMode]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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
          flex: 1, width: '100%', height: '100%', minHeight: 0, transition: 'opacity 0.2s'
        }}>
          <SlideStage screenStream={session.screenStream} />
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
              <LiveVideoPanel localStream={session.localStream} remoteStreams={session.remoteStreams} participants={session.participants} selfId={session.self?.userId} compact />
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
              <LiveVideoPanel localStream={session.localStream} remoteStreams={session.remoteStreams} participants={session.participants} selfId={session.self?.userId} compact />
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
        courseTitle="React 101 — Modül 4"
        moduleTitle="State Yönetimi & Hooks — Global Akademi"
        sessionTimer={session.timerLabel}
        viewRole={viewRole}
        onViewRoleChange={setViewRole}
        participantCount={session.participants.length || 1}
        user={user}
        connected={session.connected}
        onNavigateHome={onNavigateHome}
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
        onEndSession={session.endSession}
      />
    </div>
  );
});

export default LiveSessionView;
