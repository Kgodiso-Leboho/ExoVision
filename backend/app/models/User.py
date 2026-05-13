from pydantic import BaseModel

class User(BaseModel):
    id: int
    username: str
    email: str
    password: str
    is_active: bool
    created_at: str
    updated_at: str
    is_verified: bool
    reset_password_token: str
    reset_password_token_expires: str
    verification_token: str
    verification_token_expires: str
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str