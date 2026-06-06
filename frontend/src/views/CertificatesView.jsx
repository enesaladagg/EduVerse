import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Badge, ProgressBar, Card, SectionHead, Tag } from '../components/PageBlocks';
import { Code2, GitMerge, Rocket, Database, Cloud, Shield, Palette, Settings, Download, Share2, CheckCircle2, Search } from 'lucide-react';

const MY_CERTS = [
  { id: "CERT-PY-2026-0412", title: "Python Temelleri", date: "12 Nisan 2026", issuer: "EduVerse", hours: 42, Icon: Code2, color: "#10b981", score: 92, skills: ["Değişkenler", "Döngüler", "Fonksiyonlar", "OOP Giriş"] },
  { id: "CERT-GIT-2026-0318", title: "Git & GitHub Uzmanlığı", date: "18 Mart 2026", issuer: "EduVerse", hours: 18, Icon: GitMerge, color: "#6366f1", score: 88, skills: ["Branch", "Merge", "Pull Request", "CI/CD"] },
];

const AVAILABLE_CERTS = [
  { title: "Full Stack Web Developer", courses: 8, hours: 180, level: "İleri", Icon: Rocket, color: "#10b981", progress: 45, enrolled: 12450, price: "Ücretsiz", prereqs: ["Python Temelleri", "Git & GitHub"] },
  { title: "Data Science Professional", courses: 6, hours: 156, level: "İleri", Icon: Database, color: "#6366f1", progress: 0, enrolled: 8930, price: "Ücretsiz", prereqs: ["Python Temelleri"] },
  { title: "AWS Cloud Architect", courses: 5, hours: 120, level: "İleri", Icon: Cloud, color: "#0ea5e9", progress: 0, enrolled: 5670, price: "₺499", prereqs: [] },
  { title: "Siber Güvenlik Uzmanı", courses: 7, hours: 140, level: "Orta", Icon: Shield, color: "#f43f5e", progress: 12, enrolled: 7210, price: "Ücretsiz", prereqs: [] },
  { title: "UI/UX Tasarım Sertifikası", courses: 4, hours: 96, level: "Orta", Icon: Palette, color: "#8b5cf6", progress: 0, enrolled: 6340, price: "Ücretsiz", prereqs: [] },
  { title: "DevOps Engineer", courses: 6, hours: 130, level: "İleri", Icon: Settings, color: "#06b6d4", progress: 0, enrolled: 4890, price: "₺399", prereqs: ["Git & GitHub"] },
];

