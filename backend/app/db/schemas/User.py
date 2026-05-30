from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    id: int
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class UserDelete(BaseModel):
    id: int

class UserForgotPassword(BaseModel):
    email: EmailStr

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True) 

    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None 

class UserInDB(UserResponse):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserWithToken(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user: UserResponse
    token: str