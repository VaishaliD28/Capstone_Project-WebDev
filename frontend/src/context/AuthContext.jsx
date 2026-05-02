import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // isLoading = true while we're checking localStorage on first load
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if a token exists, verify it and restore the session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token — not logged in, stop loading immediately
      setIsLoading(false);
      return;
    }

    // Verify the token with the backend
    authAPI.me()
      .then(({ user }) => {
        setUser(user);
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await authAPI.signup(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
