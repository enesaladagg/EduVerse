import React, { memo, Suspense, lazy, useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLiveSession } from '../hooks/useLiveSession';
import SessionTopBar from '../components/eduflow/SessionTopBar';
import LiveSidebar from '../components/eduflow/LiveSidebar';
import ParticipantStrip from '../components/eduflow/ParticipantStrip';
import ControlDock from '../components/eduflow/ControlDock';
import LiveVideoPanel from '../components/eduflow/LiveVideoPanel';
import LiveAiPanel from '../components/eduflow/LiveAiPanel';

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
  const { palette: p, tokens: t } = useTheme();

  if (screenStream) {
    return (
      <div style={{
        flex: 1,
        margin: t.spacing[4],
        borderRadius: t.borderRadius.xl,
        overflow: 'hidden',
        background: p.stage,
        border: `1px solid ${p.border}`,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: `${t.spacing[2]} ${t.spacing[4]}`,
          background: p.panelElevated,
          borderBottom: `1px solid ${p.border}`,
          fontSize: t.typography.fontSize.xs,
          color: p.textMuted,
        }}>
          Ekran paylaşımı aktif
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ScreenShareVideo stream={screenStream} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      background: p.stage,
      borderRadius: t.borderRadius.xl,
      margin: t.spacing[4],
      padding: t.spacing[10],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: t.shadows[2],
      minHeight: 0,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: `${p.accent}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '36px', marginBottom: t.spacing[6],
      }}>
        ⚛️
      </div>
      <h2 style={{
        margin: 0,
        fontSize: t.typography.fontSize['3xl'],
        fontWeight: t.typography.fontWeight.bold,
        color: p.text,
        textAlign: 'center',
      }}>
        State Yönetimi Stratejileri
      </h2>
      <p style={{
        marginTop: t.spacing[4],
        fontSize: t.typography.fontSize.lg,
        color: p.textMuted,
        textAlign: 'center',
        maxWidth: 520,
      }}>
        Tek yönlü veri akışı: State → View
      </p>
      <div style={{ marginTop: t.spacing[8], display: 'flex', gap: t.spacing[8], alignItems: 'center' }}>
        <div style={{
          padding: `${t.spacing[4]} ${t.spacing[6]}`,
          border: `2px solid ${p.accent}`,
          borderRadius: t.borderRadius.lg,
          color: p.text,
          fontWeight: t.typography.fontWeight.bold,
        }}>
          State
        </div>
        <span style={{ fontSize: '24px', color: p.accent }}>→</span>
        <div style={{
          padding: `${t.spacing[4]} ${t.spacing[6]}`,
          border: `2px solid ${p.success}`,
          borderRadius: t.borderRadius.lg,
          color: p.text,
          fontWeight: t.typography.fontWeight.bold,
        }}>
          View
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

  const renderStage = () => {
    if (session.activeMode === 'whiteboard') {
      return (
        <div style={{ flex: 1, minHeight: 0, padding: 8, display: 'flex' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Suspense fallback={<ModuleLoader />}>
              <CollaborativeWhiteboard roomId={session.roomId} sessionLabel="Beyaz Tahta — fareyle çizin" />
            </Suspense>
          </div>
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
      );
    }

    if (session.activeMode === 'sandbox') {
      return (
        <div
          className="eduflow-sandbox-split"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            padding: 8,
            minHeight: 0,
          }}
        >
          <div style={{
            borderRadius: t.borderRadius.lg,
            overflow: 'hidden',
            border: `1px solid ${p.border}`,
            background: p.panelElevated,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}>
            <div style={{ padding: t.spacing[2], fontSize: t.typography.fontSize.xs, color: p.textMuted, borderBottom: `1px solid ${p.border}` }}>
              Canlı video
            </div>
            <LiveVideoPanel
              localStream={session.localStream}
              remoteStreams={session.remoteStreams}
              participants={session.participants}
              selfId={session.self?.userId}
              compact
            />
          </div>
          <div style={{
            borderRadius: t.borderRadius.lg,
            overflow: 'hidden',
            border: `1px solid ${p.border}`,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {viewRole === 'teacher' ? (
              <InstructorCodePanel studentCode={session.studentCode} />
            ) : (
              <Suspense fallback={<ModuleLoader />}>
                <CodeSandbox
                  roomId={session.roomId}
                  streamToHost
                  defaultLanguage="python"
                />
              </Suspense>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <SlideStage screenStream={session.screenStream} />
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
