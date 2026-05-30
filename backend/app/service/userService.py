from app.db.repository.userRepo import UserRepository
from app.db.schemas.User import UserCreate, UserForgotPassword, UserResponse, UserLogin, UserWithToken
from app.core.security.authHandler import AuthHandler
from app.core.security.hashHelper import HashHelper
from sqlalchemy.orm import Session
from fastapi import HTTPException, status


class UserService:
    def __init__(self, session: Session):
        self.__userRepo = UserRepository(session=session)

    def create_user(self, user: UserCreate) -> UserResponse:
        if self.__userRepo.user_exist_by_email(email=user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        hashed_password = HashHelper.get_password_hash(user.password)
        newUser = self.__userRepo.create_user(user=user, hashed_password=hashed_password)
        return UserResponse.model_validate(newUser)

    def login_user(self, login_details: UserLogin) -> UserWithToken:
        user = self.__userRepo.get_user_by_email(email=login_details.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not HashHelper.verify_password(
            password=login_details.password,
            hashed_password=user.hashed_password  
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = AuthHandler.sign_jwt(user_id=user.id)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating token"
            )

        return UserWithToken(
            user=UserResponse.model_validate(user),
            token=token
        )

    def forgot_password(self, forgot_password_details: UserForgotPassword):
        user = self.__userRepo.get_user_by_email(email=forgot_password_details.email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )