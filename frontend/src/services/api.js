const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Helper ───────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: getAuthHeaders(),
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    // Throw an error with the server's message so callers can display it
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (name, email, password) =>
    request('POST', '/api/auth/signup', { name, email, password }),

  login: (email, password) =>
    request('POST', '/api/auth/login', { email, password }),

  me: () => request('GET', '/api/auth/me'),
};

// ─── Resumes ──────────────────────────────────────────────────────────────────
export const resumeAPI = {
  list: () => request('GET', '/api/resumes'),

  get: (id) => request('GET', `/api/resumes/${id}`),

  create: (title, template, data) =>
    request('POST', '/api/resumes', { title, template, data }),

  update: (id, payload) => request('PUT', `/api/resumes/${id}`, payload),

  delete: (id) => request('DELETE', `/api/resumes/${id}`),
};
