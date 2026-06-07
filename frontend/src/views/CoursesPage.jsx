import React, { memo, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import api from '../services/api';
import { Code, Shield, LineChart, Palette, Briefcase, Globe, BookOpen, Search, Filter, Star, Clock, User, Check, Smartphone, Cloud, ArrowRight, Play, Heart } from 'lucide-react';

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

const CATEGORY_COLORS = {
  'Yazılım': { primary: '#3b82f6', secondary: '#8b5cf6' }, // Blue to Purple
  'Veri Bilimi': { primary: '#10b981', secondary: '#059669' }, // Emerald
  'Tasarım': { primary: '#f43f5e', secondary: '#ec4899' }, // Rose to Pink
  'Siber Güvenlik': { primary: '#eab308', secondary: '#f97316' }, // Yellow to Orange
  'Bulut': { primary: '#0ea5e9', secondary: '#3b82f6' }, // Sky Blue
  'Mobil': { primary: '#8b5cf6', secondary: '#d946ef' }, // Purple to Fuchsia
  'Yapay Zeka': { primary: '#6366f1', secondary: '#a855f7' } // Indigo to Purple
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
    <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
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

  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  const toggleFilter = (state, setState, val) => {
    setState(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  let result = courses.filter(c => {
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

  const sorters = {
    popular: (a,b) => b.students - a.students,
    rating: (a,b) => b.rating - a.rating,
    newest: (a,b) => b._id.localeCompare(a._id),
  };
  result.sort(sorters[sortBy] || sorters.popular);
  const filteredCourses = result;

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

          <div style={{ padding: '20px', borderRadius: '16px', background: p.background, border: `1px solid ${p.border}`, marginTop: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: p.textMuted, marginBottom: '12px', textTransform: 'uppercase' }}>Platform İstatistikleri</div>
            {[
              { l: "Toplam Kurs", v: courses.length },
              { l: "Ücretsiz", v: courses.filter(c=>c.price==='Ücretsiz').length },
              { l: "Ort. Puan", v: (courses.reduce((a,c)=>a+c.rating,0)/courses.length).toFixed(1) },
            ].map((s,i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' }}>
                <span style={{ color: p.textMuted }}>{s.l}</span>
                <span style={{ fontWeight: 700, color: p.text }}>{s.v}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Main Grid */}
        <div>
          {/* Top Controls: Active Filters & Sort */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {(selectedCats.length > 0 || selectedLevels.length > 0 || selectedPrices.length > 0) && (
                <span style={{ fontSize: '14px', color: p.textMuted, fontWeight: 600, marginRight: '4px' }}>Aktif Filtreler:</span>
              )}
              {selectedCats.map(cat => (
                <span key={cat} onClick={() => toggleFilter(selectedCats, setSelectedCats, cat)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${p.accent}15`, color: p.accent, padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{cat} ✕</span>
              ))}
              {selectedLevels.map(lvl => (
                <span key={lvl} onClick={() => toggleFilter(selectedLevels, setSelectedLevels, lvl)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${p.accent}15`, color: p.accent, padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{lvl} ✕</span>
              ))}
              {selectedPrices.map(pr => (
                <span key={pr} onClick={() => toggleFilter(selectedPrices, setSelectedPrices, pr)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${p.accent}15`, color: p.accent, padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{pr} ✕</span>
              ))}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: p.textMuted, fontWeight: 600, marginRight: '8px' }}>Sırala:</span>
              {[
                { value: 'popular', label: 'Popüler' },
                { value: 'newest', label: 'En Yeni' },
                { value: 'rating', label: 'En Yüksek Puan' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  style={{
                    background: sortBy === opt.value ? p.accent : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: sortBy === opt.value ? '#fff' : p.textMuted,
                    border: `1px solid ${sortBy === opt.value ? p.accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: sortBy === opt.value ? `0 4px 12px ${p.accent}40` : 'none'
                  }}
                  onMouseEnter={e => {
                    if (sortBy !== opt.value) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                      e.currentTarget.style.color = p.text;
                    }
                  }}
                  onMouseLeave={e => {
                    if (sortBy !== opt.value) {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                      e.currentTarget.style.color = p.textMuted;
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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
                const catColor = CATEGORY_COLORS[c.category] || { primary: p.accent, secondary: '#8b5cf6' };
                
                return (
                  <Card
                    key={c._id}
                    variant="elevated"
                    hoverable
                    interactive
                    onClick={() => onNavigate('course-detail')}
                    className="premium-course-card"
                    style={{ '--card-accent': catColor.primary, background: p.panel, border: `1px solid ${p.border}`, cursor: 'pointer', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                  >
                    <style>
                      {`
                        .premium-course-card .course-bg { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }
                        .premium-course-card:hover .course-bg { transform: scale(1.08); }
                        .premium-course-card .play-btn { opacity: 0; transform: scale(0.8); transition: all 0.3s ease; }
                        .premium-course-card:hover .play-btn { opacity: 1; transform: scale(1); }
                        .premium-course-card .card-action-btn { transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
                        .premium-course-card:hover .card-action-btn { background: var(--card-accent) !important; color: #fff !important; transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                      `}
                    </style>
                    <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                      {/* Premium Animated Background */}
                      <div className="course-bg" style={{
                        position: 'absolute', inset: 0,
                        background: isDark ? '#0f172a' : '#f8fafc',
                        overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', top: '-30%', left: '-10%', width: '120%', height: '120%', background: `radial-gradient(circle at center, ${catColor.primary}35 0%, transparent 70%)`, filter: 'blur(30px)', opacity: 0.9 }} />
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '100%', height: '100%', background: `radial-gradient(circle at center, ${catColor.secondary}30 0%, transparent 60%)`, filter: 'blur(30px)', opacity: 0.7 }} />
                        
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={140} color={catColor.primary} style={{ opacity: isDark ? 0.06 : 0.04, transform: 'rotate(-15deg) scale(1.2)' }} strokeWidth={1} />
                        </div>
                      </div>
                      
                      {/* Foreground Premium 3D Center Icon */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ 
                           width: '72px', height: '72px', borderRadius: '24px', 
                           background: isDark ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)',
                           backdropFilter: 'blur(16px)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)'}`,
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           boxShadow: `0 20px 40px -10px ${catColor.primary}40, inset 0 2px 4px rgba(255,255,255,0.3)`,
                         }}>
                           <Icon size={36} color={catColor.primary} strokeWidth={2.5} style={{ filter: `drop-shadow(0 4px 6px ${catColor.primary}50)` }} />
                         </div>
                      </div>

                      {/* Hover Play Button Overlay */}
                      <div className="play-btn" style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)'
                      }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: catColor.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                          <Play size={20} fill="#fff" style={{ marginLeft: '4px' }} />
                        </div>
                      </div>

                      {c.tag && (
                        <div style={{ position: 'absolute', top: '16px', left: '16px', background: catColor.primary, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '6px 12px', borderRadius: '10px', letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 12px ${catColor.primary}40` }}>
                          {c.tag}
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => toggleWishlist(c._id, e)}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Heart size={16} fill={wishlist.includes(c._id) ? "#ef4444" : "transparent"} color={wishlist.includes(c._id) ? "#ef4444" : "#64748b"} />
                      </button>
                      
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <Clock size={12} strokeWidth={2.5} /> {c.hours}s
                      </div>
                    </div>
                    
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ background: `${catColor.primary}15`, color: catColor.primary, fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>{c.category}</div>
                        <span style={{ fontSize: '13px', color: p.textMuted, fontWeight: 600 }}>{c.level}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: p.text, marginBottom: '14px', lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', fontSize: '13px', color: p.textMuted, fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${catColor.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={12} color={catColor.primary} />
                          </div>
                          {c.instructor}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} color="#f59e0b" fill="#f59e0b" /> <span style={{ color: p.text, fontWeight: 700 }}>{c.rating}</span> <span style={{opacity: 0.6}}>({(c.students/1000).toFixed(1)}k)</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${p.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '22px', fontWeight: 900, color: c.price === 'Ücretsiz' ? catColor.primary : p.text, letterSpacing: '-0.5px' }}>{c.price}</span>
                          {c.oldPrice && <span style={{ fontSize: '14px', color: p.textMuted, textDecoration: 'line-through', fontWeight: 500 }}>{c.oldPrice}</span>}
                        </div>
                        <button className="card-action-btn" style={{
                          background: `${catColor.primary}15`, color: catColor.primary, border: 'none', borderRadius: '12px',
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
