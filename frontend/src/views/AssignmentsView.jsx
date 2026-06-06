import React, { memo, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import api from '../services/api';

const AssignmentsView = memo(function AssignmentsView() {
  const { palette: p, tokens: t } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    api.getAssignments()
      .then((res) => setAssignments(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSubmit = async (id) => {
    setSubmitting(id);
    try {
      await api.submitAssignment(id, answers[id] || '');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: t.spacing[8], textAlign: 'center', color: p.textMuted }}>
        Ödevleri görmek için giriş yapın.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: t.spacing[6] }}>
      <h1 style={{ margin: `0 0 ${t.spacing[6]}`, color: p.text, fontSize: t.typography.fontSize['3xl'] }}>
        Ödevlerim
      </h1>
      {loading && <p style={{ color: p.textMuted }}>Yükleniyor…</p>}
      {error && <p style={{ color: p.live }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
        {assignments.map((a) => (
          <Card key={a._id} variant="elevated" style={{ background: p.panel, border: `1px solid ${p.border}` }}>
            <div style={{ display: 'flex', gap: t.spacing[2], marginBottom: t.spacing[2] }}>
              <Badge variant="primary" size="sm">{a.courseId?.title || 'Kurs'}</Badge>
              {a.dueDate && (
                <Badge variant="warning" size="sm">
                  Son: {new Date(a.dueDate).toLocaleDateString('tr-TR')}
                </Badge>
              )}
            </div>
            <h3 style={{ margin: `0 0 ${t.spacing[2]}`, color: p.text }}>{a.title}</h3>
            <p style={{ color: p.textMuted, fontSize: t.typography.fontSize.sm }}>{a.description}</p>
            {user?.role === 'student' && (
              <>
                <Input
                  label="Cevabınız"
                  value={answers[a._id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [a._id]: e.target.value })}
                />
                <Button
                  variant="primary"
                  loading={submitting === a._id}
                  onClick={() => handleSubmit(a._id)}
                  style={{ marginTop: t.spacing[3] }}
                >
                  Teslim Et
                </Button>
              </>
            )}
          </Card>
        ))}
        {!loading && !assignments.length && (
          <p style={{ color: p.textMuted }}>Henüz ödev bulunmuyor. `npm run db:seed` çalıştırın.</p>
        )}
      </div>
    </div>
  );
});

export default AssignmentsView;
