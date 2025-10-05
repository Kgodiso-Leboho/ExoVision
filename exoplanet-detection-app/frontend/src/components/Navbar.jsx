import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>ExoVision</h2>
      </div>
      <div className="nav-links">
        <Link 
          to="/exovision" 
          className={location.pathname === '/exovision' ? 'nav-link active' : 'nav-link'}
        >
          Explore
        </Link>
        <Link 
          to="/dataset" 
          className={location.pathname === '/dataset' ? 'nav-link active' : 'nav-link'}
        >
          Dataset
        </Link>
        <Link 
          to="/predict" 
          className={location.pathname === '/predict' ? 'nav-link active' : 'nav-link'}
        >
          Predict
        </Link>
        <Link 
          to="/model-info" 
          className={location.pathname === '/model-info' ? 'nav-link active' : 'nav-link'}
        >
          Model Info
        </Link>
         <Link 
          to="/welcome" 
          className={location.pathname === '/welcome' ? 'nav-link active' : 'nav-link'}
        >
          Exit
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;