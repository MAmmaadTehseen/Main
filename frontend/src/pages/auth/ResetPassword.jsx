import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword({
        token,
        newPassword: formData.password,
      });
      setMessage(response.data.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="30" stroke="#1ABC9C" strokeWidth="3" fill="none"/>
              <path d="M50 15 L50 5" stroke="#1ABC9C" strokeWidth="3"/>
              <path d="M50 95 L50 85" stroke="#1ABC9C" strokeWidth="3"/>
              <path d="M15 50 L5 50" stroke="#1ABC9C" strokeWidth="3"/>
              <path d="M95 50 L85 50" stroke="#1ABC9C" strokeWidth="3"/>
              <path d="M50 20 L60 35 L50 30 L40 35 Z" fill="#1ABC9C"/>
              <path d="M35 45 L65 45 L65 55 L60 50 L55 55 L50 50 L45 55 L40 50 L35 55 Z" fill="#1B4965"/>
            </svg>
          </div>
          <h1 className="auth-title">FYP COMPASS</h1>
          <div className="auth-error">Invalid or expired reset link</div>
          <p className="auth-footer">
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" stroke="#1ABC9C" strokeWidth="3" fill="none"/>
            <path d="M50 15 L50 5" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M50 95 L50 85" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M15 50 L5 50" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M95 50 L85 50" stroke="#1ABC9C" strokeWidth="3"/>
            <path d="M50 20 L60 35 L50 30 L40 35 Z" fill="#1ABC9C"/>
            <path d="M35 45 L65 45 L65 55 L60 50 L55 55 L50 50 L45 55 L40 50 L35 55 Z" fill="#1B4965"/>
          </svg>
        </div>
        <h1 className="auth-title">FYP COMPASS</h1>
        <p className="auth-subtitle">Create your new password</p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
