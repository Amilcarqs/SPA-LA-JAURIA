import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, UserProfile } from '../types/auth';
import api from '../services/api';

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  login: (payload: AuthResponse) => void;
  logout: () => void;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    api
      .get<UserProfile>('/auth/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (payload: AuthResponse) => {
    if (!payload.access_token) {
      return;
    }

    localStorage.setItem('access_token', payload.access_token);
    setToken(payload.access_token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, login, logout, loading, setUser }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