export default function CertificatesView({ onNavigate }) {
  const { isDark, palette } = useTheme();
  const [tab, setTab] = useState("available");
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const C = {
    navBg: isDark ? "#0f172a" : "#ffffff",
    pageBg: isDark ? "#0a0f1d" : "#f1f5f9",
    white: isDark ? "#1e293b" : "#ffffff",
    primary: palette.accent,
    primaryDim: isDark ? "rgba(0,212,170,0.15)" : "rgba(0,212,170,0.08)",
    primaryBorder: isDark ? "rgba(0,212,170,0.3)" : "rgba(0,212,170,0.2)",
    heading: isDark ? "#f8fafc" : "#0f172a",
    body: isDark ? "#cbd5e1" : "#334155",
    muted: isDark ? "#94a3b8" : "#64748b",
    faint: isDark ? "#64748b" : "#94a3b8",
    gold: "#f59e0b",
    rose: "#f43f5e",
    indigo: "#6366f1",
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    sky: "#0ea5e9",
    border: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
    shadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 25px -3px rgba(0,0,0,0.08)",
    font: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
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
    // LinkedIn official Add to Profile URL format
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
      <GlobalNavbar activePage="certificates" onNavigate={onNavigate} />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: C.pageBg, padding: '40px 5%', color: C.body, fontFamily: C.font }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            borderRadius: 24, padding: "40px 36px", marginBottom: 32, position: "relative", overflow: "hidden",
            background: `linear-gradient(135deg, ${isDark ? '#0f172a' : '#1e293b'}, ${isDark ? '#020617' : '#0f172a'})`,
            boxShadow: C.shadowLg
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: C.primary, filter: "blur(120px)", opacity: .15 }} />
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <h1 style={{ fontFamily: C.font, fontSize: 36, fontWeight: 900, color: "#f8fafc", marginBottom: 12 }}>🏆 Sertifikalar</h1>
                <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 500, lineHeight: 1.6 }}>Kursları tamamla, sınavları geç ve sektörde geçerli sertifikalarını kazan. LinkedIn profiline ekle, CV'nde fark yarat.</p>
              </div>
              <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
                {[{ v: "2", l: "Kazanılan" }, { v: "6", l: "Kullanılabilir" }, { v: "1", l: "Devam Eden" }].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: 16, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 800, color: C.primary }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 32, background: C.white, borderRadius: 14, padding: 4, border: `1px solid ${C.border}`, width: "fit-content", boxShadow: C.shadow }}>
            {[{ k: "my", l: "Sertifikalarım" }, { k: "available", l: "Tüm Sertifikalar" }, { k: "verify", l: "Doğrula" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: C.font,
                fontSize: 14, fontWeight: tab === t.k ? 700 : 600, transition: 'all 0.2s',
                background: tab === t.k ? C.primaryDim : "transparent", color: tab === t.k ? C.primary : C.muted,
              }}>{t.l}</button>
            ))}
          </div>

          {tab === "my" && (
            <div className="fade-in-up">
              <SectionHead title="Kazanılan Sertifikalar" sub={`${MY_CERTS.length} sertifika`} C={C} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: 24 }}>
                {MY_CERTS.map(cert => (
                  <Card key={cert.id} style={{ overflow: "hidden" }} C={C}>
                    <div style={{ height: 8, background: cert.color }} />
                    <div style={{ padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div style={{ width: 64, height: 64, borderRadius: 16, background: `${cert.color}15`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 1px ${cert.color}30` }}>
                            <cert.Icon size={32} color={cert.color} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, color: C.heading }}>{cert.title}</h3>
                            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Tamamlanma: {cert.date}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: "center", padding: "10px 16px", borderRadius: 16, background: `${cert.color}10`, border: `1px solid ${cert.color}25` }}>
                          <div style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 800, color: cert.color }}>{cert.score}</div>
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Puan</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                        {cert.skills.map(s => <Tag key={s} color={cert.color}>{s}</Tag>)}
                      </div>

                      <div style={{ display: "flex", gap: 20, fontSize: 13, color: C.muted, marginBottom: 24, padding: '12px', background: C.pageBg, borderRadius: 12 }}>
                        <span style={{display: 'flex', alignItems: 'center', gap: 6}}>⏱ <strong>{cert.hours}</strong> saat</span>
                        <span style={{display: 'flex', alignItems: 'center', gap: 6}}>🏛️ <strong>{cert.issuer}</strong></span>
                        <span style={{ fontFamily: C.mono, fontSize: 12, color: C.faint, marginLeft: 'auto' }}>#{cert.id.split('-').pop()}</span>
                      </div>

                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => handleDownloadPdf(cert)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: "12px", borderRadius: 12, border: "none", background: cert.color, color: "#fff", fontFamily: C.font, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: `0 4px 12px ${cert.color}40` }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 16px ${cert.color}60`;}} onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 4px 12px ${cert.color}40`;}}>
                          <Download size={18} strokeWidth={2.5} /> İndir (PDF)
                        </button>
                        <button onClick={() => handleLinkedInShare(cert)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.pageBg, color: C.heading, fontFamily: C.font, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: 'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.background=C.border; e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{e.currentTarget.style.background=C.pageBg; e.currentTarget.style.transform='none'}}>
                          <Share2 size={18} color="#0a66c2" strokeWidth={2.5} /> LinkedIn'e Ekle
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === "available" && (
            <div className="fade-in-up">
              <SectionHead title="Tüm Sertifika Programları" sub="Sertifika almak için ilgili kursları tamamla ve final sınavını geç" C={C} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24 }}>
                {AVAILABLE_CERTS.map((cert, i) => (
                  <Card key={i} style={{ padding: 24 }} C={C}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: `${cert.color}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cert.color}25` }}>
                        <cert.Icon size={28} color={cert.color} strokeWidth={1.5} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: C.font, fontSize: 17, fontWeight: 800, color: C.heading, marginBottom: 4 }}>{cert.title}</h3>
                        <div style={{ display: "flex", gap: 12, fontSize: 13, color: C.muted, fontWeight: 500 }}>
                          <span>{cert.courses} kurs</span><span style={{opacity: 0.5}}>|</span><span>{cert.hours} saat</span><span style={{opacity: 0.5}}>|</span><span style={{color: C.heading}}>{cert.level}</span>
                        </div>
                      </div>
                    </div>

                    {cert.progress > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>İlerleme</span>
                          <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 800, color: cert.color }}>{cert.progress}%</span>
                        </div>
                        <ProgressBar value={cert.progress} color={cert.color} h={8} />
                      </div>
                    )}

                    {cert.prereqs.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: C.faint, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>ÖN KOŞULLAR</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {cert.prereqs.map(p => <Tag key={p} color={C.primary}>✓ {p}</Tag>)}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, color: C.muted, display: 'flex', alignItems: 'center', gap: 6 }}>👨‍🎓 <strong>{cert.enrolled.toLocaleString("tr-TR")}</strong> kayıtlı</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: C.font, fontSize: 16, fontWeight: 800, color: cert.price === "Ücretsiz" ? C.primary : C.heading }}>{cert.price}</span>
                        <button style={{
                          padding: "10px 20px", borderRadius: 12, border: "none",
                          background: cert.progress > 0 ? cert.color : C.primaryDim,
                          color: cert.progress > 0 ? "#fff" : C.primary,
                          fontFamily: C.font, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: 'all 0.2s'
                        }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>{cert.progress > 0 ? "Devam Et" : "Başla"}</button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {tab === "verify" && (
            <div className="fade-in-up" style={{display: 'flex', justifyContent: 'center'}}>
              <Card hover={false} style={{ width: '100%', maxWidth: 600, padding: 40 }} C={C}>
                <div style={{textAlign: 'center', marginBottom: 32}}>
                  <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: C.primaryDim, color: C.primary, marginBottom: 16}}>
                    <Search size={40} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 800, color: C.heading, marginBottom: 8 }}>Sertifika Doğrulama</h3>
                  <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6 }}>Bir EduVerse sertifikasının orijinalliğini ve geçerliliğini kontrol edin. Sertifika ID numarasını aşağıya girin.</p>
                </div>
                
                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  <input value={verifyId} onChange={e => setVerifyId(e.target.value)} placeholder="Sertifika ID girin (ör: CERT-PY-2026-0412)"
                    style={{ flex: 1, padding: "16px 20px", borderRadius: 14, border: `2px solid ${C.border}`, fontSize: 15, fontFamily: C.mono, outline: "none", color: C.heading, background: C.pageBg, transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  <button onClick={handleVerify} style={{ padding: "0 32px", borderRadius: 14, border: "none", background: C.primary, color: "#fff", fontFamily: C.font, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px ${C.primary}40`, transition: 'transform 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>Sorgula</button>
                </div>

                {verifyResult && (
                  <div className="fade-in-up" style={{
                    padding: 24, borderRadius: 16,
                    background: verifyResult.valid ? C.primaryDim : `${C.rose}15`,
                    border: `1px solid ${verifyResult.valid ? C.primaryBorder : C.rose + "30"}`,
                  }}>
                    {verifyResult.valid ? (
                      <div style={{display: 'flex', alignItems: 'flex-start', gap: 16}}>
                        <CheckCircle2 size={32} color={C.primary} strokeWidth={2} style={{flexShrink: 0}} />
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Geçerli Sertifika Onaylandı</div>
                          <div style={{ fontSize: 14, color: C.body, lineHeight: 1.5 }}>
                            Bu sertifika <strong>{verifyResult.cert.issuer}</strong> tarafından düzenlenmiş orijinal bir belgedir.<br/>
                            Kurs: <strong>{verifyResult.cert.title}</strong><br/>
                            Tarih: <strong>{verifyResult.cert.date}</strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                        <Shield size={32} color={C.rose} strokeWidth={2} style={{flexShrink: 0}} />
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.rose }}>Geçersiz veya bulunamayan sertifika ID'si.</div>
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center'}}>
                  <p style={{ fontSize: 13, color: C.faint }}>Deneme yapmak için: <code style={{ fontFamily: C.mono, background: C.pageBg, padding: "4px 8px", borderRadius: 6, color: C.heading, fontWeight: 600 }}>CERT-PY-2026-0412</code></p>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
