import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/stars';
import './WelcomePage.css';

const WelcomePage = () => {
  const [isExploring, setIsExploring] = useState(false);
  const [showBang, setShowBang] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showTitle, setShowTitle] = useState(false);
  const navigate = useNavigate();

  const handleExplore = () => {
    setIsExploring(true);

    // Trigger Big Bang explosion
    setTimeout(() => {
      setShowBang(true);
      generateParticles();
    }, 1500);

    // Reveal “ExoVision” after explosion
    setTimeout(() => {
      setShowTitle(true);
    }, 3000);

    // Redirect after cinematic animation
    setTimeout(() => {
      setIsExploring(false);
      navigate('/login');
    }, 5500);
  };

  const generateParticles = () => {
    const particleArray = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#4cc9f0' : '#f72585',
    }));
    setParticles(particleArray);
  };

  return (
    <div className="welcome-app">
      <Stars id="welcome-stars" />
      <div className="welcome-container">
        <header className="welcome-header">
          <p className="welcome-subtitle">
            Discover and Identify Exoplanets Across the Universe
          </p>

          <div className="collision-scene">
            <div className={`planet planet-left ${isExploring ? 'move-right' : ''}`}></div>
            <div className={`planet planet-right ${isExploring ? 'move-left' : ''}`}></div>

            {showBang && <div className="big-bang"></div>}

            {particles.map((p) => (
              <div
                key={p.id}
                className={`particle ${showTitle ? 'form-text' : ''}`}
                style={{
                  background: p.color,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDuration: `${p.duration}s`,
                  transform: `translate(-50%, -50%)`,
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                }}
              ></div>
            ))}

            {showTitle && <div className="formed-text">ExoVision</div>}
          </div>
        </header>

        <p className="welcome-description">
          Embark on an interstellar journey to identify and analyze exoplanets
          beyond our solar system. Our advanced machine learning algorithms and 
          cosmic data help you explore distant worlds and uncover the secrets of the universe.
        </p>

        <button
          className={`cta-button ${isExploring ? 'exploring' : ''}`}
          onClick={handleExplore}
          disabled={isExploring}
        >
          {isExploring ? 'LAUNCHING...' : 'LogIn'}
        </button>

        <footer className="welcome-footer">
          <p>© 2024 ExoVision | Exploring the universe with AI</p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
