import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, BrainCircuit, Database, ShieldCheck, TrendingUp, LineChart, Trophy, Star, Users, PlayCircle, Briefcase } from 'lucide-react';
import './HeroVisual.css';

const COURSES = [
  {
    id: 'design',
    title: 'UI/UX Tasarım Masterclass',
    instructor: 'Zeynep Arslan',
    category: 'Tasarım',
    icon: <Palette size={28} color="#ff6b6b" />,
    color: '#ff6b6b',
    students: '15.4K',
    rating: '4.9',
    badge: 'En Popüler'
  },
  {
    id: 'code',
    title: 'Python ile Sıfırdan Uzmanlığa',
    instructor: 'Dr. Ahmet Yılmaz',
    category: 'Yazılım',
    icon: <Code size={28} color="#00D4AA" />,
    color: '#00D4AA',
    students: '24.2K',
    rating: '4.8',
    badge: 'Çok Satan'
  },
  {
    id: 'marketing',
    title: 'Dijital Pazarlama ve Büyüme',
    instructor: 'Can Özgür',
    category: 'Pazarlama',
    icon: <TrendingUp size={28} color="#ffd93d" />,
    color: '#ffd93d',
    students: '8.9K',
    rating: '4.7',
    badge: 'Yeni'
  },
  {
    id: 'business',
    title: 'Girişimcilik ve Finans',
    instructor: 'Elif Kaya',
    category: 'İş Dünyası',
    icon: <Briefcase size={28} color="#6c5ce7" />,
    color: '#6c5ce7',
    students: '12.1K',
    rating: '4.9',
    badge: 'Trend'
  }
];

export default function HeroVisual() {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      containerRef.current.style.transform = `translate(-42%, -48%) rotate3d(${0.2 + y * 0.1}, ${-1 + x * 0.2}, 0, ${12 + x * 3}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Course Cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % COURSES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-visual-wrapper">
      {/* Orbiting Ring with Tech Icons */}
      <div className="orbit-ring">
        <div className="orbit-icon"><Code color="#00D4AA" size={24} /></div>
        <div className="orbit-icon"><Palette color="#ff6b6b" size={24} /></div>
        <div className="orbit-icon"><BrainCircuit color="#a29bfe" size={24} /></div>
        <div className="orbit-icon"><Database color="#74b9ff" size={24} /></div>
        <div className="orbit-icon"><ShieldCheck color="#fd79a8" size={24} /></div>
        <div className="orbit-icon"><TrendingUp color="#55efc4" size={24} /></div>
      </div>

      {/* Dynamic Course Card */}
      <div className="course-card-mockup" ref={containerRef}>
        <div className="course-card-inner">
          {COURSES.map((course, idx) => (
            <div 
              key={course.id} 
              className={`course-slide ${activeIdx === idx ? 'active' : ''}`}
            >
              {/* Card Header (Image/Icon Area) */}
              <div className="course-card-header" style={{ background: `${course.color}15` }}>
                <div className="course-card-icon" style={{ background: course.color, boxShadow: `0 8px 24px ${course.color}40` }}>
                  {React.cloneElement(course.icon, { color: '#fff' })}
                </div>
                <div className="course-badge" style={{ color: course.color, background: '#fff' }}>
                  {course.badge}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="course-card-body">
                <div className="course-category" style={{ color: course.color }}>{course.category}</div>
                <h3 className="course-title">{course.title}</h3>
                
                <div className="course-meta">
                  <span className="meta-item"><Users size={14} /> {course.students}</span>
                  <span className="meta-item" style={{ color: '#f59e0b' }}><Star size={14} fill="#f59e0b" /> {course.rating}</span>
                </div>
                
                <div className="course-footer">
                  <div className="course-instructor">
                    <div className="instructor-avatar">{course.instructor.charAt(0)}</div>
                    <span>{course.instructor}</span>
                  </div>
                  <button className="play-btn" style={{ background: course.color, boxShadow: `0 4px 12px ${course.color}30` }}>
                    <PlayCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cards */}
      <div className="float-card card-metric">
        <div className="card-icon" style={{ background: 'rgba(0,212,170,0.1)' }}><LineChart color="#00D4AA" size={20} /></div>
        <div className="card-label">Tamamlama oranı</div>
        <div className="card-value">%94 <span className="up">↑ 12%</span></div>
      </div>

      <div className="float-card card-tech">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg className="progress-ring-svg" viewBox="0 0 36 36">
            <circle className="bg" cx="18" cy="18" r="16" />
            <circle className="fg" cx="18" cy="18" r="16" />
          </svg>
          <div>
            <div className="card-label">Proje ilerlemen</div>
            <div className="card-value" style={{ fontSize: '0.95rem' }}>3/4 tamamlandı</div>
          </div>
        </div>
      </div>

      <div className="float-card card-cert">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="card-icon" style={{ background: 'rgba(160,120,255,0.1)' }}><Trophy color="#a29bfe" size={20} /></div>
          <div>
            <div className="card-label">Yeni sertifika</div>
            <div className="card-value" style={{ fontSize: '0.9rem' }}>Full-Stack Dev</div>
          </div>
        </div>
      </div>

      {/* SVG Connectors */}
      <svg className="connector-svg" viewBox="0 0 600 560" fill="none">
        <path d="M 200 280 Q 100 200, 140 120" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <path d="M 260 300 Q 400 350, 480 320" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,212,170,0)" />
            <stop offset="50%" stopColor="rgba(0,212,170,0.6)" />
            <stop offset="100%" stopColor="rgba(0,212,170,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
