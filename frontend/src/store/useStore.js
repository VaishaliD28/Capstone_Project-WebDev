import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  theme: localStorage.getItem('theme') || 'light',
  resumes: [],
  currentResume: null,

  // 🌗 Theme toggle
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    set({ theme: newTheme });
  },

  // 🔐 LOGIN (FIXED)
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);

      set({
        token: res.data.token,
        loading: false,
      });

      await get().fetchUser();
      await get().fetchResumes(); // ✅ FIX ADDED

      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 🆕 SIGNUP (FIXED)
  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/register', { name, email, password });

      localStorage.setItem('token', res.data.token);

      set({
        token: res.data.token,
        loading: false,
      });

      await get().fetchUser();
      await get().fetchResumes(); // ✅ FIX ADDED

      return true;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 🚪 Logout
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      resumes: [],
      currentResume: null,
    });
  },

  // 👤 Fetch user
  fetchUser: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data });
    } catch (error) {
      get().logout();
    }
  },

  // 📄 Fetch resumes (FIXED SAFE)
  fetchResumes: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/resumes');

      set({
        resumes: res.data || [], // ✅ safe fallback
        loading: false,
      });
    } catch (error) {
      console.error("Fetch resumes error:", error);
      set({
        resumes: [], // ✅ avoid undefined
        loading: false,
      });
    }
  },

  // 📄 Single resume
  fetchResume: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/resumes/${id}`);
      set({ currentResume: res.data, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // ➕ Create resume
  createResume: async (data) => {
    try {
      const res = await api.post('/resumes', data);

      set((state) => ({
        resumes: [res.data, ...state.resumes],
      }));

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // ✏️ Update resume
  updateResume: async (id, data) => {
    try {
      const res = await api.put(`/resumes/${id}`, data);

      set({ currentResume: res.data });

      set((state) => ({
        resumes: state.resumes.map((r) =>
          r.id === parseInt(id) ? res.data : r
        ),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 🗑 Delete resume
  deleteResume: async (id) => {
    try {
      await api.delete(`/resumes/${id}`);

      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== parseInt(id)),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // ⚡ Local update (builder)
  updateCurrentResumeLocal: (data) => {
    set((state) => ({
      currentResume: { ...state.currentResume, ...data },
    }));
  },
}));

export default useStore;
