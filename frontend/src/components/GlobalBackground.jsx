import React, { memo } from 'react';

const GlobalBackground = memo(function GlobalBackground() {
  return (
    <>
      <style>{`
        @keyframes floatBg1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15%, 25%) scale(1.3); }
        }
        @keyframes floatBg2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20%, -15%) scale(1.2); }
        }
        @keyframes floatBg3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20%, -15%) scale(1.4); }
        }
        .global-bg-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .global-bg-blob {
          position: absolute;
          filter: blur(120px);
          opacity: 0.25;
          border-radius: 50%;
          mix-blend-mode: normal;
          transition: background 1s ease, opacity 1s ease;
        }
        [data-theme="dark"] .global-bg-blob {
          opacity: 0.08; /* Karanlık modda daha soft olsun */
        }
        .blob-1 {
          top: -30%;
          left: -20%;
          width: 80vw;
          height: 80vw;
          background: radial-gradient(circle, rgba(var(--c-accent-rgb), 0.8) 0%, transparent 70%);
          animation: floatBg1 40s ease-in-out infinite;
        }
        .blob-2 {
          bottom: -30%;
          right: -20%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(var(--c-accent-rgb), 0.5) 0%, transparent 70%);
          animation: floatBg2 50s ease-in-out infinite;
        }
        .blob-3 {
          top: 10%;
          left: 20%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(var(--c-text-rgb), 0.08) 0%, transparent 60%);
          animation: floatBg3 60s ease-in-out infinite;
        }
      `}</style>
      <div className="global-bg-container">
        <div className="global-bg-blob blob-1" />
        <div className="global-bg-blob blob-2" />
        <div className="global-bg-blob blob-3" />
      </div>
    </>
  );
});

export default GlobalBackground;
