from .base import BaseRepository
from app.db.models.UserDB import User
from app.db.schemas.User import UserCreate

class UserRepository(BaseRepository):
    def create_user(self, user: UserCreate, hashed_password: str):
        user_data = user.model_dump(exclude={"password"})  
        user_data["hashed_password"] = hashed_password     

        newUser = User(**user_data)

        self.session.add(instance=newUser)
        self.session.commit()
        self.session.refresh(instance=newUser)

        return newUser

    def user_exist_by_email(self, email: str) -> bool:
        user = self.session.query(User).filter_by(email=email).first()
        return bool(user)

    def get_user_by_email(self, email: str) -> User | None:
        user = self.session.query(User).filter_by(email=email).first()
        return user

    def get_user_by_id(self, user_id: int) -> User | None:
        user = self.session.query(User).filter_by(id=user_id).first()
        return user