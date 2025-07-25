"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
  project: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string, project: string) => Promise<{ role: string; project: string }>;
  logout: () => void;
}

// Create a Context for authentication
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component to manage and provide auth state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    delete axios.defaults.headers.common['Authorization'];
    console.log('User logged out!');
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // If token is invalid, logout
      logout();
    }
  };

  useEffect(() => {
    // Only access localStorage on the client side
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setIsLoggedIn(true);
      // Fetch user data when token exists
      fetchUserData().catch((error) => {
        console.error('Error fetching user data on initialization:', error);
        logout();
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, [token]);

  const login = async (email: string, password: string, project: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password, project });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      console.log('User logged in!', userData);
      
      return { role: userData.role, project: userData.project };
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
