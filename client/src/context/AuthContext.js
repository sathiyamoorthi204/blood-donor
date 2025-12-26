import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), isAuthenticated: false, user: null });

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common['x-auth-token'] = auth.token;
      setAuth({ ...auth, isAuthenticated: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setAuth({ token, isAuthenticated: true, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setAuth({ token: null, isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};