 import React, { createContext, useState, useContext, useEffect } from 'react';
 import axios from 'axios';
 const AuthContext = createContext();
 export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
 throw new Error('useAuth must be used within AuthProvider');
 }
 return context;
 };
 export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [token, setToken] = useState(localStorage.getItem('token'));
 // Set default axios header
 useEffect(() => {
 if (token) {
 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 } else {
 delete axios.defaults.headers.common['Authorization'];
 }
 }, [token]);
 const login = async (email, password) => {
 try {
 const response = await axios.post('http://localhost:3000/api/auth/login', {
 email,
 password
 });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
 };
