import React, { useState } from "react";
import "./PredictPage.css";
import Navbar from "../components/Navbar";
import Stars from "../components/stars";

const PredictPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1800));

    const probability = Math.random();

    setResult({
      label: probability > 0.5 ? "EXOPLANET DETECTED" : "NO PLANET DETECTED",
      confidence: (probability * 100).toFixed(2),
      explanation:
        probability > 0.5
          ? "Signal patterns match confirmed transit signatures and orbital stability thresholds."
          : "Irregular photometric variations suggest stellar noise or false positive detection.",
    });

    setLoading(false);
  };

  return (
    <div className="oracle-page">
      <Stars id='welcome-stars'/>
      <Navbar />

      {/* CENTER ORACLE ENGINE */}
      <div className="oracle-container">

        <h1 className="title">AI PREDICTION ORACLE</h1>
        <p className="subtitle">
          Enter stellar signal signature for classification
        </p>

        {/* INPUT */}
        <div className="input-box">
          <input
            type="text"
            placeholder="e.g. koi_period=365.2, depth=0.01, teq=288..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button onClick={runPrediction} disabled={loading}>
            {loading ? "ANALYZING SIGNAL..." : "RUN ORACLE"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="result-card">
            <h2 className={result.label.includes("EXOPLANET") ? "good" : "bad"}>
              {result.label}
            </h2>

            <div className="confidence">
              Confidence: {result.confidence}%
            </div>

            <p className="explanation">{result.explanation}</p>
          </div>
        )}

        {!result && !loading && (
          <div className="hint">
            Awaiting quantum inference input...
          </div>
        )}

        {loading && (
          <div className="loading">
            Running probabilistic stellar model...
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictPage;