import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os

class ExoplanetModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            random_state=42,
            min_samples_split=5,
            min_samples_leaf=2
        )
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.accuracy = 0.0
        self.is_trained = False
        self.feature_names = []

    def load_and_preprocess_data(self, file_path):
        """Load and preprocess dataset"""
        try:
            # Try different file formats
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            else:
                raise ValueError("Unsupported file format")
            
            print(f"Dataset loaded with shape: {df.shape}")
            print(f"Columns: {df.columns.tolist()}")
            
            # Use all numeric columns as features for now
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            
            # Remove any potential target columns
            target_keywords = ['target', 'label', 'class', 'disposition']
            feature_columns = [col for col in numeric_cols if not any(keyword in col.lower() for keyword in target_keywords)]
            
            if len(feature_columns) < 3:
                raise ValueError("Not enough numeric features found in dataset")
            
            print(f"Using features: {feature_columns}")
            
            # For synthetic target - you'll replace this with your actual target column
            df['target'] = np.random.randint(0, 2, len(df))
            
            # Handle missing values
            df_clean = df[feature_columns + ['target']].dropna()
            
            X = df_clean[feature_columns]
            y = df_clean['target']
            
            self.feature_names = feature_columns
            return X, y
            
        except Exception as e:
            print(f"Error loading dataset: {e}")
            # Fallback to synthetic data
            from ..data.training_data import generate_training_data
            return generate_training_data(2000)

    def train(self, data_path=None):
        """Train the Random Forest model"""
        try:
            if data_path and os.path.exists(data_path):
                X, y = self.load_and_preprocess_data(data_path)
            else:
                from ..data.training_data import generate_training_data
                X, y = generate_training_data(2000)
            
            # Split the data
            self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Train the model
            self.model.fit(self.X_train, self.y_train)
            
            # Calculate accuracy
            y_pred = self.model.predict(self.X_test)
            self.accuracy = accuracy_score(self.y_test, y_pred)
            self.is_trained = True
            
            print(f"Model trained with accuracy: {self.accuracy:.4f}")
            print(f"Classification Report:\n{classification_report(self.y_test, y_pred)}")
            
        except Exception as e:
            print(f"Training failed: {e}")
            raise

    def predict(self, input_data):
        """Make prediction on new data"""
        if not self.is_trained:
            self.train()
        
        # Convert input to numpy array in the correct feature order
        features = []
        for feature_name in self.feature_names:
            feature_value = getattr(input_data, feature_name, 0)
            features.append(feature_value)
        
        features_array = np.array([features])
        
        # Make prediction
        prediction = self.model.predict(features_array)[0]
        probability = self.model.predict_proba(features_array)[0][1]
        
        return prediction, probability

    def get_feature_importance(self):
        """Get feature importance from the trained model"""
        if not self.is_trained:
            return {}
        
        importance = self.model.feature_importances_
        return dict(zip(self.feature_names, importance.tolist()))