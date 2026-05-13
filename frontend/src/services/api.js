const API_BASE_URL = 'http://localhost:8000';

export const predictExoplanet = async (data) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  
  return response.json();
};

export const getFeatureInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/features`);
  if (!response.ok) {
    throw new Error('Failed to fetch feature info');
  }
  return response.json();
};

export const getModelStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch model stats');
  }
  return response.json();
};

export const getDatasetInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/dataset-info`);
  if (!response.ok) {
    throw new Error('Failed to fetch dataset info');
  }
  return response.json();
};

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-dataset`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
};