import React, { memo, useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Badge from '../Badge';

function formatTime(at) {
  return new Date(at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function roleLabel(role) {
  if (role === 'host' || role === 'teacher') return 'Eğitmen';
  if (role === 'guest_speaker') return 'Konuk';
  return null;
}

const LiveSidebar = memo(function LiveSidebar({
  viewRole,
  selfId,
  messages,
  participants,
  poll,
  onSendMessage,
  onVotePoll,
  onEndPoll,
}) {
  const { palette: p, tokens: t } = useTheme();
  const [tab, setTab] = useState('chat');
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSendMessage(text);
    setInput('');
  };

  const tabs = [
    { id: 'chat', label: 'Sohbet' },
    { id: 'participants', label: 'Katılımcılar' },
    { id: 'poll', label: 'Anket' },
  ];

  return (
    <aside
      className="eduflow-sidebar"
      style={{
        width: 320,
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        background: p.panel,
        borderLeft: `1px solid ${p.border}`,
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', borderBottom: `1px solid ${p.border}` }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              padding: `${t.spacing[3]} ${t.spacing[2]}`,
              border: 'none',
              borderBottom: tab === id ? `2px solid ${p.accent}` : '2px solid transparent',
              background: 'transparent',
              color: tab === id ? p.accent : p.textMuted,
              fontSize: t.typography.fontSize.sm,
              fontWeight: tab === id ? t.typography.fontWeight.semibold : t.typography.fontWeight.normal,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: t.spacing[3] }}>
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[3] }}>
            {messages.length === 0 && (
              <p style={{ color: p.textMuted, fontSize: t.typography.fontSize.sm, textAlign: 'center', marginTop: t.spacing[8] }}>
                Sohbet başlatın — mesajlar tüm katılımcılara anlık iletilir.
              </p>
            )}
            {messages.map((m) => {
              const self = m.userId === selfId;
              const tag = roleLabel(m.role);
              return (
                <div key={m.id} style={{ alignSelf: self ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
                  {!self && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: t.spacing[2],
                      marginBottom: 4,
                      fontSize: t.typography.fontSize.xs,
                      color: p.textMuted,
                    }}>
                      <span>{m.userName}</span>
                      {tag && <Badge variant="primary" size="sm">{tag}</Badge>}
                      <span>{formatTime(m.at)}</span>
                    </div>
                  )}
                  <div style={{
                    padding: `${t.spacing[2]} ${t.spacing[3]}`,
                    borderRadius: t.borderRadius.lg,
                    background: self ? p.chatBubbleSelf : p.chatBubble,
                    color: p.text,
                    fontSize: t.typography.fontSize.sm,
                    border: self ? `1px solid ${p.accent}40` : 'none',
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}

        {tab === 'participants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[2] }}>
            {participants.map((p_) => (
              <div
                key={p_.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: t.spacing[3],
                  padding: t.spacing[2],
                  borderRadius: t.borderRadius.md,
                  background: p.panelElevated,
                  opacity: p_.connected === false ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: p.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: t.typography.fontSize.sm, fontWeight: t.typography.fontWeight.bold,
                }}>
                  {(p_.displayName || '?').charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: t.typography.fontSize.sm, color: p.text, fontWeight: t.typography.fontWeight.medium }}>
                    {p_.displayName || p_.userId}
                  </div>
                  {p_.role === 'guest_speaker' && <Badge variant="warning" size="sm">Konuk Konuşmacı</Badge>}
                  {p_.role === 'host' && <Badge variant="primary" size="sm">Eğitmen</Badge>}
                </div>
                <span style={{ fontSize: '14px' }}>
                  {p_.mic ? '🎤' : '🔇'} {p_.cam ? '📹' : '📷'} {p_.hand ? '✋' : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'poll' && poll && (
          <div>
            <p style={{ color: p.text, fontWeight: t.typography.fontWeight.semibold, marginTop: 0 }}>
              {poll.question}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[3], marginTop: t.spacing[4] }}>
              {poll.options.map((opt) => {
                const pct = poll.totalVotes
                  ? Math.round((opt.votes / poll.totalVotes) * 100)
                  : 0;
                return (
                  <button
                    key={opt.index}
                    type="button"
                    disabled={!poll.active}
                    onClick={() => onVotePoll(opt.index)}
                    style={{
                      textAlign: 'left',
                      border: `1px solid ${p.border}`,
                      borderRadius: t.borderRadius.lg,
                      padding: t.spacing[3],
                      background: p.panelElevated,
                      cursor: poll.active ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: p.text, fontSize: t.typography.fontSize.sm }}>{opt.label}</span>
                      <span style={{ color: p.accent, fontWeight: t.typography.fontWeight.bold }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: t.borderRadius.full, background: p.pillInactive }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: t.borderRadius.full,
                        background: p.accent,
                        transition: t.transitions.base,
                      }} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: t.spacing[4],
            }}>
              <span style={{ color: p.textMuted, fontSize: t.typography.fontSize.sm }}>
                {poll.totalVotes} oy
              </span>
              {viewRole === 'teacher' && poll.active && (
                <button
                  type="button"
                  onClick={onEndPoll}
                  style={{
                    border: `1px solid ${p.border}`,
                    background: 'transparent',
                    color: p.textMuted,
                    borderRadius: t.borderRadius.md,
                    padding: `${t.spacing[1]} ${t.spacing[3]}`,
                    cursor: 'pointer',
                    fontSize: t.typography.fontSize.xs,
                  }}
                >
                  Anketi bitir
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {tab === 'chat' && (
        <div style={{
          padding: t.spacing[3],
          borderTop: `1px solid ${p.border}`,
          display: 'flex',
          gap: t.spacing[2],
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mesaj yazın..."
            style={{
              flex: 1,
              padding: `${t.spacing[2]} ${t.spacing[3]}`,
              borderRadius: t.borderRadius.full,
              border: `1px solid ${p.border}`,
              background: p.panelElevated,
              color: p.text,
              fontSize: t.typography.fontSize.sm,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            style={{
              padding: `${t.spacing[2]} ${t.spacing[4]}`,
              borderRadius: t.borderRadius.full,
              background: p.accent,
              color: '#fff',
              border: 'none',
              fontSize: t.typography.fontSize.sm,
              fontWeight: t.typography.fontWeight.semibold,
              cursor: 'pointer',
            }}
          >
            ➤
          </button>
        </div>
      )}
    </aside>
  );
});

export default LiveSidebar;
