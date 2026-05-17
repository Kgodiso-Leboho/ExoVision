import joblib
import os

class ModelLoader:
    def __init__(self, model_path="training/multi_model_classifier.pkg"):
        self.model_path = os.path.abspath(model_path)
        self.model = None

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}. Did you move the .pkg file?")
        
        try:
            print(f"Loading model from {self.model_path}...")
            self.model = joblib.load(self.model_path)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Failed to load model: {e}")
            raise e

    def get_model(self):
        if self.model is None:
            self.load_model()
        return self.model