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

  async register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return parseResponse(res);
  },

  async verifyEmail(email, code) {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return parseResponse(res);
  },

  async registerPhone(data) {
    const res = await fetch(`${API_URL}/auth/register-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(res);
  },

  async verifyPhone(phone, code) {
    const res = await fetch(`${API_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    return parseResponse(res);
  },

  async sendPhoneOtp(phone) {
    const res = await fetch(`${API_URL}/auth/send-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return parseResponse(res);
  },

  async loginPhone(phone, code) {
    const res = await fetch(`${API_URL}/auth/login-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    return parseResponse(res);
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return parseResponse(res);
  },

  async resetPassword(token, password) {
    const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return parseResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_URL}/users/me`, { headers: authHeaders() });
    return parseResponse(res);
  },

  async updateMe(data) {
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return parseResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders() });
    return parseResponse(res);
  },

  async getAdminStats() {
    const res = await fetch(`${API_URL}/admin/stats`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async updateUserRole(id, role) {
    const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ role })
    });
    return parseResponse(res);
  },
  async deleteUser(id) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseResponse(res);
  },
  async updateCourseStatus(id, isActive) {
    const res = await fetch(`${API_URL}/admin/courses/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ isActive })
    });
    return parseResponse(res);
  },
  async deleteCourse(id) {
    const res = await fetch(`${API_URL}/admin/courses/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return parseResponse(res);
  },
  async getInstructorApplications() {
    const res = await fetch(`${API_URL}/admin/applications/instructors`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async approveInstructor(id) {
    const res = await fetch(`${API_URL}/admin/applications/instructors/${id}/approve`, {
      method: 'PUT',
      headers: authHeaders()
    });
    return parseResponse(res);
  },
  async rejectInstructor(id) {
    const res = await fetch(`${API_URL}/admin/applications/instructors/${id}/reject`, {
      method: 'PUT',
      headers: authHeaders()
    });
    return parseResponse(res);
  },

  async getInstructorStats() {
    const res = await fetch(`${API_URL}/courses/instructor-stats`, { headers: authHeaders() });
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

  async checkout(items) {
    const res = await fetch(`${API_URL}/payment/checkout`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ items }),
    });
    return parseResponse(res);
  },

  // Planner APIs
  async getPlannerTasks() {
    const res = await fetch(`${API_URL}/planner/tasks`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async addPlannerTask(taskData) {
    const res = await fetch(`${API_URL}/planner/tasks`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(taskData)
    });
    return parseResponse(res);
  },
  async updatePlannerTask(id, taskData) {
    const res = await fetch(`${API_URL}/planner/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(taskData)
    });
    return parseResponse(res);
  },

  // Messaging APIs
  async getConversations() {
    const res = await fetch(`${API_URL}/social/conversations`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async getMessages(conversationId) {
    const res = await fetch(`${API_URL}/social/conversations/${conversationId}/messages`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async sendMessage(conversationId, content) {
    const res = await fetch(`${API_URL}/social/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content })
    });
    return parseResponse(res);
  },

  // CTF / Gamification APIs
  async getCtfChallenges() {
    const res = await fetch(`${API_URL}/ctf/challenges`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async runCtfChallenge(key, payload) {
    const res = await fetch(`${API_URL}/ctf/challenges/${key}/run`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },
  async completeCtfChallenge(key, payload) {
    const res = await fetch(`${API_URL}/ctf/challenges/${key}/complete`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    return parseResponse(res);
  },

  // Certificates APIs
  async getCertificates() {
    const res = await fetch(`${API_URL}/certificates/me`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async verifyCertificate(certId) {
    const res = await fetch(`${API_URL}/certificates/verify/${certId}`);
    return parseResponse(res);
  },

  // Community APIs
  async getCommunityPosts() {
    const res = await fetch(`${API_URL}/community`, { headers: authHeaders() });
    return parseResponse(res);
  },
  async createCommunityPost(data) {
    const res = await fetch(`${API_URL}/community`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return parseResponse(res);
  },
  async likeCommunityPost(postId) {
    const res = await fetch(`${API_URL}/community/${postId}/like`, {
      method: 'POST',
      headers: authHeaders()
    });
    return parseResponse(res);
  },
  async commentCommunityPost(postId, content) {
    const res = await fetch(`${API_URL}/community/${postId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content })
    });
    return parseResponse(res);
  },

  // AI Mentor API
  async sendMessageToAI(messages) {
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ messages })
    });
    return parseResponse(res);
  },
};

export default api;
