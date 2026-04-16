import React, { useState, useEffect, useRef } from 'react';
import './PredictPage.css';
import Stars from '../components/stars';
import Navbar from '../components/Navbar';

const PredictPage = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanning, setScanning] = useState(false);
  const [datasetResults, setDatasetResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analysisSectionRef = useRef(null);

  // Mock dataset analysis results
  const mockDatasetResults = {
    correlationMatrix: {
      'pl_eqt': 0.2756,
      'toi': 0.2728,
      'pl_insol': 0.2220,
      'st_rad': 0.1842,
      'st_tmag': 0.1714,
      'st_teff': 0.1469,
      'st_logg': 0.1222,
      'pl_rade': 0.1122,
      'pl_trandurh': 0.0961,
      'pl_orbper': 0.0850
    },
    modelPerformance: {
      'Random Forest': {
        accuracy: 0.8364,
        precision: 0.8446,
        recall: 0.9667,
        f1_score: 0.9015,
        auc_roc: 0.8321
      },
      'XGBoost': {
        accuracy: 0.8355,
        precision: 0.8493,
        recall: 0.9577,
        f1_score: 0.9002,
        auc_roc: 0.8314
      },
      'Decision Tree': {
        accuracy: 0.8066,
        precision: 0.8205,
        recall: 0.9605,
        f1_score: 0.8850,
        auc_roc: 0.7522
      }
    },
    datasetStats: {
      totalSamples: 7620,
      planetPercentage: '77.47%',
      planetCount: 5903,
      nonPlanetCount: 1717,
      featuresUsed: [
        'pl_eqt', 'toi', 'pl_insol', 'st_rad', 'st_tmag', 
        'st_teff', 'st_logg', 'pl_rade', 'pl_trandurh', 'pl_orbper'
      ]
    }
  };

  // Mock ML analysis results
  const mockMLResults = {
    dataset_info: {
      shape: [7620, 15],
      analysis_time: '2.3 seconds'
    },
    models: {
      'Decision Tree': {
        accuracy: 0.8066,
        precision: 0.8205,
        recall: 0.9605,
        f1_score: 0.8850,
        auc_roc: 0.7522,
        mse: 0.12
      },
      'Random Forest': {
        accuracy: 0.8364,
        precision: 0.8446,
        recall: 0.9667,
        f1_score: 0.9015,
        auc_roc: 0.8321,
        mse: 0.08
      },
      'XGBoost': {
        accuracy: 0.8355,
        precision: 0.8493,
        recall: 0.9577,
        f1_score: 0.9002,
        auc_roc: 0.8314,
        mse: 0.06
      }
    },
    feature_importance: {
      'koi_period': 0.25,
      'koi_duration': 0.18,
      'koi_depth': 0.15,
      'koi_prad': 0.12,
      'koi_teq': 0.10,
      'koi_insol': 0.08,
      'koi_model_snr': 0.07,
      'koi_steff': 0.05
    },
    best_model: 'Random Forest'
  };

  // Generate correlation matrix data for the heatmap
  const generateCorrelationMatrix = () => {
    const features = Object.keys(mockDatasetResults.correlationMatrix);
    const matrix = {};
    
    features.forEach(feature1 => {
      matrix[feature1] = {};
      features.forEach(feature2 => {
        if (feature1 === feature2) {
          matrix[feature1][feature2] = 1.0; // Perfect correlation with itself
        } else {
          // Generate realistic correlation values based on the individual correlations
          const val1 = mockDatasetResults.correlationMatrix[feature1];
          const val2 = mockDatasetResults.correlationMatrix[feature2];
          // Calculate a reasonable correlation between two features
          matrix[feature1][feature2] = Math.min(val1, val2) * (0.8 + Math.random() * 0.4);
          matrix[feature1][feature2] = Math.min(1.0, Math.max(-1.0, matrix[feature1][feature2]));
        }
      });
    });
    
    return { features, matrix };
  };

  const correlationData = generateCorrelationMatrix();

  useEffect(() => {
    // Set mock data immediately
    setDatasetResults(mockDatasetResults);
    setLoading(false);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResults(mockMLResults);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setActiveTab('analyze');
    }, 3000);
  };

  const tabs = [
    { id: 'scan', label: 'VISUALIZATION' },
    { id: 'analyze', label: 'ANALYZE DATA' },
    { id: 'model', label: 'MODEL INSIGHTS' }
  ];

  return (
    <div className="predict-page">
      <Stars id="predict-stars" starCount={200} />
      
      {/* Navigation Tabs */}
      <nav className="exovision-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="exovision-main">
        {/* ZOE Tab - Shows Graphs */}
        <Navbar />
        {activeTab === 'scan' && (
          <div className="tab-content active">
            <div className="scan-container">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading dataset analysis...</p>
                </div>
              ) : (
                <>
                  <div className="graphs-container">
                    <h3> Dataset Analysis Visualization</h3>
                    
                    {/* Correlation Matrix Visualization */}
                    <div className="graph-section">
                      <h4>Feature Correlation Heatmap</h4>
                      <div className="correlation-matrix">
                        {datasetResults && Object.entries(datasetResults.correlationMatrix).map(([feature, value]) => (
                          <div key={feature} className="correlation-row">
                            <span className="feature-name">{feature}</span>
                            <div className="correlation-bar-container">
                              <div 
                                className="correlation-bar" 
                                style={{ width: `${Math.abs(value) * 100}%` }}
                                data-value={value.toFixed(4)}
                              ></div>
                            </div>
                            <span className="correlation-value">{value.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Model Performance Comparison */}
                    <div className="graph-section">
                      <h4>Model Performance Metrics</h4>
                      <div className="model-comparison">
                        {datasetResults && Object.entries(datasetResults.modelPerformance).map(([model, metrics]) => (
                          <div key={model} className="model-metrics">
                            <h5>{model}</h5>
                            <div className="metric-bars">
                              <div className="metric">
                                <span>Accuracy</span>
                                <div className="metric-bar">
                                  <div 
                                    className="metric-fill" 
                                    style={{ width: `${metrics.accuracy * 100}%` }}
                                  ></div>
                                </div>
                                <span>{(metrics.accuracy * 100).toFixed(2)}%</span>
                              </div>
                              <div className="metric">
                                <span>Precision</span>
                                <div className="metric-bar">
                                  <div 
                                    className="metric-fill" 
                                    style={{ width: `${metrics.precision * 100}%` }}
                                  ></div>
                                </div>
                                <span>{(metrics.precision * 100).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={`scan-button ${scanning ? 'scanning' : ''}`}
                    onClick={handleScan}
                    disabled={scanning}
                  >
                    {scanning ? 'SCANNING...' : 'INITIATE DEEP ANALYSIS'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Analyze Tab - Shows Enhanced Analysis with File Upload */}
        {activeTab === 'analyze' && (
          <div className="tab-content active" ref={analysisSectionRef}>
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
                <h3>EXOPLANET DATASET ANALYSIS</h3>
                <p className="analysis-subtitle">Machine Learning Model Performance</p>
                
                {/* File Upload Section */}
                <div className="file-upload-section">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file-input"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="file-input-label">
                    {selectedFile ? selectedFile.name : 'CHOOSE CSV FILE'}
                  </label>
                  
                  <button 
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    className={`analyze-button ${isAnalyzing ? 'analyzing' : ''}`}
                  >
                    {isAnalyzing ? 'ANALYZING...' : 'ANALYZE DATASET'}
                  </button>
                </div>

                {/* Analysis Results */}
                {analysisResults && (
                  <div className="ml-analysis-results">
                    <div className="results-header">
                      <h4>📊 DATASET INFORMATION</h4>
                      <span className="analysis-badge">MOCK ANALYSIS</span>
                    </div>
                    <div className="dataset-info">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Dataset Shape:</span>
                          <span className="value">
                            {analysisResults.dataset_info.shape[0]} rows × {analysisResults.dataset_info.shape[1]} columns
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Analysis Time:</span>
                          <span className="value">{analysisResults.dataset_info.analysis_time}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Best Model:</span>
                          <span className="value highlight">{analysisResults.best_model}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Status:</span>
                          <span className="value success">COMPLETED</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Model Performance */}
                    <h4>🤖 ENHANCED MODEL PERFORMANCE</h4>
                    <div className="model-performance-grid">
                      {Object.entries(analysisResults.models).map(([modelName, metrics]) => {
                        const isBest = modelName === analysisResults.best_model;
                        return (
                          <div 
                            key={modelName} 
                            className={`enhanced-model-card ${modelName.toLowerCase().replace(' ', '-')}-card ${isBest ? 'best-model' : ''}`}
                          >
                            {isBest && <div className="best-badge">🏆 BEST MODEL</div>}
                            <h5>{modelName}</h5>
                            
                            <div className="animated-metrics-container">
                              <div className="animated-metric">
                                <div className="animated-metric-header">
                                  <span className="animated-metric-label">Accuracy</span>
                                  <span className="animated-metric-value">{(metrics.accuracy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="animated-bar-container">
                                  <div 
                                    className="animated-bar-fill accuracy-bar animate"
                                    style={{ width: `${metrics.accuracy * 100}%` }}
                                    data-value={`${(metrics.accuracy * 100).toFixed(1)}%`}
                                  ></div>
                                </div>
                              </div>

                              <div className="animated-metric">
                                <div className="animated-metric-header">
                                  <span className="animated-metric-label">Precision</span>
                                  <span className="animated-metric-value">{(metrics.precision * 100).toFixed(1)}%</span>
                                </div>
                                <div className="animated-bar-container">
                                  <div 
                                    className="animated-bar-fill precision-bar animate"
                                    style={{ width: `${metrics.precision * 100}%` }}
                                    data-value={`${(metrics.precision * 100).toFixed(1)}%`}
                                  ></div>
                                </div>
                              </div>

                              <div className="animated-metric">
                                <div className="animated-metric-header">
                                  <span className="animated-metric-label">Recall</span>
                                  <span className="animated-metric-value">{(metrics.recall * 100).toFixed(1)}%</span>
                                </div>
                                <div className="animated-bar-container">
                                  <div 
                                    className="animated-bar-fill recall-bar animate"
                                    style={{ width: `${metrics.recall * 100}%` }}
                                    data-value={`${(metrics.recall * 100).toFixed(1)}%`}
                                  ></div>
                                </div>
                              </div>

                              <div className="animated-metric">
                                <div className="animated-metric-header">
                                  <span className="animated-metric-label">F1-Score</span>
                                  <span className="animated-metric-value">{metrics.f1_score.toFixed(3)}</span>
                                </div>
                                <div className="animated-bar-container">
                                  <div 
                                    className="animated-bar-fill f1-bar animate"
                                    style={{ width: `${metrics.f1_score * 100}%` }}
                                    data-value={metrics.f1_score.toFixed(3)}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Enhanced Performance Chart */}
                    <h4>📈 ANIMATED PERFORMANCE COMPARISON</h4>
                    <div className="performance-chart-enhanced">
                      <div className="chart-bars-enhanced">
                        {Object.entries(analysisResults.models).map(([modelName, metrics]) => {
                          const height = metrics.accuracy * 100;
                          const barClass = `${modelName.toLowerCase().replace(' ', '-')}-bar`;
                          
                          return (
                            <div className="chart-bar-enhanced" key={modelName}>
                              <div className="chart-bar-label">{modelName}</div>
                              <div className="chart-bar-wrapper">
                                <div 
                                  className={`chart-bar-fill ${barClass} animate`}
                                  style={{ height: `${height}%` }}
                                >
                                  <span className="chart-value">{height.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Enhanced Feature Importance */}
                    <h4>🎯 ANIMATED FEATURE IMPORTANCE</h4>
                    <div className="enhanced-feature-importance">
                      <div className="importance-bars">
                        {Object.entries(analysisResults.feature_importance || {})
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 8)
                          .map(([feature, importance]) => (
                            <div className="enhanced-importance-item" key={feature}>
                              <span className="enhanced-feature-name">{feature}</span>
                              <div className="enhanced-importance-bar">
                                <div 
                                  className="enhanced-importance-fill animate"
                                  style={{ width: `${importance * 100}%` }}
                                ></div>
                              </div>
                              <span className="enhanced-importance-value">{(importance * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions when no file selected */}
                {!analysisResults && !isAnalyzing && (
                  <div className="instructions">
                    <h4>📁 HOW TO USE</h4>
                    <ol>
                      <li>Click "CHOOSE CSV FILE" to select your exoplanet dataset</li>
                      <li>Click "ANALYZE DATASET" to run machine learning analysis</li>
                      <li>View model performance metrics and feature importance</li>
                      <li>Compare different algorithms (XGBoost, Random Forest, Decision Tree)</li>
                    </ol>
                    <div className="sample-data">
                      <p><strong>Sample CSV Format:</strong></p>
                      <code>
        koi_period,koi_duration,koi_depth,koi_prad,koi_teq,koi_insol,koi_model_snr,koi_steff,target<br />
        365.25,0.5,0.01,1.0,288,1.0,10,5778,1<br />
        687.45,0.3,0.008,0.53,210,0.43,8,5200,0<br />
        ...
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

                {/* Model Tab - Shows Insights with Correlation Matrix */}
        {activeTab === 'model' && (
          <div className="tab-content active">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading model insights...</p>
              </div>
            ) : (
              <div className="model-insights">
                <h3>MODEL PERFORMANCE INSIGHTS</h3>
                <p className="insights-subtitle">Conservative Regularization Strategy</p>
                
                {/* Correlation Matrix Section */}
                <div className="correlation-matrix-section">
                  <h4>🔗 FEATURE CORRELATION MATRIX</h4>
                  <p className="matrix-description">
                    Heatmap showing correlations between different astronomical features. 
                    Darker colors indicate stronger correlations.
                  </p>
                  
                  <div className="correlation-heatmap-container">
                    <div className="heatmap-grid">
                      {/* Column Headers */}
                      <div className="heatmap-corner"></div>
                      {correlationData.features.map(feature => (
                        <div key={feature} className="heatmap-header">
                          {feature}
                        </div>
                      ))}
                      
                      {/* Rows */}
                      {correlationData.features.map((rowFeature, rowIndex) => (
                        <React.Fragment key={rowFeature}>
                          {/* Row Header */}
                          <div className="heatmap-header">
                            {rowFeature}
                          </div>
                          
                          {/* Correlation Cells */}
                          {correlationData.features.map((colFeature, colIndex) => {
                            const correlation = correlationData.matrix[rowFeature][colFeature];
                            const intensity = Math.abs(correlation);
                            const isDiagonal = rowFeature === colFeature;
                            
                            return (
                              <div
                                key={`${rowFeature}-${colFeature}`}
                                className={`heatmap-cell ${isDiagonal ? 'diagonal' : ''}`}
                                style={{
                                  backgroundColor: isDiagonal 
                                    ? 'rgba(67, 97, 238, 0.8)'
                                    : correlation >= 0
                                    ? `rgba(16, 185, 129, ${intensity})`
                                    : `rgba(239, 68, 68, ${intensity})`,
                                  color: intensity > 0.5 ? 'white' : 'rgba(255, 255, 255, 0.9)'
                                }}
                                title={`${rowFeature} vs ${colFeature}: ${correlation.toFixed(3)}`}
                              >
                                {correlation.toFixed(2)}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="heatmap-legend">
                      <div className="legend-title">Correlation Strength</div>
                      <div className="legend-scale">
                        <span>-1.0</span>
                        <div className="gradient-bar">
                          <div className="gradient-fill"></div>
                        </div>
                        <span>+1.0</span>
                      </div>
                      <div className="legend-labels">
                        <span>Negative</span>
                        <span>Positive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side by side section for explainability and configuration */}
                <div className="model-details-grid">
                  {/* Model Explainability Section */}
                  <div className="model-explainability-section">
                    <h4>🤖 WHY RANDOM FOREST PERFORMED BEST</h4>
                    <div className="explainability-content">
                      <div className="explainability-grid">
                        <div className="explainability-card">
                          <h5>🧠 Ensemble Learning Advantage</h5>
                          <p>
                            Random Forest combines multiple decision trees through bagging (bootstrap aggregating), 
                            which reduces overfitting and variance compared to individual trees. This ensemble approach 
                            provides superior generalization on astronomical data patterns.
                          </p>
                        </div>
                        
                        <div className="explainability-card">
                          <h5>📊 Robust Feature Handling</h5>
                          <p>
                            The model automatically handles feature importance and selection through random subspace 
                            method, making it ideal for our 15-dimensional exoplanet dataset with mixed feature types 
                            and correlations.
                          </p>
                        </div>
                        
                        <div className="explainability-card">
                          <h5>🛡️ Overfitting Resistance</h5>
                          <p>
                            Built-in cross-validation through out-of-bag error estimation and feature randomness 
                            prevents memorization of training data, crucial for reliable exoplanet classification 
                            on new telescope observations.
                          </p>
                        </div>
                        
                        <div className="explainability-card">
                          <h5>⚡ Optimal Performance Balance</h5>
                          <p>
                            Achieved the best trade-off between accuracy (83.6%), precision (84.5%), and recall (96.7%) 
                            while maintaining computational efficiency—critical for processing large-scale astronomical 
                            survey data.
                          </p>
                        </div>
                      </div>
                      
                      <div className="technical-mechanisms">
                        <h5>🔧 Key Technical Mechanisms</h5>
                        <div className="mechanisms-list">
                          <div className="mechanism-item">
                            <span className="mechanism-icon">🌳</span>
                            <div className="mechanism-text">
                              <strong>Bootstrap Aggregating:</strong> Creates diversity by training on random subsets of data
                            </div>
                          </div>
                          <div className="mechanism-item">
                            <span className="mechanism-icon">🎯</span>
                            <div className="mechanism-text">
                              <strong>Feature Randomness:</strong> Selects random feature subsets for each split, reducing correlation between trees
                            </div>
                          </div>
                          <div className="mechanism-item">
                            <span className="mechanism-icon">📈</span>
                            <div className="mechanism-text">
                              <strong>Majority Voting:</strong> Final prediction based on consensus across all trees in the forest
                            </div>
                          </div>
                          <div className="mechanism-item">
                            <span className="mechanism-icon">🛡️</span>
                            <div className="mechanism-text">
                              <strong>Out-of-Bag Validation:</strong> Uses unseen data from bootstrap process for internal validation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model Configuration Section */}
                  <div className="training-stats">
                    <h4>⚙️ MODEL CONFIGURATION</h4>
                    <div className="config-grid">
                      <div className="config-item">
                        <span className="config-label">Regularization:</span>
                        <span className="config-value highlight">Strong (Conservative)</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Cross-Validation:</span>
                        <span className="config-value">5-Fold Stratified</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Test Size:</span>
                        <span className="config-value">20% Holdout</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Best Model:</span>
                        <span className="config-value highlight">Random Forest (83.6% Accuracy)</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Tree Count:</span>
                        <span className="config-value">100 Estimators</span>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Max Depth:</span>
                        <span className="config-value">None (Unlimited)</span>
                      </div>
                    </div>

                    <h4>📊 PERFORMANCE SUMMARY</h4>
                    <div className="performance-summary">
                      <div className="summary-item">
                        <span className="summary-label">Overall Accuracy:</span>
                        <span className="summary-value">82.6%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Avg F1-Score:</span>
                        <span className="summary-value">0.90</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Avg Overfitting Gap:</span>
                        <span className="summary-value">1.8%</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Training Time:</span>
                        <span className="summary-value">2.3s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PredictPage;