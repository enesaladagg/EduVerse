import React, { memo, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import api from '../services/api';

const CATEGORY_LABELS = {
  programming: 'Programlama',
  cybersecurity: 'Siber Güvenlik',
  'data-science': 'Veri Bilimi',
  design: 'Tasarım',
  business: 'İş',
  language: 'Dil',
  general: 'Genel',
};

const LEVEL_LABELS = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
};

const FALLBACK_COURSES = [
  { _id: '1', title: 'React ile Modern Web', category: 'programming', level: 'intermediate' },
  { _id: '2', title: 'Python ile Veri Bilimi', category: 'data-science', level: 'beginner' },
];

const CoursesPage = memo(function CoursesPage({ onNavigate }) {
  const { palette: p, tokens: t } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses({ limit: 12 })
      .then((res) => setCourses(res.data?.length ? res.data : FALLBACK_COURSES))
      .catch(() => setCourses(FALLBACK_COURSES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: t.spacing[6] }}>
      <h1 style={{ margin: `0 0 ${t.spacing[6]}`, color: p.text, fontSize: t.typography.fontSize['3xl'] }}>
        Kurs Kataloğu
      </h1>
      {loading && <p style={{ color: p.textMuted }}>Kurslar yükleniyor…</p>}
      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: t.spacing[5],
        }}
      >
        {courses.map((c) => (
          <Card
            key={c._id}
            variant="elevated"
            hoverable
            interactive
            onClick={() => onNavigate('live')}
            style={{ background: p.panel, border: `1px solid ${p.border}`, cursor: 'pointer' }}
          >
            <div style={{
              height: 120,
              borderRadius: t.borderRadius.lg,
              background: `linear-gradient(135deg, ${p.accent}40, ${p.panelElevated})`,
              marginBottom: t.spacing[4],
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
            }}>
              📚
            </div>
            <Badge variant="primary" size="sm">{CATEGORY_LABELS[c.category] || c.category}</Badge>
            <div style={{ fontWeight: t.typography.fontWeight.bold, color: p.text, marginTop: t.spacing[2] }}>
              {c.title}
            </div>
            <div style={{ fontSize: t.typography.fontSize.sm, color: p.textMuted, marginTop: t.spacing[1] }}>
              {LEVEL_LABELS[c.level] || c.level}
            </div>
            {c.description && (
              <p style={{ fontSize: t.typography.fontSize.sm, color: p.textMuted, marginTop: t.spacing[2] }}>
                {c.description.slice(0, 100)}…
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
});

export default CoursesPage;
