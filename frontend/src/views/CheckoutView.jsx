import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, CreditCard, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CheckoutView({ onNavigate }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isDark, palette: p, tokens: t } = useTheme();
  const [isSuccess, setIsSuccess] = useState(false);

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: p.bg, color: p.text }}>
        <h2>Sepetiniz boş!</h2>
        <button onClick={() => onNavigate('courses')} style={{ padding: '12px 24px', background: p.accent, color: '#fff', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 16 }}>Kurslara Dön</button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: p.bg, color: p.text, textAlign: 'center' }}>
        <CheckCircle2 size={80} color={p.accent} style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>Ödemeniz Başarılı!</h1>
        <p style={{ color: p.textMuted, fontSize: 16, maxWidth: 400, marginBottom: 32 }}>Satın aldığınız kurslara "Profilim &gt; Öğrenimlerim" sekmesinden ulaşabilirsiniz.</p>
        <button onClick={() => onNavigate('home')} style={{ padding: '14px 32px', background: p.accent, color: '#fff', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Ana Sayfaya Dön</button>
      </div>
    );
  }

  const handlePay = (e) => {
    e.preventDefault();
    clearCart();
    setIsSuccess(true);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${p.border}`,
    background: p.panelElevated, color: p.text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
    marginBottom: 16, transition: 'border-color 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', background: p.bg, color: p.text, fontFamily: t.typography.fontFamily.base }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 4% 80px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: p.textMuted, marginBottom: 32 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('courses')}>Kurslar</span>
          <ChevronRight size={14} />
          <span style={{ color: p.accent, fontWeight: 600 }}>Ödeme</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, letterSpacing: '-0.5px' }}>Güvenli Ödeme</h1>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Checkout Form */}
          <div style={{ flex: '1 1 600px' }}>
            <form onSubmit={handlePay} style={{ background: p.panel, padding: 40, borderRadius: 24, border: `1px solid ${p.border}` }}>
              
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard color={p.accent} /> Kart Bilgileri
              </h3>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 8 }}>Kart Üzerindeki İsim</label>
                <input required placeholder="Örn: Ali Yılmaz" style={inputStyle} onFocus={e => e.target.style.borderColor = p.accent} onBlur={e => e.target.style.borderColor = p.border} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 8 }}>Kart Numarası</label>
                <div style={{ position: 'relative' }}>
                  <input required placeholder="0000 0000 0000 0000" style={inputStyle} onFocus={e => e.target.style.borderColor = p.accent} onBlur={e => e.target.style.borderColor = p.border} />
                  <CreditCard size={20} color={p.textMuted} style={{ position: 'absolute', right: 16, top: 14 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 8 }}>Son Kullanma</label>
                  <input required placeholder="AA/YY" style={inputStyle} onFocus={e => e.target.style.borderColor = p.accent} onBlur={e => e.target.style.borderColor = p.border} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: p.textMuted, marginBottom: 8 }}>CVV</label>
                  <input required placeholder="123" type="password" maxLength={3} style={inputStyle} onFocus={e => e.target.style.borderColor = p.accent} onBlur={e => e.target.style.borderColor = p.border} />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '18px', background: p.accent, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,212,170,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Lock size={18} /> ₺{cartTotal.toFixed(2)} Güvenle Öde
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, fontSize: 13, color: p.textMuted }}>
                <ShieldCheck size={16} color={p.success} />
                <span>256-bit SSL şifreleme ile ödemeniz güvende.</span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ flex: '1 1 350px', background: p.panelElevated, padding: 32, borderRadius: 24, border: `1px solid ${p.border}` }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Sipariş Özeti</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: `${p.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.accent, fontWeight: 700 }}>
                    {item.title?.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: p.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.accent, marginTop: 4 }}>{item.price || item.priceStr || '₺0'}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px dashed ${p.border}`, paddingTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: p.textMuted }}>
                <span>Ara Toplam</span>
                <span>₺{cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 14, color: p.textMuted }}>
                <span>İndirim</span>
                <span style={{ color: p.success }}>- ₺0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: p.text, borderTop: `1px solid ${p.border}`, paddingTop: 20 }}>
                <span>Toplam</span>
                <span>₺{cartTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
