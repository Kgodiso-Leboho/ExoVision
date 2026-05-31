import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/stars';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsEntering(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Invalid email or password'}`);
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/exovision');
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
            <h1>Welcome Back</h1>
            <p>Sign in to your ExoVision account</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;