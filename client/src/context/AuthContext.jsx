import { createContext, useContext, useMemo, useState } from 'react';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || 'null');
    } catch {
      return null;
    }
  });

  const value = useMemo(() => {
    function login(nextToken, nextUser) {
      localStorage.setItem('adminToken', nextToken);
      localStorage.setItem('adminUser', JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
    }

    function logout() {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setToken('');
      setUser(null);
    }

    return { token, user, isAuthenticated: Boolean(token), login, logout };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
