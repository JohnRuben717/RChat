from passlib.context import CryptContext
from sqlalchemy.orm import Session
from ..models.user import User
from src.db import Base, engine

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, email: str, phone: str, password: str):
    phone = phone if phone and phone.strip() else None
    
    user = User(
        email=email,
        phone=phone,
        hashed_password=get_password_hash(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.hashed_password):
        return user
    return None

# Add this line before starting the app
Base.metadata.create_all(bind=engine)
