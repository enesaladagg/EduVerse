const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Canlı ders için demo JWT alır ve localStorage'a yazar.
 * Her viewRole değişiminde yeni oturum açılabilir.
 */
export async function ensureDemoSession({ name, role = 'student' }) {
  const res = await fetch(`${API_URL}/auth/demo-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role: role === 'teacher' ? 'teacher' : 'student' }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(data.message || 'Demo oturumu başlatılamadı');
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.data));
  return data;
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}
