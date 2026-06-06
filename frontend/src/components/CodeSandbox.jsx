import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  memo,
} from 'react';
import { designTokens as t } from '../design-system/tokens';
import { getSocket } from '../services/socket';
import { SOCKET_EVENTS } from '../services/socketEvents';

// ---------------------------------------------------------------------------
// Starter code templates
// ---------------------------------------------------------------------------
const STARTER_TEMPLATES = {
  javascript: `// JavaScript Kod Editörü
// Kodu düzenle ve "Çalıştır" butonuna bas

function greet(name) {
  return \`Merhaba, \${name}! 🎓\`;
}

const sonuc = greet("Öğrenci");
console.log(sonuc);

// Dizi örneği
const notlar = [85, 92, 78, 95, 88];
const ortalama = notlar.reduce((a, b) => a + b, 0) / notlar.length;
console.log("Ortalama not:", ortalama.toFixed(1));
`,
  python: `# Python Kod Editörü
# Kodu düzenle ve "Çalıştır" butonuna bas

def greet(name):
    return f"Merhaba, {name}! 🎓"

sonuc = greet("Öğrenci")
print(sonuc)

# Liste örneği
notlar = [85, 92, 78, 95, 88]
ortalama = sum(notlar) / len(notlar)
print(f"Ortalama not: {ortalama:.1f}")
`,
  html: `<!-- HTML Kod Editörü -->
<!DOCTYPE html>
<html lang="tr">
<head>
  <title>Öğrenci Sayfası</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    .kart { background:#E3F2FD; border-radius:8px; padding:16px; }
  </style>
</head>
<body>
  <div class="kart">
    <h1>🎓 Online Eğitim Platformu</h1>
    <p>HTML öğreniyorum!</p>
  </div>
</body>
</html>
`,
  java: `// Java Kod Editörü (simülasyon)
public class Main {
  public static void main(String[] args) {
    System.out.println("Merhaba, Öğrenci! 🎓");
  }
}
`,
  csharp: `// C# Kod Editörü (simülasyon)
using System;

class Program {
  static void Main() {
    Console.WriteLine("Merhaba, Öğrenci! 🎓");
  }
}
`,
};

// ---------------------------------------------------------------------------
// Simulated JS runner (safe eval sandbox)
// ---------------------------------------------------------------------------
function runJavaScript(code) {
  const logs = [];
  const sandbox = {
    console: { log: (...args) => logs.push(args.map(String).join(' ')) },
  };

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'console',
      `"use strict";\n${code}\n`
    );
    fn(sandbox.console);
    return { ok: true, output: logs.join('\n') || '(Çıktı yok)' };
  } catch (err) {
    return { ok: false, output: `Hata: ${err.message}` };
  }
}

