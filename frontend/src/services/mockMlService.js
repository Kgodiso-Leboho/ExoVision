// Mock ML analysis service that simulates backend processing
export const analyzeDataset = (file) => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const csvText = e.target.result;
          const lines = csvText.split('\n');
          const headers = lines[0].split(',');
          const rowCount = lines.length - 1; // Subtract header
          
          // Generate mock analysis results based on your ML notebook
          const results = generateMockResults(headers, rowCount);
          resolve(results);
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
        
      } catch (error) {
        reject(error);
      }
    }, 2000); // 2 second delay to simulate processing
  });
};

const generateMockResults = (headers, rowCount) => {
  // These are the results from your MLexovision.ipynb
  const models = {
    'Decision Tree': {
      accuracy: 0.875,
      precision: 0.82,
      recall: 0.78,
      f1_score: 0.80,
      auc_roc: 0.85,
      mse: 0.12,
      cross_validation: '0.862 ± 0.024',
      overfitting_gap: 0.023
    },
    'Random Forest': {
      accuracy: 0.918,
      precision: 0.89,
      recall: 0.85,
      f1_score: 0.87,
      auc_roc: 0.92,
      mse: 0.08,
      cross_validation: '0.905 ± 0.018',
      overfitting_gap: 0.015
    },
    'XGBoost': {
      accuracy: 0.942,
      precision: 0.91,
      recall: 0.88,
      f1_score: 0.90,
      auc_roc: 0.95,
      mse: 0.06,
      cross_validation: '0.928 ± 0.015',
      overfitting_gap: 0.012
    }
  };

  // Generate feature importance based on common exoplanet features
  const featureImportance = generateFeatureImportance(headers);

  return {
    dataset_info: {
      shape: [rowCount, headers.length],
      columns: headers,
      size: `${rowCount} rows × ${headers.length} columns`,
      missing_values: Math.floor(rowCount * 0.02), // Simulate 2% missing values
      analysis_time: '2.3 seconds'
    },
    models: models,
    feature_importance: featureImportance,
    best_model: 'XGBoost',
    message: 'Analysis completed successfully using mock ML engine'
  };
};

const generateFeatureImportance = (headers) => {
  // Common exoplanet detection features with realistic importance scores
  const commonFeatures = {
    'koi_period': 0.25,
    'koi_duration': 0.18,
    'koi_depth': 0.15,
    'koi_prad': 0.12,
    'koi_teq': 0.10,
    'koi_insol': 0.08,
    'koi_model_snr': 0.07,
    'koi_steff': 0.05,
    'koi_slogg': 0.04,
    'koi_srad': 0.03,
    'ra': 0.02,
    'dec': 0.01
  };

  // Match features from the uploaded CSV with common features
  const importance = {};
  headers.forEach(header => {
    const cleanHeader = header.trim().toLowerCase();
    if (commonFeatures[cleanHeader]) {
      importance[header] = commonFeatures[cleanHeader];
    } else {
      // Assign random but decreasing importance for other features
      importance[header] = Math.random() * 0.1;
    }
  });

  // Normalize to sum to 1
  const total = Object.values(importance).reduce((sum, val) => sum + val, 0);
  Object.keys(importance).forEach(key => {
    importance[key] = importance[key] / total;
  });

  return importance;
};

export const getMLResults = () => {
  return Promise.resolve({
    training_complete: true,
    best_model: 'XGBoost',
    cross_validation_score: 0.928,
    overfitting_gap: 0.015,
    model_parameters: {
      'XGBoost': {
        n_estimators: 50,
        max_depth: 4,
        learning_rate: 0.1,
        regularization: 'Strong (L1=1.0, L2=1.0)'
      },
      'Random Forest': {
        n_estimators: 50,
        max_depth: 8,
        min_samples_split: 30
      },
      'Decision Tree': {
        max_depth: 4,
        min_samples_split: 50
      }
    }
  });
};