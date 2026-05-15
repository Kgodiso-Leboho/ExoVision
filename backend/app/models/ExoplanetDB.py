from sqlalchemy import Column, Integer, Float, Boolean, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class ExoplanetPredictionDB(Base):
    __tablename__ = "exoplanet_predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Optional: track which user ran this
    
    # Identifiers
    toi = Column(Float)
    tid = Column(Integer)
    
    # Coordinates
    ra = Column(Float)
    dec = Column(Float)
    
    # Planet Transit Features
    pl_rade = Column(Float)
    pl_orbper = Column(Float)
    pl_trandurh = Column(Float)
    pl_trandep = Column(Float)
    pl_insol = Column(Float)
    pl_eqt = Column(Float)
    
    # Stellar Features
    st_tmag = Column(Float)
    st_dist = Column(Float)
    st_teff = Column(Float)
    st_logg = Column(Float)
    st_rad = Column(Float)
    
    # Results (Where you save the ML output)
    rf_prediction = Column(String) # e.g., "Planet"
    xgb_prediction = Column(String)
    dt_prediction = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())