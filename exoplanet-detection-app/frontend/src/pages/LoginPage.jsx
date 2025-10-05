import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/stars';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  // 🧠 Add missing state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock user database
  const users = [
    { email: 'astro@sansa.com', password: 'galaxy123' },
    { email: 'pluto@sansa.com', password: 'planet456' }
  ];

  useEffect(() => {
    setIsEntering(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Check credentials
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      console.log('✅ Login successful!');
      setError('');

      // Optional: save user session in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to ExoVision page
      navigate('/exovision');
    } else {
      setError('❌ Invalid email or password');
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

            {/* ✅ Only onSubmit handles the click */}
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
