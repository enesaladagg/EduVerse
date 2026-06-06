import React, { memo, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import api from '../services/api';
import { Code, Shield, LineChart, Palette, Briefcase, Globe, BookOpen, Search, Filter, Star, Clock, User, Check, Smartphone, Cloud, ArrowRight, Play } from 'lucide-react';

const CATEGORY_ICONS = {
  programming: Code,
  cybersecurity: Shield,
  'data-science': LineChart,
  design: Palette,
  business: Briefcase,
  language: Globe,
  general: BookOpen,
  Yazılım: Code,
  'Veri Bilimi': LineChart,
  Tasarım: Palette,
  Mobil: Smartphone,
  Bulut: Cloud,
  'Yapay Zeka': LineChart,
};

const DUMMY_COURSES = [
  { _id: '1', title: 'React ile Modern Web Geliştirme', category: 'Yazılım', level: 'Orta', rating: 4.9, students: 12450, hours: 42, instructor: 'Elif Kaya', price: '₺249.99', oldPrice: '₺749.99', image: 'react', tag: 'En Yeni' },
  { _id: '2', title: 'Python ile Veri Bilimi ve Makine Öğrenmesi', category: 'Veri Bilimi', level: 'Başlangıç', rating: 4.8, students: 34521, hours: 56, instructor: 'Dr. Ahmet Yılmaz', price: '₺199.99', oldPrice: '₺599.99', image: 'python', tag: 'Çok Satan' },
  { _id: '3', title: 'Siber Güvenliğe Giriş ve Etik Hacking', category: 'Siber Güvenlik', level: 'Başlangıç', rating: 4.7, students: 8930, hours: 34, instructor: 'Can Özgür', price: 'Ücretsiz', oldPrice: '', image: 'security', tag: 'Popüler' },
  { _id: '4', title: 'Node.js Backend Mastery', category: 'Yazılım', level: 'İleri', rating: 4.9, students: 5670, hours: 48, instructor: 'Burak Korkmaz', price: '₺299.99', oldPrice: '₺899.99', image: 'node', tag: 'Trend' },
  { _id: '5', title: 'UI/UX Tasarım Temelleri', category: 'Tasarım', level: 'Başlangıç', rating: 4.6, students: 15678, hours: 28, instructor: 'Zeynep Arslan', price: '₺149.99', oldPrice: '₺499.99', image: 'design', tag: '' },
  { _id: '6', title: 'AWS Cloud Architect Sertifikası', category: 'Bulut', level: 'İleri', rating: 4.8, students: 12345, hours: 74, instructor: 'Selin Aydın', price: '₺349.99', oldPrice: '₺999.99', image: 'cloud', tag: 'Sertifikalı' },
  { _id: '7', title: 'Flutter ile Mobil Uygulama', category: 'Mobil', level: 'Orta', rating: 4.7, students: 9876, hours: 45, instructor: 'Mehmet Demir', price: '₺219.99', oldPrice: '₺649.99', image: 'mobile', tag: 'Yükselen' },
  { _id: '8', title: 'Derin Öğrenme ve Yapay Zeka', category: 'Yapay Zeka', level: 'İleri', rating: 4.9, students: 18432, hours: 68, instructor: 'Prof. Ali Veli', price: '₺399.99', oldPrice: '₺1299.99', image: 'ai', tag: 'Premium' },
];

const FILTERS = {
  categories: ['Yazılım', 'Veri Bilimi', 'Tasarım', 'Mobil', 'Bulut', 'Siber Güvenlik', 'Yapay Zeka'],
  levels: ['Başlangıç', 'Orta', 'İleri'],
  prices: ['Ücretsiz', 'Ücretli'],
};

const CustomCheckbox = ({ label, checked, onChange, count, p, t }) => (
  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '12px', group: 'hover' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '6px',
        border: `2px solid ${checked ? p.accent : p.border}`,
        background: checked ? p.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s'
      }}>
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: '14px', color: checked ? p.text : p.textMuted, fontWeight: checked ? 600 : 500, transition: 'color 0.2s' }}>{label}</span>
    </div>
    {count !== undefined && <span style={{ fontSize: '12px', color: p.textMuted, background: p.border, padding: '2px 8px', borderRadius: '10px' }}>{count}</span>}
  </label>
);

