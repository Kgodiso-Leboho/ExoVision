// services/mlApi.js
const API_BASE = 'http://localhost:5175';

export const analyzeDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing dataset:', error);
    throw error;
  }
};

export const getMLResults = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/ml-results`);
    if (!response.ok) {
      throw new Error('Failed to fetch ML results');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ML results:', error);
    throw error;
  }
};

// Health check to verify backend connection
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};