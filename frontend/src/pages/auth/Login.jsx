/**
 * Login Page Component
 * Allows users to authenticate with email and password
 * Shows error messages and redirects to dashboard on successful login
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "./Auth.css";

/**
 * LOGIN COMPONENT
 * Presents login form and handles user authentication
 * Stores token and user data in context and localStorage on success
 */
const Login = () => {
  // Form data state - email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Toggle for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Error message to display to user
  const [error, setError] = useState("");

  // Loading state during API request
  const [loading, setLoading] = useState(false);

  // Get auth context methods
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle form input changes
   * Updates formData and clears error message
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  /**
   * Handle form submission
   * Sends login request to backend with email and password
   * On success: saves token/user and redirects to dashboard
   * On error: displays error message
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login request to backend
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // Save auth data to context and localStorage
      login(user, token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Display error from backend or generic message
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/logoauth.png" alt="FYP Compass Logo" />
        </div>
        <p className="auth-subtitle">
          Enter your credentials to access your account
        </p>

        {/* Error message display */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>
              {/* Link to forgot password page */}
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Button to toggle password visibility */}
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to signup page for new users */}
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