function simulateOutput(lang, code) {
  if (lang === 'javascript') return runJavaScript(code);
  if (lang === 'python') {
    const printLines = [...code.matchAll(/print\((['"`]?)(.+?)\1\)/g)].map(
      (m) => m[2]
    );
    return {
      ok: true,
      output: printLines.length
        ? printLines.join('\n')
        : '(Python simülasyonu – Çıktı yok)',
    };
  }
  if (lang === 'java' || lang === 'csharp') {
    const outLines = [...code.matchAll(/(?:System\.out\.println|Console\.WriteLine)\(\s*["'](.+?)["']\s*\)/g)].map(
      (m) => m[1]
    );
    return {
      ok: true,
      output: outLines.length
        ? outLines.join('\n')
        : `(${lang === 'java' ? 'Java' : 'C#'} simülasyonu – Çıktı yok)`,
    };
  }
  return { ok: true, output: '(HTML önizleme aşağıda görünecek)' };
}

// ---------------------------------------------------------------------------
// Line numbers component
// ---------------------------------------------------------------------------
const LineNumbers = memo(function LineNumbers({ code }) {
  const count = useMemo(() => code.split('\n').length, [code]);
  return (
    <div
      aria-hidden="true"
      style={{
        padding: `${t.spacing[3]} ${t.spacing[2]}`,
        fontFamily: t.typography.fontFamily.mono,
        fontSize: '13px',
        lineHeight: '1.6',
        color: t.colors.neutral[400],
        background: '#1a1d2e',
        textAlign: 'right',
        userSelect: 'none',
        minWidth: '36px',
        borderRight: `1px solid ${t.colors.neutral[700]}`,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Language badge
// ---------------------------------------------------------------------------
const LANG_COLORS = {
  javascript: { bg: '#F0DB4F', fg: '#323330', label: 'JS' },
  python:     { bg: '#3776AB', fg: '#FFE873', label: 'PY' },
  java:       { bg: '#ED8B00', fg: '#fff',    label: 'Java' },
  csharp:     { bg: '#68217A', fg: '#fff',    label: 'C#' },
  html:       { bg: '#E34F26', fg: '#fff',    label: 'HTML' },
};

// ---------------------------------------------------------------------------
// Main CodeSandbox component
// ---------------------------------------------------------------------------
function CodeSandbox({
  defaultLanguage = 'javascript',
  className = '',
  roomId = null,        // verilirse kod canlı olarak eğitmene düşürülür
  streamToHost = true,  // yazarken canlı stream (debounce'lu)
}) {
  const [lang, setLang] = useState(defaultLanguage);
  const [code, setCode] = useState(STARTER_TEMPLATES[defaultLanguage]);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);

  const syncEnabled = !!roomId;

  // Canlı yazımı (debounce) eğitmene stream et
  useEffect(() => {
    if (!syncEnabled || !streamToHost) return undefined;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      getSocket().emit(SOCKET_EVENTS.CODE_UPDATE, { roomId, code, language: lang });
    }, 600);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [code, lang, roomId, syncEnabled, streamToHost]);

  // Eğitmenden gelen geri bildirimi dinle
  useEffect(() => {
    if (!syncEnabled) return undefined;
    const socket = getSocket();
    const onFeedback = ({ message, score }) => {
      setOutput({
        ok: true,
        output: `👨‍🏫 Eğitmen geri bildirimi${score != null ? ` (Puan: ${score})` : ''}:\n${message}`,
      });
    };
    socket.on(SOCKET_EVENTS.CODE_FEEDBACK, onFeedback);
    return () => socket.off(SOCKET_EVENTS.CODE_FEEDBACK, onFeedback);
  }, [syncEnabled]);

  // Kodu eğitmene teslim et
  const handleSubmit = useCallback(() => {
    if (!syncEnabled) return;
    getSocket().emit(SOCKET_EVENTS.CODE_SUBMIT, { roomId, code, language: lang });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }, [syncEnabled, roomId, code, lang]);

  // Reset code when language changes
  const handleLangChange = useCallback((newLang) => {
    setLang(newLang);
    setCode(STARTER_TEMPLATES[newLang]);
    setOutput(null);
  }, []);

  // Tab key support in textarea
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  }, [code]);

  const handleRun = useCallback(() => {
    setRunning(true);
    // Slight delay to show loading state
    setTimeout(() => {
      setOutput(simulateOutput(lang, code));
      setRunning(false);
    }, 400);
  }, [lang, code]);

  const handleClear = useCallback(() => {
    setCode(STARTER_TEMPLATES[lang]);
    setOutput(null);
  }, [lang]);

  const langMeta = useMemo(() => LANG_COLORS[lang], [lang]);

  // Sync textarea scroll position for line numbers
  const syncScroll = useCallback((e) => {
    const lineNumEl = e.target.previousSibling;
    if (lineNumEl) lineNumEl.scrollTop = e.target.scrollTop;
  }, []);

  return (
    <div
      className={`code-sandbox ${className}`}
      style={{
        borderRadius: t.borderRadius.xl,
        overflow: 'hidden',
        border: `1px solid ${t.colors.neutral[700]}`,
        background: '#0f1117',
        fontFamily: t.typography.fontFamily.mono,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* ---- Toolbar ---- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing[2],
          padding: `${t.spacing[2]} ${t.spacing[4]}`,
          background: '#1a1d2e',
          borderBottom: `1px solid ${t.colors.neutral[700]}`,
          flexWrap: 'wrap',
        }}
      >
        {/* Traffic-light dots */}
        <div style={{ display: 'flex', gap: '6px', marginRight: t.spacing[2] }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>

        {/* Lang selector */}
        {Object.entries(LANG_COLORS).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => handleLangChange(key)}
            style={{
              padding: `${t.spacing[1]} ${t.spacing[3]}`,
              borderRadius: t.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
              fontFamily: t.typography.fontFamily.mono,
              fontSize: '12px',
              fontWeight: t.typography.fontWeight.bold,
              background: lang === key ? meta.bg : t.colors.neutral[700],
              color: lang === key ? meta.fg : t.colors.neutral[300],
              transition: t.transitions.fast,
            }}
          >
            {meta.label}
          </button>
        ))}

        <span style={{ flex: 1 }} />

        {/* Action buttons */}
        <button
          onClick={handleClear}
          style={{
            padding: `${t.spacing[1]} ${t.spacing[3]}`,
            borderRadius: t.borderRadius.md,
            border: `1px solid ${t.colors.neutral[600]}`,
            background: 'transparent',
            color: t.colors.neutral[400],
            cursor: 'pointer',
            fontSize: '12px',
            transition: t.transitions.fast,
          }}
        >
          Sıfırla
        </button>

        {/* Eğitmene gönder — yalnızca canlı oturumda (roomId) görünür */}
        {syncEnabled && (
          <button
            onClick={handleSubmit}
            style={{
              padding: `${t.spacing[1]} ${t.spacing[4]}`,
              borderRadius: t.borderRadius.md,
              border: 'none',
              background: submitted ? t.colors.success[600] : t.colors.primary[500],
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: t.typography.fontWeight.semibold,
              transition: t.transitions.fast,
            }}
          >
            {submitted ? '✓ Gönderildi' : '📤 Eğitmene Gönder'}
          </button>
        )}

        <button
          onClick={handleRun}
          disabled={running}
          style={{
            padding: `${t.spacing[1]} ${t.spacing[4]}`,
            borderRadius: t.borderRadius.md,
            border: 'none',
            background: running ? t.colors.neutral[600] : t.colors.success[500],
            color: '#fff',
            cursor: running ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: t.typography.fontWeight.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: t.transitions.fast,
          }}
        >
          {running ? '⟳ Çalışıyor…' : '▶ Çalıştır'}
        </button>
      </div>

      {/* ---- Editor + Output layout ---- */}
      <div
        className="sandbox-editor-output"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Editor pane */}
        <div style={{ display: 'flex', overflow: 'auto', borderRight: `1px solid ${t.colors.neutral[700]}` }}>
          <LineNumbers code={code} />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            spellCheck={false}
            aria-label={`${lang} kod editörü`}
            style={{
              flex: 1,
              padding: `${t.spacing[3]} ${t.spacing[3]}`,
              border: 'none',
              background: '#0f1117',
              color: '#e2e8f0',
              fontFamily: t.typography.fontFamily.mono,
              fontSize: '13px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              overflow: 'auto',
              caretColor: t.colors.primary[400],
            }}
          />
        </div>

        {/* Output pane */}
        <div
          style={{
            background: '#0b0e1a',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: `${t.spacing[2]} ${t.spacing[4]}`,
              borderBottom: `1px solid ${t.colors.neutral[700]}`,
              fontSize: '11px',
              color: t.colors.neutral[400],
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing[2],
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: output?.ok === false
                  ? t.colors.error[500]
                  : output?.ok
                    ? t.colors.success[500]
                    : t.colors.neutral[500],
              }}
            />
            ÇIKTI
          </div>
          <pre
            style={{
              flex: 1,
              margin: 0,
              padding: `${t.spacing[3]} ${t.spacing[4]}`,
              color: output?.ok === false
                ? t.colors.error[400]
                : '#a3e635',
              fontFamily: t.typography.fontFamily.mono,
              fontSize: '13px',
              lineHeight: '1.6',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {running
              ? '⟳ Çalışıyor…'
              : output
                ? output.output
                : '// Kodu yazdıktan sonra ▶ Çalıştır butonuna bas'}
          </pre>
        </div>
      </div>

      {/* ---- HTML Preview (only for html lang) ---- */}
      {lang === 'html' && (
        <div style={{ borderTop: `1px solid ${t.colors.neutral[700]}` }}>
          <div
            style={{
              padding: `${t.spacing[2]} ${t.spacing[4]}`,
              fontSize: '11px',
              color: t.colors.neutral[400],
              background: '#1a1d2e',
            }}
          >
            HTML ÖNİZLEME
          </div>
          <iframe
            title="HTML önizleme"
            srcDoc={code}
            sandbox="allow-scripts"
            style={{ width: '100%', height: '160px', border: 'none', background: '#fff' }}
          />
        </div>
      )}
    </div>
  );
}

export default memo(CodeSandbox);
