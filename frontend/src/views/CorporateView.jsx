import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlobalNavbar from '../components/GlobalNavbar';
import { Badge, Card, SectionHead } from '../components/PageBlocks';

const ENTERPRISE_PLANS = [
  {
    name: "Takım", price: "₺149", per: "/kişi/ay", color: "#10b981", popular: false,
    features: ["10-50 kişilik ekipler", "Tüm kurslara erişim", "Takım ilerleme paneli", "E-posta destek", "Temel raporlama", "Sertifika yönetimi"],
  },
  {
    name: "Kurumsal", price: "₺99", per: "/kişi/ay", color: "#6366f1", popular: true,
    features: ["50+ kişilik ekipler", "Tüm kurslar + Özel içerikler", "Admin dashboard", "7/24 öncelikli destek", "Gelişmiş analitik & raporlama", "SSO & LDAP entegrasyonu", "API erişimi", "Özel eğitmen ataması", "LMS entegrasyonu"],
  },
  {
    name: "Özel Çözüm", price: "İletişim", per: "", color: "#f59e0b", popular: false,
    features: ["Sınırsız kullanıcı", "Özel müfredat tasarımı", "Beyaz etiket (White-label)", "Yerinde eğitim desteği", "Dedicated account manager", "SLA garantisi", "Özel API geliştirme"],
  },
];

const ENTERPRISE_LOGOS = ["🏦 Garanti BBVA", "🛒 Trendyol", "🚚 Getir", "📱 Turkcell", "🏭 Ford Otosan", "💼 Deloitte", "🏢 Siemens", "🛡️ STM"];

const ENTERPRISE_STATS = [
  { v: "500+", l: "Kurumsal Müşteri" },
  { v: "120K+", l: "Eğitim Alan Çalışan" },
  { v: "%94", l: "Memnuniyet Oranı" },
  { v: "%67", l: "Verimlilik Artışı" },
];

const ENTERPRISE_FEATURES = [
  { icon: "📊", title: "Gelişmiş Analitik", desc: "Çalışan bazlı ilerleme, departman karşılaştırması ve ROI raporları", color: "#10b981" },
  { icon: "🔐", title: "SSO & Güvenlik", desc: "SAML, LDAP, Azure AD entegrasyonu ve kurumsal güvenlik standartları", color: "#6366f1" },
  { icon: "🎯", title: "Özel Müfredat", desc: "Şirketinize özel eğitim yolları ve içerik oluşturma desteği", color: "#f59e0b" },
  { icon: "👨‍🏫", title: "Dedike Eğitmen", desc: "Ekibinize atanmış uzman eğitmenlerle birebir destek", color: "#f43f5e" },
  { icon: "🔗", title: "LMS Entegrasyonu", desc: "Mevcut LMS'inize sorunsuz entegrasyon (SCORM, xAPI)", color: "#06b6d4" },
  { icon: "📞", title: "7/24 Destek", desc: "Öncelikli destek hattı ve dedike müşteri temsilcisi", color: "#8b5cf6" },
];

