from sqlalchemy import Column, Integer, String, Boolean, DateTime
from backend.app.core.database import Base
from sqlalchemy.sql import func

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    verification_token = Column(String, nullable=True)
    reset_password_token = Column(String, nullable=True)
    reset_password_token_expires = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())