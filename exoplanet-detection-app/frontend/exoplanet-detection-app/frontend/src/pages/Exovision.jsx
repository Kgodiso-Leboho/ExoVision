import React, { useState, useEffect } from 'react';
import Stars from '../components/stars';
import './ExoVision.css';
import Navbar from '../components/Navbar';

const ExoVision = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanning, setScanning] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    createStars();
  }, []);

  const createStars = () => {
    const starsContainer = document.getElementById('exovision-stars');
    if (!starsContainer) return;
    
    const starCount = 200;
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

  // Function to determine life potential based on planet data
  const determineLifePotential = (planet) => {
    const { name, analysis } = planet;
    
    // Extract values from analysis
    const tempValue = analysis.find(item => item.label === 'Temperature')?.value;
    const planetClass = analysis.find(item => item.label === 'Planet Class')?.value;
    const massValue = analysis.find(item => item.label === 'Mass')?.value;
    
    // Convert temperature string to numeric value
    const temperature = parseInt(tempValue?.replace(/[^0-9]/g, '') || '0');
    
    // Life criteria:
    // - Temperature between 200°K and 350°K (habitable range)
    // - Terrestrial or Rocky planet type
    // - Reasonable mass (not gas giant)
    
    let lifePotential = 'UNLIKELY';
    let lifeDescription = 'Conditions not suitable for life as we know it';
    let lifeConfidence = 'LOW';
    
    // Check for terrestrial/rocky planets
    const isRockyPlanet = planetClass && (
      planetClass.includes('Terrestrial') || 
      planetClass.includes('Rocky') || 
      planetClass.includes('Super-Earth')
    );
    
    // Check temperature habitable range (water can exist as liquid)
    const isHabitableTemp = temperature >= 200 && temperature <= 350;
    
    // Check if it's not a gas giant
    const isNotGasGiant = planetClass && !planetClass.includes('Jupiter');
    
    if (isRockyPlanet && isHabitableTemp && isNotGasGiant) {
      lifePotential = 'POSSIBLE';
      lifeDescription = 'Conditions could support liquid water and potential life';
      lifeConfidence = 'MEDIUM';
      
      // Special case for planets we know more about
      if (name === 'Kepler-186f' || name === 'TRAPPIST-1e') {
        lifePotential = 'HIGHLY LIKELY';
        lifeDescription = 'Prime candidate for habitability with Earth-like conditions';
        lifeConfidence = 'HIGH';
      } else if (name === 'Proxima Centauri b') {
        lifePotential = 'POSSIBLE';
        lifeDescription = 'Moderate radiation levels but within habitable zone';
        lifeConfidence = 'MEDIUM';
      }
    } else if (planetClass && planetClass.includes('Hot Jupiter')) {
      lifePotential = 'EXTREMELY UNLIKELY';
      lifeDescription = 'Extreme temperatures and gas composition preclude known life forms';
      lifeConfidence = 'HIGH';
    } else if (planetClass && planetClass.includes('Ultra-Hot Jupiter')) {
      lifePotential = 'IMPOSSIBLE';
      lifeDescription = 'Surface temperatures would vaporize all known organic compounds';
      lifeConfidence = 'VERY HIGH';
    }
    
    return {
      potential: lifePotential,
      description: lifeDescription,
      confidence: lifeConfidence
    };
  };

  const handlePlanetHover = (planet, event) => {
    setHoveredPlanet(planet);
    
    // Get the position of the hovered planet card
    const cardRect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.explore-container').getBoundingClientRect();
    
    // Position the analysis panel to the right of the hovered card
    setHoverPosition({
      x: cardRect.right - containerRect.left + 20, // 20px gap from card
      y: cardRect.top - containerRect.top
    });
  };

  const handlePlanetLeave = () => {
    setHoveredPlanet(null);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setActiveTab('analyze');
    }, 3000);
  };

  const planets = [
    { 
      id: 1, 
      name: 'Kepler-186f', 
      description: 'Earth-like exoplanet in habitable zone', 
      type: 'planet-1',
      analysis: [
        { label: 'Planet Class', value: 'Terrestrial' },
        { label: 'Temperature', value: '188°K' },
        { label: 'Orbital Period', value: '130 Earth Days' },
        { label: 'Mass', value: '1.4 Earth Masses' },
        { label: 'Distance', value: '582 Light Years' }
      ]
    },
    { 
      id: 2, 
      name: 'TRAPPIST-1e', 
      description: 'Rocky planet with potential for water', 
      type: 'planet-2',
      analysis: [
        { label: 'Planet Class', value: 'Rocky Super-Earth' },
        { label: 'Temperature', value: '251°K' },
        { label: 'Orbital Period', value: '6.1 Earth Days' },
        { label: 'Mass', value: '0.69 Earth Masses' },
        { label: 'Distance', value: '39 Light Years' }
      ]
    },
    { 
      id: 3, 
      name: 'HD 209458 b', 
      description: 'First exoplanet with detected atmosphere', 
      type: 'planet-3',
      analysis: [
        { label: 'Planet Class', value: 'Hot Jupiter' },
        { label: 'Temperature', value: '1,500°K' },
        { label: 'Orbital Period', value: '3.5 Earth Days' },
        { label: 'Mass', value: '0.69 Jupiter Masses' },
        { label: 'Distance', value: '159 Light Years' }
      ]
    },
    { 
      id: 4, 
      name: 'WASP-76b', 
      description: 'Ultra-hot Jupiter with iron rain', 
      type: 'planet-4',
      analysis: [
        { label: 'Planet Class', value: 'Ultra-Hot Jupiter' },
        { label: 'Temperature', value: '2,400°K' },
        { label: 'Orbital Period', value: '1.8 Earth Days' },
        { label: 'Mass', value: '0.92 Jupiter Masses' },
        { label: 'Distance', value: '640 Light Years' }
      ]
    },
    { 
      id: 5, 
      name: 'Proxima Centauri b', 
      description: 'Closest exoplanet to our solar system', 
      type: 'planet-5',
      analysis: [
        { label: 'Planet Class', value: 'Terrestrial' },
        { label: 'Temperature', value: '234°K' },
        { label: 'Orbital Period', value: '11.2 Earth Days' },
        { label: 'Mass', value: '1.27 Earth Masses' },
        { label: 'Distance', value: '4.24 Light Years' }
      ]
    }
  ];

  const analysisResults = [
    { label: 'Planet Class', value: 'Gas Giant' },
    { label: 'Temperature', value: '1,200°K' },
    { label: 'Orbital Period', value: '4.3 Earth Days' },
    { label: 'Mass', value: '0.8 Jupiter Masses' },
    { label: 'Distance', value: '1,200 Light Years' }
  ];

  return (
    <div className="exovision-app">
      {/* Animated stars background */}
      <Stars id="welcome-stars" starCount={200} />

      <div className="exovision-container">

        {/* Main Content */}
        <main className="exovision-main">
          <Navbar />
          {/* Scan Tab */}
          {activeTab === 'scan' && (
            <div className="tab-content active">
              <div className="scan-container">
                <div className="scan-animation">
                  <div className="scanner-beam"></div>
                  <div className="exoplanet-preview">
                    <div className="planet-glow"></div>
                  </div>
                </div>
                <button className="explore-btn" onClick={() => setActiveTab('explore')}>
                  EXPLORE EXOPLANETS
                </button>
              </div>
            </div>
          )}

          {/* Analyze Tab */}
          {activeTab === 'analyze' && (
            <div className="tab-content active">
              <div className="data-visualization">
                <div className="data-stream">
                  {[0, 0.2, 0.4, 0.6, 0.8].map((delay, index) => (
                    <div 
                      key={index}
                      className="data-point" 
                      style={{ animationDelay: `${delay}s` }}
                    ></div>
                  ))}
                </div>
                <div className="analysis-results">
                  <h3>SPECTRAL ANALYSIS COMPLETE</h3>
                  {analysisResults.map((result, index) => (
                    <div key={index} className="result-item">
                      <span className="label">{result.label}:</span>
                      <span className="value">{result.value}</span>
                    </div>
                  ))}
                  <div className="life-assessment">
                    <h4>LIFE ASSESSMENT: UNLIKELY</h4>
                    <p>Gas giant composition and extreme temperatures preclude known biological processes</p>
                  </div>
                </div>
                <button className="explore-btn" onClick={() => setActiveTab('explore')}>
                  EXPLORE EXOPLANETS
                </button>
              </div>
            </div>
          )}

          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <div className="tab-content active">
              <div className="explore-container">
                <div className="planet-grid">
                  {planets.map((planet) => {
                    const lifeAssessment = determineLifePotential(planet);
                    return (
                      <div 
                        key={planet.id} 
                        className={`planet-card life-${lifeAssessment.potential.toLowerCase().replace(' ', '-')}`}
                        onMouseEnter={(e) => handlePlanetHover(planet, e)}
                        onMouseLeave={handlePlanetLeave}
                      >
                        <div className={`planet-icon ${planet.type}`}></div>
                        <h4>{planet.name}</h4>
                        <p>{planet.description}</p>
                        <div className="life-indicator">
                          <span className={`life-badge ${lifeAssessment.confidence.toLowerCase()}`}>
                            {lifeAssessment.potential}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Side Analysis Panel */}
                {hoveredPlanet && (
                  <div 
                    className="analysis-panel"
                    style={{
                      left: `${hoverPosition.x}px`,
                      top: `${hoverPosition.y}px`
                    }}
                  >
                    <div className="analysis-content">
                      <h5>SPECTRAL ANALYSIS: {hoveredPlanet.name}</h5>
                      {hoveredPlanet.analysis.map((result, index) => (
                        <div key={index} className="result-item">
                          <span className="label">{result.label}:</span>
                          <span className="value">{result.value}</span>
                        </div>
                      ))}
                      
                      {/* Life Assessment Section */}
                      <div className="life-assessment">
                        <h6>LIFE POTENTIAL ASSESSMENT</h6>
                        <div className="life-result">
                          <span className="label">Potential:</span>
                          <span className={`value life-${determineLifePotential(hoveredPlanet).potential.toLowerCase().replace(' ', '-')}`}>
                            {determineLifePotential(hoveredPlanet).potential}
                          </span>
                        </div>
                        <div className="life-result">
                          <span className="label">Confidence:</span>
                          <span className="value">{determineLifePotential(hoveredPlanet).confidence}</span>
                        </div>
                        <p className="life-description">
                          {determineLifePotential(hoveredPlanet).description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Model Tab */}
          {activeTab === 'model' && (
            <div className="tab-content active">
              <div className="model-view">
                <div className="solar-system">
                  <div className="star-center"></div>
                  <div className="orbit-ring ring-1">
                    <div className="planet-model model-1"></div>
                  </div>
                  <div className="orbit-ring ring-2">
                    <div className="planet-model model-2"></div>
                  </div>
                  <div className="orbit-ring ring-3">
                    <div className="planet-model model-3"></div>
                  </div>
                </div>
                <div className="model-info">
                  <h3>3D ORBITAL MODEL</h3>
                  <p>Real-time simulation of planetary movements and gravitational interactions based on Kepler's laws of planetary motion</p>
                  <div className="habitability-legend">
                    <h4>Habitability Zones</h4>
                    <div className="legend-item">
                      <span className="color-highly-likely"></span>
                      <span>High Potential for Life</span>
                    </div>
                    <div className="legend-item">
                      <span className="color-possible"></span>
                      <span>Possible Life Conditions</span>
                    </div>
                    <div className="legend-item">
                      <span className="color-unlikely"></span>
                      <span>Unlikely to Support Life</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="exovision-footer">
          <p>EXOVISION SYSTEM • INTERSTELLAR ANALYSIS PLATFORM • LIFE DETECTION MODULE ACTIVE</p>
        </footer>
      </div>
    </div>
  );
};

export default ExoVision;