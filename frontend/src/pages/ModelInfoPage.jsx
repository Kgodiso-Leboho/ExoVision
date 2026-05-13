import React, { useState, useEffect } from 'react';
import { getModelStats, getFeatureInfo } from '../services/api';
import './ModelInfoPage.css';
import Stars from '../components/stars';
import Navbar from '../components/Navbar';

// --- Static Data for Models with detailed information ---
const MODEL_DATA = {
  xgboost: {
    name: "XGBoost (Extreme Gradient Boosting)",
    type: "Ensemble Gradient Boosting",
    accuracy: "83.55%",
    f1Score: "0.90",
    tagline: "The High-Performance Boosting Algorithm for Classification.",
    introduction: "XGBoost is an optimized distributed gradient boosting library designed to be highly efficient, flexible, and portable. It excels in prediction accuracy by creating a sequence of weak prediction models (decision trees) where each new tree corrects the errors of the previous ones.",
    reasoning: "XGBoost's core strength lies in its **regularization** (which prevents overfitting) and its **parallel processing capability**. This allows it to quickly find a highly optimized solution, consistently leading to top-tier accuracy and F1-scores, especially in competitions like Kaggle. Its greedy function search combined with clever use of both first and second derivatives provides superior performance over standard Gradient Boosting.",
    benefits: [
      "Superior accuracy and performance due to regularization and parallelization",
      "Handles missing data automatically with sparsity-aware splitting",
      "Flexible to customize and provides excellent speed and memory efficiency",
      "Built-in cross-validation and tree pruning to prevent overfitting"
    ],
    limitations: [
      "Can be sensitive to noise/outliers if not carefully tuned",
      "Requires more computational resources and time than simpler algorithms",
      "The model is complex, making it less interpretable than a single Decision Tree"
    ],
    applications: [
      "Fraud Detection (Finance): Identifying suspicious transactions",
      "Search Ranking (Tech): Optimizing the order of search results",
      "Exoplanet Detection (Astronomy): Highly accurate classification of transit signals"
    ]
  },
  randomforest: {
    name: "Random Forest Classifier",
    type: "Ensemble Bagging Algorithm",
    accuracy: "83.64%",
    f1Score: "0.93",
    tagline: "An Ensemble of Decision Trees for Robust Prediction.",
    introduction: "Random Forest is an ensemble learning method that operates by constructing a multitude of decision trees during training. It outputs the class that is the mode of the classes (classification) or mean prediction (regression) of the individual trees.",
    reasoning: "The high accuracy and F1-scores stem from the principle of **'wisdom of the crowds.'** By averaging or voting across many individual, slightly de-correlated trees, Random Forest significantly **reduces variance and overfitting**. The randomness in selecting features (feature bagging) and samples (bootstrap aggregating) ensures diversity among the trees, leading to a highly robust and generalized model.",
    benefits: [
      "High accuracy and very effective on large datasets",
      "Excellent at preventing overfitting due to ensemble averaging",
      "Can handle a large number of features and is relatively robust to outliers",
      "Provides estimates of feature importance for interpretability"
    ],
    limitations: [
      "Slower at prediction time due to maintaining multiple decision trees",
      "Less interpretable than a single Decision Tree (though better than XGBoost)",
      "Can overfit if the dataset is noisy and the individual trees are too deep"
    ],
    applications: [
      "Credit Risk Assessment (Finance): Predicting loan default probability",
      "Image Classification (Vision): Identifying objects in complex scenes",
      "Predictive Maintenance (Industry): Forecasting equipment failures"
    ]
  },
  decisiontrees: {
    name: "Decision Tree Classifier",
    type: "Tree-based Classifier",
    accuracy: "80.88%",
    f1Score: "0.86",
    tagline: "Simple, Interpretable Logic for Classification Tasks.",
    introduction: "A Decision Tree is a non-parametric supervised learning method used for both classification and regression. It uses a tree-like model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility.",
    reasoning: "Decision Trees offer good accuracy when properly pruned. Their appeal isn't just high F1-score but **high interpretability**. They model complex non-linear relationships using a simple, flow-chart-like structure, making the model's prediction process transparent and easy to explain. When used as a base model (like in Random Forests), they are very efficient, though a single tree is prone to high variance.",
    benefits: [
      "Simple to understand, visualize, and interpret",
      "Requires little data preparation (no normalization needed)",
      "Can handle both numerical and categorical data",
      "The cost of using the tree (predicting data) is logarithmic in the number of data points"
    ],
    limitations: [
      "Prone to overfitting (high variance) if the tree grows too deep",
      "Can be unstable, as small variations in the data can result in a completely different tree",
      "Optimal decision tree construction is NP-complete, so practical algorithms use heuristic approaches"
    ],
    applications: [
      "Customer Churn Analysis (Marketing): Identifying factors leading to customer loss",
      "Medical Diagnosis (Healthcare): Creating rule-based systems for illness identification",
      "Telescope Data Filtering (Astronomy): Initial rule-based sorting of signals"
    ]
  }
};

