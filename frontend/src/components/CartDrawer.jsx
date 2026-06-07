import React from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ onNavigate }) {
  const { isCartOpen, closeCart, cartItems, removeFromCart, cartTotal } = useCart();
  const { isDark, palette: p, tokens: t } = useTheme();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    onNavigate('checkout');
  };

  return (
    <>
      <div 
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(4px)', zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400,
        background: p.panel, zIndex: 10000, boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        borderLeft: `1px solid ${p.border}`
      }}>
        <style>{`
          @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: `1px solid ${p.border}` }}>
          <h2 style={{ margin: 0, fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, color: p.text }}>
            <ShoppingBag color={p.accent} /> Sepetim ({cartItems.length})
          </h2>
          <button onClick={closeCart} style={{ background: 'transparent', border: 'none', color: p.textMuted, cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: p.textMuted, marginTop: 40 }}>
              <ShoppingBag size={48} opacity={0.3} style={{ marginBottom: 16 }} />
              <p>Sepetiniz şu an boş.</p>
              <button 
                onClick={() => { closeCart(); onNavigate('courses'); }}
                style={{ marginTop: 20, padding: '10px 20px', borderRadius: 10, border: `1px solid ${p.accent}`, background: 'transparent', color: p.accent, cursor: 'pointer', fontWeight: 600 }}
              >
                Kurslara Göz At
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: 16, background: p.panelElevated, padding: 12, borderRadius: 12, border: `1px solid ${p.border}` }}>
                  <div style={{ width: 60, height: 60, borderRadius: 8, background: `${p.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: p.accent }}>{item.title?.charAt(0) || 'E'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: p.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: p.textMuted, marginBottom: 8 }}>{typeof item.instructor === 'object' ? item.instructor?.name : item.instructor}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>{item.price || item.priceStr || '₺0'}</div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8, alignSelf: 'flex-start' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '24px', borderTop: `1px solid ${p.border}`, background: p.panelElevated }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 18, fontWeight: 700, color: p.text }}>
              <span>Toplam:</span>
              <span style={{ color: p.accent }}>₺{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              style={{ width: '100%', padding: '16px', borderRadius: 14, background: p.accent, color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,212,170,0.3)' }}
            >
              Ödemeye Geç <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
