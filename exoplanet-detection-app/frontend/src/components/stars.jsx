import React, { useEffect } from 'react';
import './stars.css';

const Stars = ({ id = "stars", starCount = 200 }) => {
  useEffect(() => {
    createStars();
  }, []);

  const createStars = () => { 
    const starsContainer = document.getElementById(id);
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 3;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = 3 + Math.random() * 7;
      const delay = Math.random() * 5;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.animationDelay = `${delay}s`;
      star.style.setProperty('--duration', `${duration}s`);
      
      starsContainer.appendChild(star);
    }
  };

  return <div className="stars" id={id}></div>;
};

export default Stars;