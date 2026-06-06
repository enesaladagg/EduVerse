import React, { memo, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#22C55E', '#EAB308'];

function initials(name = '?') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

const StreamVideo = memo(function StreamVideo({ stream, muted = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
});

const LiveVideoPanel = memo(function LiveVideoPanel({
  localStream,
  remoteStreams = {},
  participants = [],
  selfId,
  compact = false,
}) {
  const { palette: p, tokens: t } = useTheme();

  const tiles = [];
  if (localStream) {
    tiles.push({ id: 'self', name: 'Sen', stream: localStream, isSelf: true });
  }
  Object.entries(remoteStreams).forEach(([socketId, stream]) => {
    const peer = participants.find((p_) => p_.socketId === socketId);
    tiles.push({
      id: socketId,
      name: peer?.displayName || 'Katılımcı',
      stream,
      isSelf: false,
      role: peer?.role,
    });
  });

  if (!tiles.length) {
    tiles.push(...participants.filter((p_) => p_.connected !== false).slice(0, 4).map((p_, i) => ({
      id: p_.userId,
      name: p_.displayName || 'Katılımcı',
      placeholder: true,
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      role: p_.role,
      isSelf: p_.userId === selfId,
    })));
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: t.spacing[2],
      height: '100%',
      minHeight: compact ? 160 : 220,
      padding: compact ? t.spacing[2] : t.spacing[3],
    }}>
      {tiles.map((tile) => (
        <div
          key={tile.id}
          style={{
            position: 'relative',
            borderRadius: t.borderRadius.lg,
            overflow: 'hidden',
            background: tile.placeholder ? tile.color : p.panelElevated,
            border: tile.isSelf ? `2px solid ${p.accent}` : `1px solid ${p.border}`,
            minHeight: compact ? 150 : 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tile.stream ? (
            <StreamVideo stream={tile.stream} muted={tile.isSelf} />
          ) : (
            <span style={{
              fontSize: t.typography.fontSize['2xl'],
              fontWeight: t.typography.fontWeight.bold,
              color: '#fff',
            }}>
              {initials(tile.name)}
            </span>
          )}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: t.typography.fontSize.xs,
              color: '#fff',
              background: 'rgba(0,0,0,0.55)',
              padding: '2px 8px',
              borderRadius: t.borderRadius.full,
            }}>
              {tile.name}
            </span>
            {tile.role === 'host' && (
              <span style={{
                fontSize: '10px',
                color: '#fff',
                background: p.accent,
                padding: '2px 6px',
                borderRadius: t.borderRadius.full,
              }}>
                Eğitmen
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default LiveVideoPanel;
