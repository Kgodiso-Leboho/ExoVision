import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/stars';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-app">
      <Stars id="welcome-stars" />

      <div className="welcome-container">

        {/* HERO SECTION */}
        <header className="hero">

          <div className="hero-text">
            <h1 className="hero-title">
              Discover <span>Exoplanets</span> with AI Precision
            </h1>

            <p className="hero-subtitle">
              A modern research platform for detecting, analyzing, and simulating
              planetary systems using machine learning and astrophysical modeling.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate('/predict')}
              >
                Open Dashboard
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <h3>10K+</h3>
                <p>Exoplanets analyzed</p>
              </div>
              <div className="stat">
                <h3>98%</h3>
                <p>Model accuracy</p>
              </div>
              <div className="stat">
                <h3>Real-time</h3>
                <p>Telemetry processing</p>
              </div>
            </div>
          </div>

          {/* ORBIT VISUAL */}
          <div className="orbit-wrapper">

            <div className="star-center" />

            <div className="orbit orbit-1">
              <div className="planet p1" />
            </div>

            <div className="orbit orbit-2">
              <div className="planet p2" />
            </div>

            <div className="orbit orbit-3">
              <div className="planet p3" />
            </div>

          </div>

        </header>

        {/* FEATURE SECTION */}
        <section className="features">

          <div className="feature-card">
            <h3>AI Prediction Engine</h3>
            <p>Random Forest + deep learning models for exoplanet classification.</p>
          </div>

          <div className="feature-card">
            <h3>Spectral Analysis</h3>
            <p>Analyze light curves and detect transit anomalies in real time.</p>
          </div>

          <div className="feature-card">
            <h3>Mission Control UI</h3>
            <p>NASA-inspired telemetry dashboard for research workflows.</p>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="welcome-footer">
          <p>ExoVision • AI Astronomy Research Platform</p>
        </footer>

      </div>
    </div>
  );
};

export default WelcomePage;