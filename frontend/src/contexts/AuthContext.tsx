"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
// --- FIX: Import the ServerLink ---
import ServerLink from '../lib/api/serverURL'; 

interface User {
  id: string;
  email: string;
  role: string;
  project: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ role: string; project: string }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
      // Use the frontend API route instead of direct backend call
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setIsLoggedIn(true);
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

  const login = async (email: string, password: string) => {
    try {
      // Get the selected project from localStorage
      const selectedProjectData = localStorage.getItem('selectedProject');
      const project = selectedProjectData ? JSON.parse(selectedProjectData).id : 'default';
      
      // Use the frontend API route with correct parameters
      const response = await axios.post('/api/auth/login', { 
        email: email, 
        password: password,
        project: project 
      });
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

  const adminLogin = async (username: string, password: string) => {
    try {
      // Use the frontend API route with correct parameters
      const response = await axios.post('/api/auth/login', { 
        email: username, 
        password: password,
        project: 'admin'
      });
      
      const { token, user: userData } = response.data;
      
      if (userData.role !== 'admin') {
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.' 
        };
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      console.log('Admin logged in!', userData);
      
      return { 
        success: true, 
        user: userData 
      };
    } catch (error: any) { // Catch as 'any' to inspect the response
      console.error('Admin login failed', error);
      // Provide more detailed error from the server if available
      const errorMessage = error.response?.data?.error || (error instanceof Error ? error.message : 'Login failed');
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
