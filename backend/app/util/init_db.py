from app.core.database import Base, engine
from app.db.models.UserDB import User

def create_tables():
    Base.metadata.create_all(bind=engine)