const ModelInfoPage = () => {
  const [selectedModel, setSelectedModel] = useState('xgboost');
  const [modelStats, setModelStats] = useState(null);
  const [featureInfo, setFeatureInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      const [stats, features] = await Promise.all([
        getModelStats(),
        getFeatureInfo()
      ]);
      setModelStats(stats);
      setFeatureInfo(features);
    } catch (error) {
      console.error('Error loading model info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="model-info-page">
        <Stars />
        <div className="loading">Loading model information...</div>
      </div>
    );
  }

  const currentModel = MODEL_DATA[selectedModel];

  return (
    <div className="model-info-page">
      <Stars id='welcome-stars'/>
      
      <div className="model-info-container">
        <Navbar />
        <header className="model-info-header">
          <h1>Machine Learning Algorithms</h1>
          <p>Explore the core models powering exoplanet prediction</p>
        </header>

        {/* Model Selection Tabs */}
        <nav className="model-tabs">
          {Object.keys(MODEL_DATA).map(modelKey => (
            <button
              key={modelKey}
              className={`model-tab ${selectedModel === modelKey ? 'active' : ''}`}
              onClick={() => setSelectedModel(modelKey)}
            >
              {MODEL_DATA[modelKey].name.split(' ')[0]}
            </button>
          ))}
        </nav>

        {/* Model Information */}
        <div className="model-content">
          {/* Model Header with Stats */}
          <div className="model-header">
            <div className="model-title-section">
              <h2>{currentModel.name}</h2>
              <p className="model-tagline">{currentModel.tagline}</p>
            </div>
            <div className="model-stats">
              <div className="model-stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{currentModel.accuracy}</span>
              </div>
              <div className="model-stat">
                <span className="stat-label">F1-Score</span>
                <span className="stat-value">{currentModel.f1Score}</span>
              </div>
              <div className="model-stat">
                <span className="stat-label">Type</span>
                <span className="stat-value">{currentModel.type}</span>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="info-section">
            <h3>Introduction</h3>
            <p>{currentModel.introduction}</p>
          </section>

          {/* Reasoning Section */}
          <section className="info-section">
            <h3>Why We Chose This Model</h3>
            <p dangerouslySetInnerHTML={{ 
              __html: currentModel.reasoning.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }} />
          </section>

          {/* Benefits Section */}
          <section className="info-section">
            <h3>Key Benefits</h3>
            <div className="features-grid">
              {currentModel.benefits.map((benefit, index) => (
                <div key={index} className="feature-card benefit">
                  <div className="feature-icon">✓</div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Limitations Section */}
          <section className="info-section">
            <h3>Limitations</h3>
            <div className="features-grid">
              {currentModel.limitations.map((limitation, index) => (
                <div key={index} className="feature-card limitation">
                  <div className="feature-icon">⚠</div>
                  <span>{limitation}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Applications Section */}
          <section className="info-section">
            <h3>Applications & Use Cases</h3>
            <div className="applications-grid">
              {currentModel.applications.map((application, index) => (
                <div key={index} className="application-card">
                  <div className="app-number">{index + 1}</div>
                  <p>{application}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Optional: Display API-fetched model stats if available */}
        {modelStats && (
          <div className="current-model-stats">
            <h3>Live Model Performance</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Model Type</h4>
                <p>{modelStats.model_type}</p>
              </div>
              <div className="stat-card">
                <h4>Accuracy</h4>
                <p className="accuracy">{(modelStats.accuracy * 100).toFixed(2)}%</p>
              </div>
              <div className="stat-card">
                <h4>Training Samples</h4>
                <p>{modelStats.training_samples?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelInfoPage;