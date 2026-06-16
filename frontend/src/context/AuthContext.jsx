import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!token || !savedUser) {
    setLoading(false);
    return;
  }

  setUser(JSON.parse(savedUser));

  let cancelled = false;

  authAPI.getMe()
    .then((res) => {
      if (cancelled) return;

      setUser(res.data.data.user);
      localStorage.setItem(
        'user',
        JSON.stringify(res.data.data.user)
      );
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user, token } = res.data.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { user, token } = res.data.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}