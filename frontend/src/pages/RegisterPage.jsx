import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/stars';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsEntering(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('❌ Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Registration failed'}`);
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('❌ Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={`login-app ${isEntering ? 'page-enter' : ''}`}>
      <Stars id="login-stars" />
      <div className="login-container">
        <div className="login-card">
          <button className="back-button" onClick={handleBack}>
            ← Back to Home
          </button>

          <div className="login-header">
            <h1>Create Account</h1>
            <p>Join ExoVision and explore the universe</p>
          </div>

          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <p className="message error">{error}</p>}
            {success && <p className="message success">{success}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              Already have an account?
              <button className="switch-mode-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;