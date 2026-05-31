import React, { useState } from "react";
import "./PredictPage.css";
import Navbar from "../components/Navbar";
import Stars from "../components/stars";

const PredictPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    ra: 120.5,
    dec: -30.2,
    pl_rade: 1.2,
    pl_orbper: 10.5,
    pl_trandurh: 3.2,
    pl_trandep: 150.0,
    pl_insol: 1.5,
    pl_eqt: 300.0,
    st_tmag: 10.2,
    st_dist: 50.0,
    st_teff: 5778.0,
    st_logg: 4.4,
    st_rad: 1.0,
    in_habitable_zone: 1.0,
    planet_size_category_Earth_sized: true,
    planet_size_category_Jupiter_sized: false,
    planet_size_category_Neptune_sized: false,
    planet_size_category_Super_Earth: false,
    star_temp_category_G_dwarf: true,
    star_temp_category_Hot_star: false,
    star_temp_category_K_dwarf: false,
    star_temp_category_M_dwarf: false,
  });

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/prediction/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Prediction failed'}`);
        return;
      }

      setResult(data);
    } catch (err) {
      setError("❌ Predictor Offline. Check FastAPI connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oracle-page">
      <Stars />
      <Navbar />
      <div className="oracle-container">
        <h1 className="title">AI PREDICTION ORACLE</h1>

        <div className="feature-grid">
          {Object.keys(formData).map((key) => (
            <div key={key} className="input-group">
              <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
              <input
                type={typeof formData[key] === 'boolean' ? "checkbox" : "number"}
                checked={typeof formData[key] === 'boolean' ? formData[key] : undefined}
                value={typeof formData[key] !== 'boolean' ? formData[key] : undefined}
                onChange={(e) => setFormData({
                  ...formData,
                  [key]: e.target.type === 'checkbox' ? e.target.checked : parseFloat(e.target.value)
                })}
              />
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="run-btn" onClick={handlePredict} disabled={loading}>
          {loading ? "INFERRING..." : "RUN QUANTUM INFERENCE"}
        </button>

        {result && (
          <div className={`result-card ${result.consensus === 'Planet' ? 'is-planet' : 'is-fp'}`}>
            <div className="result-header">
              <span className="result-label">CONSENSUS RESULT</span>
              <h2>{result.consensus === 'Planet' ? 'Exoplanet detected' : 'Not a planet'}</h2>
            </div>

            <p className="breakdown-label">MODEL BREAKDOWN</p>

            <div className="model-results">
              {result.predictions.map((p) => (
                <div key={p.model_name} className="model-result">
                  <span className="model-name">{p.model_name}</span>
                  <span className={`model-label ${p.prediction === 1 ? 'positive' : 'negative'}`}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="vote-summary">
              <span>Majority vote</span>
              <span className={result.consensus === 'Planet' ? 'vote-positive' : 'vote-negative'}>
                {result.predictions.filter(p => p.prediction === 1).length} / {result.predictions.length} models confirmed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictPage;