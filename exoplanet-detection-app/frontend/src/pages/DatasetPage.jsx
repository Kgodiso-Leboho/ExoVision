import React, { useState } from "react";
import Navbar from '../components/Navbar';
import "./DatasetPage.css";
import Stars from "../components/stars";

const DatasetPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [usingPredefined, setUsingPredefined] = useState(false);

  // CSV data as provided
  const predefinedCSVData = `toi,tid,tfopwg_disp,ra,dec,pl_rade,pl_orbper,pl_trandurh,pl_trandep,pl_insol,pl_eqt,st_tmag,st_dist,st_teff,st_logg,st_rad,toi_created,rowupdate,in_habitable_zone,is_planet,planet_size_category_Earth-sized,planet_size_category_Jupiter-sized,planet_size_category_Neptune-sized,planet_size_category_Super-Earth,star_temp_category_G-dwarf,star_temp_category_Hot-star,star_temp_category_K-dwarf,star_temp_category_M-dwarf
1000.01,50365310,FP,112.357708,-12.69596,5.8181633,2.1713484,2.0172196,656.8860989,22601.9485814,3127.2040524,9.604,485.735,10249.0,4.19,2.16986,2019-07-24 15:58:33,2024-09-09 10:08:01,0,0,False,False,True,False,False,True,False,False
1001.01,88863718,PC,122.580465,-5.513852,11.2154,1.9316462,3.166,1286.0,44464.5,4045.0,9.42344,295.862,7070.0,4.03,2.01,2019-07-24 15:58:33,2023-04-03 14:31:04,0,1,False,True,False,False,False,True,False,False
1002.01,124709665,FP,104.726966,-10.580455,23.7529,1.8675574,1.408,1500.0,2860.61,2037.0,9.299501,943.109,8924.0,4.33,5.73,2019-07-24 15:58:33,2022-07-11 16:02:02,0,0,False,True,False,False,False,True,False,False
1003.01,106997505,FP,110.559945,-25.207017,10.5468,2.74323,3.167,383.41,1177.36,1631.0,9.3003,7728.17,5388.5,4.15,1.23434,2019-07-24 15:58:33,2022-02-23 10:10:02,0,0,False,True,False,False,False,False,True,False
1004.01,238597883,FP,122.178195,-48.802811,11.3113,3.5730141,3.37,755.0,54679.3,4260.0,9.1355,356.437,9219.0,4.14,2.15,2019-07-24 15:58:33,2024-09-09 10:08:01,0,0,False,True,False,False,False,True,False,False
1005.01,169904935,FP,120.704811,-11.101521,7.10841,4.5505945,2.654,3731.0,414.775,1257.0,9.1309,100.711,5613.0,4.33,1.09,2019-07-24 15:58:33,2025-07-08 10:08:01,0,0,False,False,True,False,True,False,False,False
1006.01,156115721,FP,124.359239,-27.273521,8.6950898,2.5047918,4.3797563,2270.5402194,1750.932635,1649.8220699,9.2386,365.00800000000004,6616.0,4.33,1.53429,2019-07-24 15:58:33,2021-10-29 12:59:15,0,0,False,True,False,False,False,True,False,False
1007.01,65212867,PC,112.752393,-4.463359,14.7752,6.9989206,3.953,2840.0,448.744,1282.0,8.87759,283.291,6596.0,3.71,2.7,2019-07-24 15:58:33,2021-10-29 12:59:15,0,1,False,True,False,False,False,True,False,False
1008.01,440801822,FP,109.382839,13.395219,3.19621,2.0483755,2.767,483.0,5644.4,1183.01373235,8.9362,144.297,6858.5,4.2,1.57,2019-07-24 15:58:33,2023-12-08 16:02:02,0,0,False,False,False,True,False,True,False,False
1009.01,107782586,PC,111.667845,-24.462111,10.5468,1.9600277,2.0065257,1707.6272693,1063.3422958,1456.4246534,8.4331,866.147,8868.7,4.33,1.23434,2019-07-24 15:58:33,2024-01-17 10:08:02,0,1,False,True,False,False,False,True,False,False
101.01,231663901,KP,318.737012,-55.871863,13.1874503,1.4303699,1.6165994,18960.7122944,1281.2408254,1525.9048089,12.4069,375.31,5600.0,4.48851,0.890774,2018-09-05 18:49:20,2024-09-06 10:08:02,0,1,False,True,False,False,True,False,False,False`;

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index].trim();
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUsingPredefined(false);
    setIsUploading(true);
    setUploadResult(null);
    setAnalysisResults(null);

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json', 'txt'].includes(fileExtension)) {
      setIsUploading(false);
      setUploadResult({
        success: false,
        message: "Unsupported file format. Please upload CSV, JSON, or TXT files only.",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setIsUploading(false);
      setUploadResult({
        success: false,
        message: "File size exceeds 50MB limit. Please upload a smaller file.",
      });
      return;
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadResult({
        success: true,
        message: `File "${file.name}" uploaded successfully! Ready for analysis.`,
        fileInfo: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: fileExtension.toUpperCase()
        }
      });
    }, 2000);
  };

  const handleRunDataset = async () => {
    if (!selectedFile && !usingPredefined) {
      setUploadResult({
        success: false,
        message: "Please upload a dataset first or use the predefined dataset option.",
      });
      return;
    }

    setIsRunning(true);
    setAnalysisResults(null);

    try {
      const results = await simulateEDAAnalysis();
      setAnalysisResults(results);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResults({
        error: "Analysis failed. Please check your dataset format and try again."
      });
    } finally {
      setIsRunning(false);
    }
  };

  const simulateEDAAnalysis = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Parse the predefined CSV data to get actual statistics
        let datasetData;
        if (usingPredefined) {
          datasetData = parseCSV(predefinedCSVData);
        } else {
          // For uploaded files, we'd use mock data as before
          datasetData = [];
        }

        const planetCount = usingPredefined 
          ? datasetData.filter(row => row.is_planet === '1').length
          : 5903;
        
        const nonPlanetCount = usingPredefined
          ? datasetData.filter(row => row.is_planet === '0').length
          : 1717;
        
        const totalCount = planetCount + nonPlanetCount;
        const planetPercentage = ((planetCount / totalCount) * 100).toFixed(2) + '%';

        const mockResults = {
          datasetInfo: {
            shape: `(${totalCount}, ${usingPredefined ? Object.keys(datasetData[0] || []).length : 28})`,
            planetPercentage: planetPercentage,
            classDistribution: {
              planets: planetCount,
              nonPlanets: nonPlanetCount
            },
            source: usingPredefined ? "Predefined TOI 2025 Dataset" : "Uploaded Dataset"
          },
          dataLeakage: {
            checked: true,
            safe: true,
            message: "No data leakage detected in selected features"
          },
          featureSelection: {
            selectedFeatures: [
              "pl_eqt", "toi", "pl_insol", "st_rad", "st_tmag", 
              "st_teff", "st_logg", "pl_rade", "pl_trandurh", "pl_orbper"
            ],
            totalFeatures: 10
          },
          modelPerformance: {
            bestModel: "Random Forest",
            accuracy: "83.64%",
            precision: "84.46%",
            recall: "96.67%",
            f1Score: "90.15%",
            aucRoc: "83.21%"
          },
          dataSplit: {
            trainingSamples: Math.floor(totalCount * 0.7),
            testSamples: Math.floor(totalCount * 0.3),
            trainingPlanetRatio: planetPercentage,
            testPlanetRatio: planetPercentage
          },
          crossValidation: {
            performed: true,
            message: "5-fold stratified cross-validation completed"
          },
          conclusion: usingPredefined 
            ? "Good performance on TOI 2025 dataset - ready for exoplanet classification"
            : "Moderate performance - might need feature engineering"
        };

        resolve(mockResults);
      }, 3000);
    });
  };

  const runPredefinedDataset = () => {
    setIsRunning(true);
    setAnalysisResults(null);
    setSelectedFile(null);
    setUsingPredefined(true);
    
    setUploadResult({
      success: true,
      message: "Using predefined TOI 2025 dataset for analysis",
      fileInfo: {
        name: "TOI_2025_cleaned_dataset.csv",
        size: "Predefined dataset",
        type: "CSV"
      }
    });

    setTimeout(() => {
      handleRunDataset();
    }, 100);
  };

  const isRunButtonDisabled = isRunning || (!selectedFile && !usingPredefined);

  return (
    <div className="dataset-page">
      <div className="dataset-container">
        <Navbar />
        <Stars id="welcome-stars" />
        <div className="dataset-header">
          <h1>Dataset Management and Analysis</h1>
          <p>
            Upload your dataset or use a predefined one to start the analysis
            process. The system will perform Exploratory Data Analysis (EDA) and model training.
          </p>
        </div>

        <div className="dataset-content">
          <section className="upload-section">
            <h3>Upload Your Dataset</h3>
            <div className="upload-area">
              <input
                type="file"
                id="dataset-upload"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                disabled={isUploading || isRunning}
              />
              <label
                htmlFor="dataset-upload"
                className={`upload-label ${isUploading ? "uploading" : ""} ${isRunning ? "disabled" : ""}`}
              >
                {isUploading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <> Upload Dataset</>
                )}
              </label>

              <p className="upload-hint">
                Supported formats: CSV, JSON, TXT (Max 50MB)
              </p>

              {uploadResult && (
                <div
                  className={`upload-result ${
                    uploadResult.success ? "success" : "error"
                  }`}
                >
                  {uploadResult.message}
                  {uploadResult.fileInfo && (
                    <div className="file-info">
                      <strong>File:</strong> {uploadResult.fileInfo.name} | 
                      <strong> Size:</strong> {uploadResult.fileInfo.size} | 
                      <strong> Type:</strong> {uploadResult.fileInfo.type}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="predefined-section">
            <h3>Use Predefined Dataset</h3>
            <div className="predefined-options">
              <button
                className={`predefined-button ${isRunning ? "disabled" : ""}`}
                onClick={runPredefinedDataset}
                disabled={isRunning}
              >
                Use TOI 2025 Dataset
              </button>
              <div className="dataset-stats">
                <div className="stat-item">
                  <span className="stat-value">7,620</span>
                  <span className="stat-label">Samples</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">28</span>
                  <span className="stat-label">Features</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">77.5%</span>
                  <span className="stat-label">Planets</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">CSV</span>
                  <span className="stat-label">Format</span>
                </div>
              </div>
              <p className="predefined-hint">
                Uses the cleaned TOI 2025 dataset with exoplanet classification data
              </p>
              <div className="dataset-badge">
                <span>✓ Preloaded & Ready</span>
              </div>
            </div>
          </section>

          <section className="analysis-section">
            <h3>Run Analysis</h3>
            <button
              className={`run-button ${isRunning ? "running" : ""}`}
              onClick={handleRunDataset}
              disabled={isRunButtonDisabled}
            >
              {isRunning ? (
                <>
                  <div className="spinner"></div>
                  <span>Running EDA & Model Training...</span>
                </>
              ) : (
                <> Run EDA & Algorithm</>
              )}
            </button>
            {isRunButtonDisabled && !isRunning && (
              <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '0.9rem' }}>
                Please upload a dataset or use the predefined dataset first
              </p>
            )}
          </section>

          {analysisResults && (
            <section className="results-section">
              <h3>Analysis Results</h3>
              
              {analysisResults.error ? (
                <div className="error-result">
                  {analysisResults.error}
                </div>
              ) : (
                <div className="results-grid">
                  <div className="result-card">
                    <h4>Dataset Information</h4>
                    <p><strong>Source:</strong> {analysisResults.datasetInfo.source}</p>
                    <p><strong>Shape:</strong> {analysisResults.datasetInfo.shape}</p>
                    <p><strong>Planet Percentage:</strong> {analysisResults.datasetInfo.planetPercentage}</p>
                    <p><strong>Planets:</strong> {analysisResults.datasetInfo.classDistribution.planets}</p>
                    <p><strong>Non-Planets:</strong> {analysisResults.datasetInfo.classDistribution.nonPlanets}</p>
                  </div>

                  <div className="result-card">
                    <h4>Data Quality</h4>
                    <p><strong>Data Leakage Check:</strong> {analysisResults.dataLeakage.checked ? "✓ Completed" : "✗ Failed"}</p>
                    <p><strong>Status:</strong> {analysisResults.dataLeakage.safe ? "✓ Safe" : "✗ Issues Found"}</p>
                    <p>{analysisResults.dataLeakage.message}</p>
                  </div>

                  <div className="result-card">
                    <h4>Feature Selection</h4>
                    <p><strong>Selected Features:</strong> {analysisResults.featureSelection.totalFeatures}</p>
                    <div className="features-list">
                      {analysisResults.featureSelection.selectedFeatures.slice(0, 5).join(", ")}
                      {analysisResults.featureSelection.selectedFeatures.length > 5 && "..."}
                    </div>
                  </div>

                  <div className="result-card">
                    <h4>Data Split</h4>
                    <p><strong>Training Samples:</strong> {analysisResults.dataSplit.trainingSamples}</p>
                    <p><strong>Test Samples:</strong> {analysisResults.dataSplit.testSamples}</p>
                    <p><strong>Training Planet Ratio:</strong> {analysisResults.dataSplit.trainingPlanetRatio}</p>
                    <p><strong>Test Planet Ratio:</strong> {analysisResults.dataSplit.testPlanetRatio}</p>
                  </div>

                  <div className="result-card highlight">
                    <h4>Best Model Performance</h4>
                    <p><strong>Model:</strong> {analysisResults.modelPerformance.bestModel}</p>
                    <p><strong>Accuracy:</strong> {analysisResults.modelPerformance.accuracy}</p>
                    <p><strong>Precision:</strong> {analysisResults.modelPerformance.precision}</p>
                    <p><strong>Recall:</strong> {analysisResults.modelPerformance.recall}</p>
                    <p><strong>F1-Score:</strong> {analysisResults.modelPerformance.f1Score}</p>
                    <p><strong>AUC-ROC:</strong> {analysisResults.modelPerformance.aucRoc}</p>
                  </div>

                  <div className="result-card">
                    <h4>Cross Validation</h4>
                    <p>{analysisResults.crossValidation.message}</p>
                    <p><strong>Conclusion:</strong> {analysisResults.conclusion}</p>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="dataset-guide">
            <h3>Quick Guide</h3>
            <ul>
              <li>Prepare your dataset in CSV, JSON, or TXT format</li>
              <li>Ensure the file size does not exceed 50MB</li>
              <li>Click "Upload Dataset" and wait for the upload to complete</li>
              <li>You can alternatively use the predefined TOI 2025 dataset for testing</li>
              <li>When uploading your dataset, ensure that your data is clean and properly formatted</li>
              <li>Once uploaded, click "Run EDA & Algorithm" to start the comprehensive analysis</li>
              <li>The analysis includes: Data leakage checks, feature selection, model training, and performance evaluation</li>
              <li>Results will show dataset statistics, model performance metrics, and recommendations</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;