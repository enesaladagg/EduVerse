import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Code2, GitMerge, Rocket, Database, Cloud, Shield, Palette, Settings, Download, Share2, CheckCircle2, Search, Award, Star } from 'lucide-react';

const MY_CERTS = [
  { id: "CERT-PY-2026-0412", title: "Python Temelleri", date: "12 Nisan 2026", issuer: "EduVerse", hours: 42, Icon: Code2, color: "#00d4aa", score: 92, skills: ["Değişkenler", "Döngüler", "Fonksiyonlar", "OOP Giriş"] },
  { id: "CERT-GIT-2026-0318", title: "Git & GitHub Uzmanlığı", date: "18 Mart 2026", issuer: "EduVerse", hours: 18, Icon: GitMerge, color: "#6c5ce7", score: 88, skills: ["Branch", "Merge", "Pull Request", "CI/CD"] },
];

const AVAILABLE_CERTS = [
  { title: "Full Stack Web Developer", courses: 8, hours: 180, level: "İleri", Icon: Rocket, color: "#00d4aa", progress: 45, enrolled: 12450, price: "Ücretsiz", prereqs: ["Python Temelleri", "Git & GitHub"] },
  { title: "Data Science Professional", courses: 6, hours: 156, level: "İleri", Icon: Database, color: "#6c5ce7", progress: 0, enrolled: 8930, price: "Ücretsiz", prereqs: ["Python Temelleri"] },
  { title: "AWS Cloud Architect", courses: 5, hours: 120, level: "İleri", Icon: Cloud, color: "#3B82F6", progress: 0, enrolled: 5670, price: "₺499", prereqs: [] },
  { title: "Siber Güvenlik Uzmanı", courses: 7, hours: 140, level: "Orta", Icon: Shield, color: "#ff6b6b", progress: 12, enrolled: 7210, price: "Ücretsiz", prereqs: [] },
  { title: "UI/UX Tasarım Sertifikası", courses: 4, hours: 96, level: "Orta", Icon: Palette, color: "#a29bfe", progress: 0, enrolled: 6340, price: "Ücretsiz", prereqs: [] },
  { title: "DevOps Engineer", courses: 6, hours: 130, level: "İleri", Icon: Settings, color: "#00b894", progress: 0, enrolled: 4890, price: "₺399", prereqs: ["Git & GitHub"] },
];

