// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a Context for authentication
const AuthContext = createContext(null);

// AuthProvider component to manage and provide auth state
export const AuthProvider = ({ children }) => {
  // In a real application, isLoggedIn state would be managed
  // through actual login/logout processes, likely involving tokens
  // stored in local storage or session cookies.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default: not logged in for demonstration

  const login = () => {
    setIsLoggedIn(true);
    console.log('User logged in!');
    // In a real app: save user token/data
  };

  const logout = () => {
    setIsLoggedIn(false);
    console.log('User logged out!');
    // In a real app: clear user token/data
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};