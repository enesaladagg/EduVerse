import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Heart, Clock, Star, ArrowRight, User, PlayCircle, BarChart } from 'lucide-react';

export default function CourseCard({ course, onClick, showBestseller, showNew, imageFallbackColor = '#6366f1' }) {
  const { isDark, palette: p, tokens: t } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Tema dışı, karta özel profesyonel renk paleti (SaaS Style)
  const cardBg = isDark ? '#111827' : '#ffffff';
  const cardBorder = isDark ? '#1f2937' : '#e5e7eb';
  const textMain = isDark ? '#f9fafb' : '#111827';
  const textSub = isDark ? '#9ca3af' : '#6b7280';
  const highlight = isDark ? '#818cf8' : '#4f46e5'; // Indigo tonu
  const tagBg = isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(79, 70, 229, 0.05)';

  const category = course.category || (course.id % 2 === 0 ? "Yazılım" : "Tasarım");
  const level = course.level || (course.id % 3 === 0 ? "İleri" : "Başlangıç");
  const hours = course.hours || Math.floor(Math.random() * 40 + 10);
  const oldPrice = course.price ? (parseFloat(course.price.replace('₺', '')) * 1.5).toFixed(2) : null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: cardBg,
        borderRadius: '20px',
        border: `1px solid ${isHovered ? highlight : cardBorder}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? (isDark ? '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(129,140,248,0.1)' : '0 20px 40px rgba(0,0,0,0.08), 0 0 0 4px rgba(79,70,229,0.05)')
          : (isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.02)'),
        position: 'relative'
      }}
    >
      {/* Üst Görsel (Thumbnail) */}
      <div style={{
        height: '180px',
        width: '100%',
        background: course.imageUrl ? `url(${course.imageUrl}) center/cover` : `linear-gradient(135deg, ${imageFallbackColor}20, ${isDark ? '#1f2937' : '#f3f4f6'})`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {!course.imageUrl && (
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', 
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.4s ease'
          }}>
            <PlayCircle size={32} color={highlight} />
          </div>
        )}
        
        {/* Etiketler (Sol Üst) */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(showBestseller || course.bestseller) && (
            <div style={{ background: '#f59e0b', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' }}>
              Çok Satan
            </div>
          )}
          {(showNew || course.new) && (
            <div style={{ background: highlight, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 10px ${highlight}50` }}>
              Yeni
            </div>
          )}
        </div>

        {/* Favori Butonu (Sağ Üst) */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          style={{
            position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s', transform: isLiked ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <Heart size={16} fill={isLiked ? '#ef4444' : 'transparent'} color={isLiked ? '#ef4444' : '#6b7280'} />
        </button>

        {/* Süre Rozeti (Sağ Alt) */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <Clock size={12} /> {hours} Saat
        </div>
      </div>

      {/* İçerik */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Kategori ve Seviye */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: highlight, background: tagBg, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
            {category}
          </span>
          <span style={{ color: textSub, fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <BarChart size={14} /> {level}
          </span>
        </div>

        {/* Başlık */}
        <h3 style={{ 
          margin: '0 0 12px 0', fontSize: '17px', fontWeight: 800, color: textMain, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.2s'
        }}>
          {course.title}
        </h3>

        {/* Eğitmen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={12} color={highlight} />
          </div>
          <span style={{ fontSize: '13px', color: textSub, fontWeight: 500 }}>
            {course.instructor || 'EduVerse Eğitmeni'}
          </span>
        </div>

        {/* Yıldız ve Değerlendirme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '20px' }}>
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 800, color: textMain, fontSize: '14px' }}>
            {course.rating || '4.8'}
          </span>
          <span style={{ color: textSub, fontSize: '13px', fontWeight: 500 }}>
            ({course.reviewsCount || Math.floor(Math.random() * 5000 + 1000).toLocaleString('tr-TR')})
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Fiyat ve Buton (Alt Kısım) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {oldPrice && course.price && course.price !== 'Ücretsiz' && (
              <span style={{ fontSize: '12px', color: textSub, textDecoration: 'line-through', fontWeight: 500, marginBottom: '-2px' }}>
                ₺{oldPrice}
              </span>
            )}
            <span style={{ fontWeight: 900, fontSize: '20px', color: textMain }}>
              {course.price ? (course.price === 'Ücretsiz' ? 'Ücretsiz' : `${course.price}`) : 'Ücretsiz'}
            </span>
          </div>
          
          <div style={{
            width: 40, height: 40, borderRadius: '12px', background: isHovered ? highlight : (isDark ? '#1f2937' : '#f3f4f6'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
            boxShadow: isHovered ? `0 4px 12px ${highlight}50` : 'none'
          }}>
            <ArrowRight size={20} color={isHovered ? '#fff' : highlight} style={{ transform: isHovered ? 'translateX(2px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
