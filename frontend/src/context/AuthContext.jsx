/**
 * Authentication Context
 * Manages global authentication state for the entire application
 * Provides user information, token, and auth methods to all components
 */

import { createContext, useContext, useState, useEffect } from "react";

// Create context object for authentication
const AuthContext = createContext(null);

/**
 * AUTH PROVIDER COMPONENT
 * Wraps the application and provides authentication state to all child components
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // User object containing user information
  const [user, setUser] = useState(null);

  // JWT token from localStorage for authentication
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Loading state for initial auth check
  const [loading, setLoading] = useState(true);

  /**
   * EFFECT: Initialize authentication on component mount
   * Restores user data from localStorage if token exists
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      // Restore user data from localStorage
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  /**
   * LOGIN FUNCTION
   * Stores user data and token in state and localStorage
   * Called after successful login/signup
   *
   * @param {Object} userData - User object with name, email, role, etc.
   * @param {string} authToken - JWT authentication token
   */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    // Persist to localStorage for session persistence
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  /**
   * LOGOUT FUNCTION
   * Clears user data and token from state and localStorage
   * Redirects to login page (handled by axios interceptor)
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /**
   * Context value object
   * Contains all auth state and methods available to consuming components
   */
  const value = {
    user, // Current logged-in user
    token, // JWT authentication token
    loading, // Loading state during initialization
    login, // Function to log in user
    logout, // Function to log out user
    isAuthenticated: !!token, // Boolean indicating if user is logged in
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * USEAUTH HOOK
 * Custom hook to access authentication context
 * Must be used inside AuthProvider
 *
 * @returns {Object} Auth context value with user, token, and auth methods
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
