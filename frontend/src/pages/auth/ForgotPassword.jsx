import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword({ email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <p className="auth-subtitle">Enter your email to reset your password</p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-footer">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
