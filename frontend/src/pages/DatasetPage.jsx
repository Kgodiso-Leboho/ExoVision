import React, { useState } from "react";
import "./DatasetPage.css";
import Navbar from "../components/Navbar";
import Stars from "../components/stars";

const DatasetPage = () => {
  const [status, setStatus] = useState("READY");
  const [file, setFile] = useState(null);
  const [missionLog, setMissionLog] = useState([]);
  const [results, setResults] = useState(null);

  const addLog = (message) => {
    setMissionLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setResults(null);
    addLog(`DATASET LOADED → ${f.name}`);
  };

  const runDatasetMission = async () => {
    if (!file) {
      addLog("ERROR: NO DATASET DETECTED");
      return;
    }

    setStatus("RUNNING");
    setResults(null);

    addLog("MISSION STARTED: DATASET PIPELINE");
    addLog("STEP 1 → VALIDATING DATA STRUCTURE...");
    addLog("STEP 2 → CHECKING DATA LEAKAGE...");
    addLog("STEP 3 → FEATURE ENGINEERING...");
    addLog("STEP 4 → TRAINING MODELS (RF / XGBOOST / DT)...");
    addLog("STEP 5 → CROSS VALIDATION EXECUTION...");

    await new Promise((r) => setTimeout(r, 2500));

    const mock = {
      datasetName: file.name,
      rows: 7620,
      features: 28,
      classBalance: "77.47% PLANETS",
      bestModel: "Random Forest",
      accuracy: 0.8364,
      precision: 0.8446,
      recall: 0.9667,
      f1: 0.9015,
      leakageCheck: "SAFE",
    };

    setResults(mock);
    setStatus("COMPLETE");

    addLog("MISSION COMPLETE");
    addLog(`BEST MODEL → ${mock.bestModel}`);
    addLog(`ACCURACY → ${(mock.accuracy * 100).toFixed(2)}%`);
  };

  return (
    <div className="mission-control">
      <Stars />
      <Navbar />

      {/* HEADER */}
      <div className="mc-header">
        <h1>DATASET CONTROL CENTER</h1>
        <div className={`status-badge ${status.toLowerCase()}`}>
          STATUS: {status}
        </div>
      </div>

      {/* GRID */}
      <div className="mc-grid">

        {/* LEFT */}
        <div className="panel command-panel">
          <h2>DATA INPUT MODULE</h2>

          <div className="file-box">
            <label>UPLOAD EXOPLANET DATASET</label>
            <input type="file" onChange={handleFile} />
            {file && <p className="file-name">{file.name}</p>}
          </div>

          <button className="mission-btn" onClick={runDatasetMission}>
            RUN DATASET ANALYSIS
          </button>

          <div className="quick-actions">
            <div className="action">VALIDATE CSV</div>
            <div className="action">CHECK LEAKAGE</div>
            <div className="action">FEATURE SELECT</div>
          </div>
        </div>

        {/* CENTER */}
        <div className="panel telemetry-panel">
          <h2>PIPELINE TELEMETRY</h2>

          <div className="telemetry-stream">
            {missionLog.length === 0 ? (
              <p className="idle">Awaiting dataset upload...</p>
            ) : (
              missionLog.map((log, i) => (
                <div key={i} className="log-line">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="panel results-panel">
          <h2>ANALYSIS OUTPUT</h2>

          {!results ? (
            <p className="idle">No dataset processed yet</p>
          ) : (
            <div className="results-grid">
              <div className="metric">
                <span>DATASET</span>
                <b>{results.datasetName}</b>
              </div>

              <div className="metric">
                <span>ROWS</span>
                <b>{results.rows}</b>
              </div>

              <div className="metric">
                <span>FEATURES</span>
                <b>{results.features}</b>
              </div>

              <div className="metric">
                <span>BEST MODEL</span>
                <b>{results.bestModel}</b>
              </div>

              <div className="metric highlight">
                <span>ACCURACY</span>
                <b>{(results.accuracy * 100).toFixed(2)}%</b>
              </div>

              <div className="metric">
                <span>LEAKAGE</span>
                <b>{results.leakageCheck}</b>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mc-footer">
        <div>DATASET CONTROL v2.0</div>
        <div>MODEL: {results?.bestModel || "—"}</div>
        <div>STATUS: {status}</div>
      </div>
    </div>
  );
};

export default DatasetPage;