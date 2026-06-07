import React, { useState } from 'react';
import { C, font, mono, COURSE_DETAIL, Stars, Badge, SectionTitle } from '../components/EduVerseShared';
import { Code2, Play, Clock, FileText, Smartphone, Infinity as InfinityIcon, Award, MessageCircle, Download, Users, Star, Library } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailView({ onNavigate }) {
  const d = COURSE_DETAIL;
  const [expandedSection, setExpandedSection] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const hasPurchased = user?.purchasedCourses?.includes('1'); // Mock ID for now

  return (
    <div style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif", background: C.bg, color: C.text, minHeight: '100vh' }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 5%" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: C.textDim, marginBottom: 24 }}>
          <span style={{ cursor: "pointer", color: C.textSec }} onClick={() => onNavigate('home')}>Ana Sayfa</span><span>›</span>
          <span style={{ cursor: "pointer", color: C.textSec }} onClick={() => onNavigate('courses')}>Yazılım</span><span>›</span>
          <span style={{ color: C.accent }}>Python</span>
        </div>

        <div className="course-detail-layout">
          {/* LEFT COLUMN — STICKY PURCHASE CARD */}
          <div style={{ position: "sticky", top: 90 }}>
            {/* Video preview */}
            <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, background: C.card, marginBottom: 0 }}>
              <div style={{ height: 200, background: `linear-gradient(135deg, ${C.bgAlt}, ${C.surface})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
                <span style={{ fontSize: 72 }}><Code2 size={72} color={C.accent} /></span>
                <div style={{ position: "absolute", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.3)" }}>
                  <span style={{ marginLeft: 4, display: "flex" }}><Play size={24} fill="white" color="white" /></span>
                </div>
                <span style={{ position: "absolute", bottom: 12, left: 12, fontSize: 12, background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}><Play size={12} fill="white" /> Tanıtım Videosu • 5:24</span>
              </div>
              <div style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                  <span style={{ fontFamily: mono, fontSize: 36, fontWeight: 800, color: C.accent }}>₺{d.price}</span>
                  <span style={{ fontSize: 18, color: C.textDim, textDecoration: "line-through" }}>₺{d.oldPrice}</span>
                  <Badge color={C.warm}>%{Math.round((1 - d.price / d.oldPrice) * 100)} İndirim</Badge>
                </div>
                <div style={{ fontSize: 13, color: C.warm, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> Bu fiyat 2 gün sonra sona eriyor!</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {hasPurchased ? (
                    <button 
                      onClick={() => onNavigate('home')} // Video player'a veya ders paneline yönlendirebilir
                      style={{ 
                        margin: 0, height: "56px", boxSizing: "border-box", borderRadius: 14, border: "none", 
                        background: '#10b981', color: "white", fontFamily: font, fontSize: 16, fontWeight: 700, 
                        cursor: "pointer", transition: "all 0.3s", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: '0 8px 24px rgba(16,185,129,0.25)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Play fill="white" size={20} /> Eğitime Devam Et
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => { addToCart({...d, id: '1'}); onNavigate('checkout'); }}
                        style={{ 
                          margin: 0, height: "56px", boxSizing: "border-box", borderRadius: 14, border: "none", 
                          background: C.accent, color: "white", fontFamily: font, fontSize: 16, fontWeight: 700, 
                          cursor: "pointer", transition: "all 0.3s", textAlign: "center",
                          boxShadow: '0 8px 24px rgba(0,212,170,0.25)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        Hemen Satın Al
                      </button>
                      <button 
                        onClick={() => addToCart({...d, id: '1'})}
                        style={{ 
                          margin: 0, height: "56px", boxSizing: "border-box", borderRadius: 14, 
                          border: `2px solid ${C.accent}`, background: "transparent", color: C.accent, 
                          fontFamily: font, fontSize: 15, fontWeight: 600, cursor: "pointer", 
                          transition: "all 0.3s", textAlign: "center" 
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `${C.accent}15`}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Sepete Ekle
                      </button>
                    </>
                  )}
                </div>

                <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginBottom: 24 }}>30 gün koşulsuz iade garantisi</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: <Clock size={16} />, text: `${d.hours} saat video içerik` },
                    { icon: <FileText size={16} />, text: `${d.lectures} ders` },
                    { icon: <Smartphone size={16} />, text: "Mobil erişim" },
                    { icon: <InfinityIcon size={16} />, text: "Ömür boyu erişim" },
                    { icon: <Award size={16} />, text: "Tamamlama sertifikası" },
                    { icon: <MessageCircle size={16} />, text: "Soru-cevap desteği" },
                    { icon: <Download size={16} />, text: "İndirilebilir kaynaklar" },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.textSec }}>
                      <span style={{ display: "flex", color: C.textDim }}>{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, padding: "16px", borderRadius: 14, background: C.purpleDim, border: `1px solid rgba(124,108,240,0.2)`, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 4 }}>Kurumsal Eğitim</div>
                  <div style={{ fontSize: 12, color: C.textSec }}>5+ kişilik ekipler için özel fiyatlar</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Hero */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <Badge color={C.gold} bg="#ffd93d">Bestseller</Badge>
                <Badge color={C.green}>Güncel: {d.lastUpdate}</Badge>
              </div>
              <h1 style={{ fontFamily: font, fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, letterSpacing: -0.5 }}>{d.title}</h1>
              <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, marginBottom: 20 }}>{d.subtitle}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", fontSize: 14, color: C.textSec }}>
                <Stars r={d.rating} />
                <span>({d.reviewCount.toLocaleString("tr-TR")} değerlendirme)</span>
                <span><Users size={14} style={{verticalAlign: 'middle', marginRight: 4}} />{d.students.toLocaleString("tr-TR")} öğrenci</span>
              </div>
            </div>

            {/* Instructor mini */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40, padding: 20, borderRadius: 16, background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{d.instructor.avatar}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{d.instructor.name}</div>
                <div style={{ fontSize: 13, color: C.textSec }}>{d.instructor.title}</div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textDim, marginTop: 4, alignItems: 'center' }}>
                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Star size={12} color={C.gold} fill={C.gold} /> {d.instructor.rating}</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Users size={12} /> {d.instructor.students.toLocaleString("tr-TR")}</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Library size={12} /> {d.instructor.courses} kurs</span>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div style={{ marginBottom: 40 }}>
              <SectionTitle>Neler Öğreneceksin?</SectionTitle>
              <div className="what-you-learn-grid" style={{ padding: 28, borderRadius: 18, border: `1px solid ${C.borderActive}`, background: C.accentDim }}>
                {d.whatYouLearn.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.accent, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div style={{ marginBottom: 40 }}>
              <SectionTitle sub={`${d.curriculum.length} bölüm • ${d.lectures} ders • ${d.hours} saat toplam`}>Müfredat</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {d.curriculum.map((section, i) => (
                  <div key={i} style={{ borderRadius: 14, border: `1px solid ${expandedSection === i ? C.borderActive : C.border}`, overflow: "hidden", background: expandedSection === i ? C.surface : C.card, transition: "all 0.3s" }}>
                    <div onClick={() => setExpandedSection(expandedSection === i ? -1 : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ color: expandedSection === i ? C.accent : C.textDim, fontSize: 14, transition: "transform 0.3s", transform: expandedSection === i ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{section.title}</span>
                        {section.free && <Badge color={C.green}>Ücretsiz</Badge>}
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.textDim }}>
                        <span>{section.lectures} ders</span>
                        <span>{section.duration}</span>
                      </div>
                    </div>
                    {expandedSection === i && (
                      <div style={{ padding: "0 20px 16px", animation: "slideDown 0.3s ease" }}>
                        {Array.from({ length: Math.min(section.lectures, 4) }, (_, j) => (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${C.border}`, fontSize: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ color: C.textDim }}>▷</span>
                              <span style={{ color: C.textSec }}>Ders {j + 1}: {section.title} - Bölüm {j + 1}</span>
                            </div>
                            <span style={{ color: C.textDim, fontSize: 12 }}>{Math.floor(Math.random() * 15 + 5)}:{String(Math.floor(Math.random() * 59)).padStart(2, "0")}</span>
                          </div>
                        ))}
                        {section.lectures > 4 && <div style={{ fontSize: 13, color: C.accent, marginTop: 8, cursor: "pointer" }}>+ {section.lectures - 4} ders daha...</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <SectionTitle sub={`${d.reviewCount.toLocaleString("tr-TR")} değerlendirme`}>Öğrenci Yorumları</SectionTitle>
              <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
                <div style={{ textAlign: "center", padding: "24px 32px", borderRadius: 18, background: C.surface }}>
                  <div style={{ fontFamily: font, fontSize: 54, fontWeight: 800, color: C.gold, lineHeight: 1 }}>{d.rating}</div>
                  <Stars r={d.rating} size={16} />
                  <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>Kurs puanı</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                  {[{s:5,p:72},{s:4,p:18},{s:3,p:6},{s:2,p:3},{s:1,p:1}].map(r => (
                    <div key={r.s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, color: C.textSec, width: 12 }}>{r.s}</span>
                      <span style={{ color: C.gold, fontSize: 12 }}>★</span>
                      <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.bgAlt }}>
                        <div style={{ width: `${r.p}%`, height: "100%", borderRadius: 4, background: C.gold }} />
                      </div>
                      <span style={{ fontSize: 12, color: C.textDim, width: 32 }}>{r.p}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {COURSE_DETAIL.reviews.map((rev, i) => (
                  <div key={i} style={{ padding: 24, borderRadius: 16, background: C.surface, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{rev.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{rev.name}</div>
                          <Stars r={rev.rating} size={11} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: C.textDim }}>{rev.date}</span>
                    </div>
                    <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6 }}>{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Old right column removed since it was moved to the left */}
        </div>
      </div>
    </div>
  );
}
