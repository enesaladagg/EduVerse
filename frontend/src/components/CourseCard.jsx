import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Badge from './Badge';

export default function CourseCard({ 
  course, 
  onClick, 
  showBestseller = false, 
  showNew = false,
  imageFallbackColor = '#3b82f6'
}) {
  const { palette: p, tokens: t } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: p.panel,
        borderRadius: t.borderRadius.lg,
        border: `1px solid ${p.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? t.shadows.xl : t.shadows.md,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '160px',
        width: '100%',
        background: course.imageUrl ? `url(${course.imageUrl}) center/cover` : `linear-gradient(135deg, ${imageFallbackColor}40, ${p.panelElevated})`,
        borderBottom: `1px solid ${p.border}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {!course.imageUrl && <span style={{ fontSize: '3rem', opacity: 0.5 }}>{course.icon || '📚'}</span>}
        
        {/* Overlay on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.1)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s',
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: t.spacing[4], display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title */}
        <h3 style={{ 
          margin: `0 0 ${t.spacing[2]} 0`, 
          fontSize: t.typography.fontSize.lg, 
          fontWeight: t.typography.fontWeight.bold, 
          color: p.text,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.title}
        </h3>

        {/* Instructor */}
        <p style={{ margin: `0 0 ${t.spacing[2]} 0`, fontSize: t.typography.fontSize.sm, color: p.textMuted }}>
          {course.instructor || 'EduVerse Eğitmeni'}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[1], marginBottom: t.spacing[2] }}>
          <span style={{ fontWeight: 'bold', color: '#eab308', fontSize: t.typography.fontSize.sm }}>
            {course.rating || '4.8'}
          </span>
          <span style={{ color: '#eab308', fontSize: t.typography.fontSize.sm }}>
            {'★'.repeat(Math.floor(course.rating || 4))}{'☆'.repeat(5 - Math.floor(course.rating || 4))}
          </span>
          <span style={{ color: p.textMuted, fontSize: t.typography.fontSize.xs }}>
            ({course.reviewsCount ?? 128})
          </span>
        </div>

        {/* Details & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2], flexWrap: 'wrap', marginTop: 'auto', paddingTop: t.spacing[2] }}>
          {showBestseller && <Badge style={{ background: '#fef08a', color: '#854d0e', border: 'none', borderRadius: 99 }}>En Çok Satan</Badge>}
          {showNew && <Badge style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 99 }}>Yeni</Badge>}
          
          <span style={{ 
            marginLeft: 'auto', 
            fontWeight: t.typography.fontWeight.bold, 
            fontSize: t.typography.fontSize.lg, 
            color: p.text 
          }}>
            {course.price ? `${course.price} ₺` : 'Ücretsiz'}
          </span>
        </div>
      </div>
    </div>
  );
}