const CoursesPage = memo(function CoursesPage({ onNavigate }) {
  const { isDark, palette: p, tokens: t } = useTheme();
  const [courses, setCourses] = useState(DUMMY_COURSES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const toggleFilter = (state, setState, val) => {
    setState(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const filteredCourses = courses.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCats.length && !selectedCats.includes(c.category)) return false;
    if (selectedLevels.length && !selectedLevels.includes(c.level)) return false;
    if (selectedPrices.length) {
      const isFree = c.price === 'Ücretsiz';
      if (selectedPrices.includes('Ücretsiz') && selectedPrices.includes('Ücretli')) return true;
      if (selectedPrices.includes('Ücretsiz') && !isFree) return false;
      if (selectedPrices.includes('Ücretli') && isFree) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 4% 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: `0 0 8px`, color: p.text, fontSize: '32px', fontWeight: 800 }}>Kurs Kataloğu</h1>
          <p style={{ color: p.textMuted, fontSize: '15px' }}>İlgi alanına uygun yüzlerce kurs seni bekliyor.</p>
        </div>
        <div style={{ fontSize: '14px', color: p.textMuted, fontWeight: 600 }}>
          <strong style={{ color: p.accent, fontSize: '18px' }}>{filteredCourses.length}</strong> kurs bulundu
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Sidebar Filters */}
        <div style={{ background: p.panel, borderRadius: '24px', padding: '28px', border: `1px solid ${p.border}`, position: 'sticky', top: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: p.text }}>
            <Filter size={20} color={p.accent} />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Filtreler</h3>
            {(selectedCats.length > 0 || selectedLevels.length > 0 || selectedPrices.length > 0) && (
              <button onClick={() => { setSelectedCats([]); setSelectedLevels([]); setSelectedPrices([]); }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: p.textMuted, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Temizle</button>
            )}
          </div>

          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Kurs ara..."
              style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '14px', border: `2px solid ${p.border}`, background: p.background, color: p.text, fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = p.accent}
              onBlur={e => e.target.style.borderColor = p.border}
            />
            <Search size={18} color={p.textMuted} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: p.text, marginBottom: '16px' }}>Kategoriler</h4>
            {FILTERS.categories.map(cat => (
              <CustomCheckbox key={cat} label={cat} checked={selectedCats.includes(cat)} onChange={() => toggleFilter(selectedCats, setSelectedCats, cat)} count={courses.filter(c=>c.category===cat).length} p={p} t={t} />
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: p.text, marginBottom: '16px' }}>Seviye</h4>
            {FILTERS.levels.map(lvl => (
              <CustomCheckbox key={lvl} label={lvl} checked={selectedLevels.includes(lvl)} onChange={() => toggleFilter(selectedLevels, setSelectedLevels, lvl)} count={courses.filter(c=>c.level===lvl).length} p={p} t={t} />
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: p.text, marginBottom: '16px' }}>Ücret</h4>
            {FILTERS.prices.map(pr => (
              <CustomCheckbox key={pr} label={pr} checked={selectedPrices.includes(pr)} onChange={() => toggleFilter(selectedPrices, setSelectedPrices, pr)} p={p} t={t} />
            ))}
          </div>

        </div>

        {/* Main Grid */}
        <div>
          {filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: p.panel, borderRadius: '24px', border: `1px dashed ${p.border}` }}>
              <Search size={48} color={p.textMuted} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '20px', color: p.text, marginBottom: '8px' }}>Sonuç Bulunamadı</h3>
              <p style={{ color: p.textMuted }}>Seçtiğiniz filtrelere uygun kurs bulunmuyor. Lütfen filtreleri değiştirin.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredCourses.map((c) => {
                const Icon = CATEGORY_ICONS[c.category] || BookOpen;
                return (
                  <Card
                    key={c._id}
                    variant="elevated"
                    hoverable
                    interactive
                    onClick={() => onNavigate('course-detail')}
                    className="premium-course-card"
                    style={{ background: p.panel, border: `1px solid ${p.border}`, cursor: 'pointer', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  >
                    <style>
                      {`
                        .premium-course-card .course-bg { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
                        .premium-course-card:hover .course-bg { transform: scale(1.08); }
                        .premium-course-card .play-btn { opacity: 0; transform: scale(0.8); transition: all 0.3s ease; }
                        .premium-course-card:hover .play-btn { opacity: 1; transform: scale(1); }
                        .premium-course-card .card-action-btn { transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
                        .premium-course-card:hover .card-action-btn { background: var(--c-accent) !important; color: #fff !important; transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,212,170,0.3); }
                      `}
                    </style>
                    <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                      {/* Animated Background */}
                      <div className="course-bg" style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(135deg, ${p.accent}20 0%, ${isDark ? '#111827' : '#f1f5f9'} 100%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {/* Decorative background grid/pattern could go here */}
                        <Icon size={80} color={p.accent} style={{ opacity: 0.15, transform: 'rotate(-10deg) scale(1.2)' }} strokeWidth={1} />
                      </div>
                      
                      {/* Foreground Center Icon */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ 
                           width: '64px', height: '64px', borderRadius: '20px', 
                           background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                           backdropFilter: 'blur(8px)', border: `1px solid rgba(255,255,255,0.1)`,
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                         }}>
                           <Icon size={32} color={p.accent} strokeWidth={1.5} />
                         </div>
                      </div>

                      {/* Hover Play Button Overlay */}
                      <div className="play-btn" style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)'
                      }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: p.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                          <Play size={20} fill="#fff" style={{ marginLeft: '4px' }} />
                        </div>
                      </div>

                      {c.tag && (
                        <div style={{ position: 'absolute', top: '16px', left: '16px', background: p.accent, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '6px 12px', borderRadius: '10px', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,212,170,0.2)' }}>
                          {c.tag}
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <Clock size={12} strokeWidth={2.5} /> {c.hours}s
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ background: `${p.accent}15`, color: p.accent, fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px' }}>{c.category}</div>
                        <span style={{ fontSize: '13px', color: p.textMuted, fontWeight: 600 }}>{c.level}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: p.text, marginBottom: '14px', lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', fontSize: '13px', color: p.textMuted, fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${p.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={12} color={p.accent} />
                          </div>
                          {c.instructor}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} color="#f59e0b" fill="#f59e0b" /> <span style={{ color: p.text, fontWeight: 700 }}>{c.rating}</span> <span style={{opacity: 0.6}}>({(c.students/1000).toFixed(1)}k)</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${p.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '22px', fontWeight: 900, color: c.price === 'Ücretsiz' ? p.accent : p.text, letterSpacing: '-0.5px' }}>{c.price}</span>
                          {c.oldPrice && <span style={{ fontSize: '14px', color: p.textMuted, textDecoration: 'line-through', fontWeight: 500 }}>{c.oldPrice}</span>}
                        </div>
                        <button className="card-action-btn" style={{
                          background: `${p.accent}15`, color: p.accent, border: 'none', borderRadius: '12px',
                          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer'
                        }}>
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CoursesPage;
