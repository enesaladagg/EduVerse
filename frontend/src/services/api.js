const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || 'İstek başarısız');
  }
  return data;
}

export const api = {
  url: API_URL,

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return parseResponse(res);
  },

  async register(payload) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return parseResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_URL}/users/me`, { headers: authHeaders() });
    return parseResponse(res);
  },

  async getCourses(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/courses${qs ? `?${qs}` : ''}`);
    return parseResponse(res);
  },

  async getAssignments(courseId) {
    const qs = courseId ? `?courseId=${courseId}` : '';
    const res = await fetch(`${API_URL}/assignments${qs}`, { headers: authHeaders() });
    return parseResponse(res);
  },

  async submitAssignment(id, content) {
    const res = await fetch(`${API_URL}/assignments/${id}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content }),
    });
    return parseResponse(res);
  },

  async getLiveSession(roomId) {
    const res = await fetch(`${API_URL}/sessions/room/${roomId}`);
    return parseResponse(res);
  },
};

export default api;