export default function CorporateView({ onNavigate }) {
  const { isDark, palette } = useTheme();
  const [formData, setFormData] = useState({ company: "", name: "", email: "", phone: "", employees: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const C = {
    navBg: isDark ? "#0f172a" : "#ffffff",
    pageBg: isDark ? "#0a0f1d" : "#f1f5f9",
    white: isDark ? "#1e293b" : "#ffffff",
    primary: palette.accent,
    heading: isDark ? "#f8fafc" : "#0f172a",
    body: isDark ? "#cbd5e1" : "#334155",
    muted: isDark ? "#94a3b8" : "#64748b",
    faint: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
    shadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
    shadowLg: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 25px -3px rgba(0,0,0,0.08)",
    font: "'Outfit', sans-serif",
    mono: "'JetBrains Mono', monospace",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ company: "", name: "", email: "", phone: "", employees: "", message: "" });
    }, 4000);
  };

  return (
    <>
      <GlobalNavbar activePage="corporate" onNavigate={onNavigate} />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: C.pageBg, padding: '40px 5%', color: C.body, fontFamily: C.font }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          <div style={{
            borderRadius: 24, padding: "56px 40px", marginBottom: 40, position: "relative", overflow: "hidden", textAlign: "center",
            background: `linear-gradient(135deg, ${isDark ? '#0f172a' : '#1e293b'}, ${isDark ? '#020617' : '#0f172a'})`,
            boxShadow: C.shadowLg
          }}>
            <div style={{ position: "absolute", top: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "#6366f1", filter: "blur(150px)", opacity: .1 }} />
            <div style={{ position: "absolute", bottom: -40, right: "20%", width: 200, height: 200, borderRadius: "50%", background: C.primary, filter: "blur(120px)", opacity: .1 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <Badge color="#f59e0b" filled>🏢 Kurumsal Çözümler</Badge>
              <h1 style={{ fontFamily: C.font, fontSize: 44, fontWeight: 900, color: "#f8fafc", marginTop: 24, marginBottom: 16 }}>
                Ekibinizi Geleceğe<br /><span style={{ color: C.primary }}>Hazırlayın</span>
              </h1>
              <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.65 }}>
                Türkiye'nin lider teknoloji şirketleri çalışanlarını EduVerse ile eğitiyor. Özel müfredat, gelişmiş analitik ve 7/24 destek.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} style={{ padding: "16px 36px", borderRadius: 14, border: "none", background: C.primary, color: "#fff", fontFamily: C.font, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 16px ${C.primary}40`, transition: 'transform 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>Demo Talep Et</button>
                <button style={{ padding: "16px 32px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.2)", background: "transparent", color: "#f8fafc", fontFamily: C.font, fontSize: 16, fontWeight: 700, cursor: "pointer", transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Fiyatları Gör ↓</button>
              </div>
            </div>
          </div>

          <div className="fade-in-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20, marginBottom: 48 }}>
            {ENTERPRISE_STATS.map((s, i) => (
              <Card key={i} hover={false} style={{ padding: 32, textAlign: "center" }} C={C}>
                <div style={{ fontFamily: C.mono, fontSize: 36, fontWeight: 900, color: C.primary, marginBottom: 8 }}>{s.v}</div>
                <div style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>{s.l}</div>
              </Card>
            ))}
          </div>

          <div className="fade-in-up" style={{ marginBottom: 60, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: C.faint, marginBottom: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Bize güvenen yüzlerce şirket</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              {ENTERPRISE_LOGOS.map((logo, i) => (
                <div key={i} style={{ padding: "12px 24px", borderRadius: 12, background: C.white, border: `1px solid ${C.border}`, fontSize: 15, fontWeight: 700, color: C.heading, boxShadow: C.shadow }}>{logo}</div>
              ))}
            </div>
          </div>

          <div className="fade-in-up">
            <SectionHead title="Kurumsal Fiyatlandırma" sub="Ekip büyüklüğünüze uygun planı seçin veya bizimle iletişime geçin" C={C} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24, marginBottom: 60 }}>
              {ENTERPRISE_PLANS.map((plan, i) => (
                <Card key={i} hover={false} style={{
                  padding: 0, overflow: "hidden", position: "relative",
                  border: plan.popular ? `2px solid ${plan.color}` : `1px solid ${C.border}`,
                }} C={C}>
                  {plan.popular && (
                    <div style={{ background: plan.color, color: "#fff", textAlign: "center", padding: "8px", fontSize: 13, fontWeight: 800 }}>⭐ En Popüler Seçim</div>
                  )}
                  <div style={{ padding: 32 }}>
                    <h3 style={{ fontFamily: C.font, fontSize: 22, fontWeight: 900, color: C.heading, marginBottom: 12 }}>{plan.name}</h3>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                      <span style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 900, color: plan.color }}>{plan.price}</span>
                      <span style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}>{plan.per}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                      {plan.features.map((f, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: C.body, fontWeight: 500 }}>
                          <span style={{ color: plan.color, fontSize: 16, marginTop: 2, flexShrink: 0, fontWeight: 800 }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button style={{
                      width: "100%", padding: "16px", borderRadius: 14, border: plan.popular ? "none" : `2px solid ${C.border}`,
                      background: plan.popular ? plan.color : C.white,
                      color: plan.popular ? "#fff" : C.heading,
                      fontFamily: C.font, fontSize: 16, fontWeight: 800, cursor: "pointer", transition: 'all 0.2s',
                    }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>{plan.price === "İletişim" ? "İletişime Geç" : "Planı Seç"}</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="fade-in-up">
            <SectionHead title="Kurumsal Avantajlar" sub="Standart platformdan çok daha fazlasını kurumunuza özel sunuyoruz" C={C} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 24, marginBottom: 60 }}>
              {ENTERPRISE_FEATURES.map((feature, i) => (
                <Card key={i} hover={false} style={{ padding: 24 }} C={C}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: `${feature.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 20 }}>{feature.icon}</div>
                  <h4 style={{ fontFamily: C.font, fontSize: 18, fontWeight: 800, color: C.heading, marginBottom: 10 }}>{feature.title}</h4>
                  <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6 }}>{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="fade-in-up">
            <Card hover={false} style={{ padding: 48, background: C.white, textAlign: 'left' }} C={C}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontFamily: C.font, fontSize: 32, fontWeight: 900, color: C.heading, marginBottom: 16 }}>Bize Ulaşın</h2>
                  <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 32 }}>Kurumunuza özel çözümlerimiz hakkında detaylı bilgi almak, demo planlamak veya fiyat teklifi istemek için formu doldurabilirsiniz. Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: C.heading, fontWeight: 600 }}>
                      <span style={{ fontSize: 24 }}>✉️</span> kurumsal@eduverse.com
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: C.heading, fontWeight: 600 }}>
                      <span style={{ fontSize: 24 }}>📞</span> +90 (850) 123 45 67
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: C.heading, fontWeight: 600 }}>
                      <span style={{ fontSize: 24 }}>📍</span> Levent, Şişli / İstanbul
                    </div>
                  </div>
                </div>

                <div>
                  {submitted ? (
                    <div style={{ background: C.primaryDim, padding: 40, borderRadius: 20, border: `2px solid ${C.primaryBorder}`, textAlign: 'center' }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                      <h3 style={{ fontSize: 24, fontWeight: 800, color: C.primary, marginBottom: 8 }}>Talebiniz Alındı</h3>
                      <p style={{ fontSize: 16, color: C.heading }}>Ekibimiz en kısa sürede <strong>{formData.email}</strong> adresi üzerinden sizinle iletişime geçecektir.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Adınız Soyadınız" style={{ flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 15, background: C.pageBg, color: C.heading, outline: 'none' }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}/>
                        <input required value={formData.company} onChange={e=>setFormData({...formData, company: e.target.value})} placeholder="Şirket Adı" style={{ flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 15, background: C.pageBg, color: C.heading, outline: 'none' }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}/>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="İş E-posta Adresiniz" style={{ flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 15, background: C.pageBg, color: C.heading, outline: 'none' }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}/>
                        <select required value={formData.employees} onChange={e=>setFormData({...formData, employees: e.target.value})} style={{ flex: 1, padding: "16px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 15, background: C.pageBg, color: C.muted, outline: 'none' }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}>
                          <option value="" disabled>Çalışan Sayısı</option>
                          <option value="1-50">1 - 50</option>
                          <option value="51-250">51 - 250</option>
                          <option value="251-1000">251 - 1000</option>
                          <option value="1000+">1000+</option>
                        </select>
                      </div>
                      <textarea required value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} placeholder="Nasıl yardımcı olabiliriz?" rows={4} style={{ width: '100%', padding: "16px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 15, background: C.pageBg, color: C.heading, outline: 'none', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}></textarea>
                      <button type="submit" style={{ padding: "16px", borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontFamily: C.font, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 16px ${C.primary}40`, transition: 'transform 0.2s', marginTop: 8 }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>Gönder</button>
                    </form>
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
}