export default function CertificatesView({ onNavigate }) {
  const { isDark, palette } = useTheme();
  const [tab, setTab] = useState("available");
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const C = {
    bg: isDark ? "#0a1628" : "#f0fdfa",
    surface: isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.7)",
    surfaceElevated: isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.9)",
    text: isDark ? "#f8fafc" : "#0f172a",
    textMuted: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    accent: "#00d4aa",
  };

  const handleVerify = () => {
    const found = MY_CERTS.find(c => c.id === verifyId.trim());
    setVerifyResult(found ? { valid: true, cert: found } : { valid: false });
  };

  const handleDownloadPdf = (cert) => {
    const html = `
      <html>
        <head>
          <title>${cert.id} - ${cert.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
            body { font-family: 'Outfit', sans-serif; text-align: center; padding: 40px; background: #f8fafc; color: #0f172a; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .cert-box { border: 12px solid ${cert.color}; padding: 60px; background: white; max-width: 900px; width: 100%; box-shadow: 0 24px 48px rgba(0,0,0,0.08); position: relative; overflow: hidden; border-radius: 24px; }
            .bg-blob { position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: ${cert.color}; opacity: 0.05; border-radius: 50%; filter: blur(40px); }
            .bg-blob2 { position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: ${cert.color}; opacity: 0.05; border-radius: 50%; filter: blur(40px); }
            h1 { font-size: 56px; font-weight: 900; letter-spacing: -1px; margin: 0 0 10px; color: #0f172a; }
            .subtitle { font-size: 20px; color: #64748b; font-weight: 400; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px; }
            h2 { color: ${cert.color}; font-size: 42px; margin: 0 0 40px; font-weight: 800; }
            .details { font-size: 18px; color: #334155; margin-bottom: 60px; display: flex; justify-content: space-around; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; }
            .details div { display: flex; flex-direction: column; gap: 8px; }
            .details span { font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
            .details strong { font-size: 24px; color: #0f172a; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 2px solid #f1f5f9; padding-top: 40px; }
            .logo { font-size: 32px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 8px; }
            .logo-dot { width: 12px; height: 12px; background: ${cert.color}; border-radius: 50%; display: inline-block; }
            .id-box { font-family: monospace; font-size: 14px; color: #94a3b8; background: #f1f5f9; padding: 10px 16px; border-radius: 8px; }
            @media print {
              @page { size: landscape; margin: 0; }
              body { background: white; padding: 0; display: block; }
              .cert-box { border-width: 20px; border-radius: 0; box-shadow: none; width: 100vw; height: 100vh; box-sizing: border-box; }
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="bg-blob"></div>
            <div class="bg-blob2"></div>
            <h1>BAŞARI SERTİFİKASI</h1>
            <div class="subtitle">Bu belge, aşağıdaki kursu başarıyla tamamlayan öğrenciye verilmiştir</div>
            <h2>${cert.title}</h2>
            
            <div class="details">
              <div><span>Veriliş Tarihi</span><strong>${cert.date}</strong></div>
              <div><span>Sertifika Puanı</span><strong style="color: ${cert.color}">${cert.score} / 100</strong></div>
              <div><span>Eğitim Süresi</span><strong>${cert.hours} Saat</strong></div>
            </div>

            <div class="footer">
              <div class="logo"><span class="logo-dot"></span> EduVerse</div>
              <div class="id-box">Doğrulama Kodu: ${cert.id}</div>
            </div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => window.print(), 500); }
          </script>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleLinkedInShare = (cert) => {
    const url = new URL('https://www.linkedin.com/profile/add');
    url.searchParams.append('startTask', 'CERTIFICATION_NAME');
    url.searchParams.append('name', cert.title);
    url.searchParams.append('organizationName', cert.issuer);
    url.searchParams.append('certId', cert.id);
    url.searchParams.append('certUrl', `https://eduverse.app/verify/${cert.id}`);
    window.open(url.toString(), '_blank');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        .cert-bg-light {
          background: linear-gradient(-45deg, #f0fdfa, #ffffff, #f8fafc, #eef2ff);
          background-size: 400% 400%;
          animation: bgAnim 15s ease infinite;
        }
        .cert-bg-dark {
          background: linear-gradient(-45deg, #04080f, #0a1628, #0c1a30, #06101f);
          background-size: 400% 400%;
          animation: bgAnim 15s ease infinite;
        }
        @keyframes bgAnim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-card {
          background: ${C.surface};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${C.border};
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: ${C.accent};
        }

        .cert-header {
          position: relative;
          padding: 60px 40px;
          border-radius: 32px;
          overflow: hidden;
          background: ${isDark ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #00d4aa, #00b894)'};
          color: #fff;
          margin-bottom: 40px;
          box-shadow: 0 20px 40px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,212,170,0.3)'};
        }
        
        .cert-header::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
          border-radius: 50%;
          pointer-events: none;
        }

        .cert-tab {
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid ${isDark ? 'rgba(0,212,170,0.2)' : 'rgba(0,212,170,0.2)'};
          background: ${isDark ? 'rgba(0,212,170,0.05)' : 'rgba(0,212,170,0.05)'};
          color: ${C.text};
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        .cert-tab.active {
          background: linear-gradient(135deg, #00d4aa, #00b894);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
        }
        .cert-tab:hover:not(.active) {
          background: ${isDark ? 'rgba(0,212,170,0.15)' : 'rgba(0,212,170,0.15)'};
          transform: translateY(-2px);
        }

        .cert-btn-primary {
          background: linear-gradient(135deg, #00d4aa, #00b894);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,212,170,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .cert-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,212,170,0.4);
        }

        .cert-btn-outline {
          background: transparent;
          color: ${C.text};
          border: 1px solid ${C.border};
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .cert-btn-outline:hover {
          border-color: ${C.textMuted};
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
          transform: translateY(-2px);
        }

        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <GlobalNavbar activePage="certificates" onNavigate={onNavigate} />
      
      <div className={isDark ? "cert-bg-dark" : "cert-bg-light"} style={{ minHeight: '100vh', padding: '120px 5% 60px', fontFamily: "'Outfit', sans-serif", color: C.text }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          
          {/* Header Section */}
          <div className="cert-header">
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 30 }}>
              <div>
                <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Award size={42} color={isDark ? C.accent : '#fff'} /> Sertifika Merkezi
                </h1>
                <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, lineHeight: 1.6 }}>
                  Sektörde geçerli sertifikalarla kariyerinde fark yarat. Öğrendiklerini kanıtla, profilini güçlendir ve hayalindeki işe bir adım daha yaklaş.
                </p>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[{ v: MY_CERTS.length, l: "Kazanılan" }, { v: AVAILABLE_CERTS.length, l: "Mevcut" }, { v: "1", l: "Devam Eden" }].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '20px 28px', borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800 }}>{s.v}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
            {[{ k: "available", l: "Tüm Sertifikalar" }, { k: "my", l: "Sertifikalarım" }, { k: "verify", l: "Sertifika Doğrula" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`cert-tab ${tab === t.k ? 'active' : ''}`}>
                {t.l}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="fade-in">
            
            {/* AVAILABLE CERTS */}
            {tab === "available" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
                {AVAILABLE_CERTS.map((cert, i) => (
                  <div key={i} className="glass-card" style={{ padding: 30 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 18, background: `${cert.color}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cert.color}30`, flexShrink: 0 }}>
                        <cert.Icon size={32} color={cert.color} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{cert.title}</h3>
                        <div style={{ display: "flex", gap: 12, fontSize: 13, color: C.textMuted, fontWeight: 600, flexWrap: "wrap" }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Code2 size={14}/> {cert.courses} Kurs</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Award size={14}/> {cert.level}</span>
                        </div>
                      </div>
                    </div>

                    {cert.progress > 0 && (
                      <div style={{ marginBottom: 24, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 700 }}>İlerleme</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: cert.color }}>{cert.progress}%</span>
                        </div>
                        <div style={{ height: 8, background: `${cert.color}20`, borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: cert.color, width: `${cert.progress}%`, borderRadius: 4, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Kayıtlı</span>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>{cert.enrolled.toLocaleString("tr-TR")}</span>
                      </div>
                      <button className="cert-btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
                        {cert.progress > 0 ? "Devam Et" : "Başla"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MY CERTS */}
            {tab === "my" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: 30 }}>
                {MY_CERTS.map(cert => (
                  <div key={cert.id} className="glass-card" style={{ padding: 0 }}>
                    <div style={{ height: 8, background: cert.color }} />
                    <div style={{ padding: 32 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                          <div style={{ width: 72, height: 72, borderRadius: 20, background: `${cert.color}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cert.color}30` }}>
                            <cert.Icon size={36} color={cert.color} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{cert.title}</h3>
                            <p style={{ fontSize: 14, color: C.textMuted, fontWeight: 500 }}>Düzenlenme: {cert.date}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "center", padding: "12px 20px", borderRadius: 16, background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 900, color: cert.color }}>{cert.score}</div>
                          <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Puan</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                        {cert.skills.map(s => (
                          <span key={s} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: C.text }}>{s}</span>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 16 }}>
                        <button onClick={() => handleDownloadPdf(cert)} className="cert-btn-primary" style={{ flex: 1, background: cert.color, boxShadow: `0 4px 15px ${cert.color}40` }}>
                          <Download size={18} /> İndir (PDF)
                        </button>
                        <button onClick={() => handleLinkedInShare(cert)} className="cert-btn-outline" style={{ flex: 1 }}>
                          <Share2 size={18} color="#0a66c2" /> LinkedIn'e Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VERIFY */}
            {tab === "verify" && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: 650, padding: 48, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 96, height: 96, borderRadius: '50%', background: `${C.accent}15`, color: C.accent, marginBottom: 24 }}>
                    <Search size={48} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Sertifika Doğrulama</h3>
                  <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.6, marginBottom: 32 }}>
                    EduVerse tarafından verilen sertifikaların geçerliliğini ve orijinalliğini kontrol edin. Lütfen sertifika üzerinde yazan ID numarasını girin.
                  </p>
                  
                  <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                    <input 
                      value={verifyId} 
                      onChange={e => setVerifyId(e.target.value)} 
                      placeholder="Örn: CERT-PY-2026-0412"
                      style={{ 
                        flex: 1, padding: "18px 24px", borderRadius: 16, border: `2px solid ${C.border}`, 
                        fontSize: 16, fontFamily: "'JetBrains Mono', monospace", outline: "none", 
                        color: C.text, background: isDark ? 'rgba(0,0,0,0.2)' : '#fff', 
                        transition: 'all 0.3s' 
                      }}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 4px ${C.accent}20`; }} 
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }} 
                    />
                    <button onClick={handleVerify} style={{ 
                      padding: '0 36px', fontSize: 16, background: '#00d4aa', color: '#fff', 
                      border: 'none', borderRadius: 16, fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(0,212,170,0.3)', transition: 'all 0.3s' 
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Sorgula
                    </button>
                  </div>

                  {verifyResult && (
                    <div className="fade-in" style={{
                      padding: 30, borderRadius: 20, textAlign: 'left',
                      background: verifyResult.valid ? `${C.accent}15` : `rgba(244,63,94,0.1)`,
                      border: `1px solid ${verifyResult.valid ? `${C.accent}40` : `rgba(244,63,94,0.3)`}`,
                    }}>
                      {verifyResult.valid ? (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                          <CheckCircle2 size={40} color={C.accent} strokeWidth={2} style={{ flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Orijinal Sertifika Onaylandı</div>
                            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.6 }}>
                              Bu sertifika <strong>{verifyResult.cert.issuer}</strong> tarafından düzenlenmiş resmi bir belgedir.<br/><br/>
                              Kazanılan Program: <strong style={{ color: verifyResult.cert.color }}>{verifyResult.cert.title}</strong><br/>
                              Sertifika Tarihi: <strong>{verifyResult.cert.date}</strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <Shield size={40} color="#f43f5e" strokeWidth={2} style={{ flexShrink: 0 }} />
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#f43f5e" }}>Geçersiz veya bulunamayan sertifika kimliği. Lütfen kontrol edip tekrar deneyin.</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: 14, color: C.textMuted }}>Sistemi test etmek için ID: <code style={{ fontFamily: "'JetBrains Mono', monospace", background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', padding: "4px 8px", borderRadius: 6, color: C.text, fontWeight: 700 }}>CERT-PY-2026-0412</code></p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
