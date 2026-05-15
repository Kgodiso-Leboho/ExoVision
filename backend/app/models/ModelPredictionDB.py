from sqlalchemy import Column, Integer, String, Float
from backend.app.core.database import Base 

class PredictionModelDB(Base):
    __tablename__ = "model_performance"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, unique=True, index=True)
    model_description = Column(String)
    model_accuracy = Column(Float)
    model_precision = Column(Float)
    model_recall = Column(Float)
    model_f1_score = Column(Float)