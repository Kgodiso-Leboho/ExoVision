from fastapi import APIRouter, Depends
from app.db.schemas.User import UserCreate, UserLogin, UserForgotPassword, UserResponse, UserWithToken
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.service.userService import UserService

authRouter = APIRouter(
    prefix="/auth", 
    tags=["auth"]
)

@authRouter.post("/login", status_code=200, response_model=UserWithToken)
def login(loginDetails: UserLogin, session : Session = Depends(get_db)):
    try:
        return UserService(session=session).login_user(login_details=loginDetails)
    except Exception as error:
        print(error)

@authRouter.post("/register", status_code=201, response_model=UserResponse)
def register(registerDetails: UserCreate, session : Session = Depends(get_db)):
    try:
        return UserService(session=session).create_user(user=registerDetails)
    except Exception as error:
        print(error)
        raise error

@authRouter.post("/forgot-password", status_code=200, response_model=UserWithToken)
def forgot_password(forgotPasswordDetails: UserForgotPassword, session : Session = Depends(get_db)):
    try:
        return UserService(session=session).forgot_password(forgot_password_details=forgotPasswordDetails)
    except Exception as error:
        print(error)
        raise error