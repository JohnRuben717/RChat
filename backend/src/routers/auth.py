from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..services.auth_service import create_user, authenticate_user
from ..utils.jwt_handler import create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SignUpRequest(BaseModel):
    email: str
    phone: str = None
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str
class SignupRequest(BaseModel):
    email: str
    phone: str = None
    password: str
@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    try:
        print("Received signup request:", request)  # Debug log
        user = create_user(db, email=request.email, phone=request.phone, password=request.password)
        print("User created:", user)  # Debug log
        return {"message": "User created successfully", "user_id": user.id}
    except Exception as e:
        print(f"Error during signup: {str(e)}")  # More detailed error logging
        print(f"Error type: {type(e)}")  # Print the type of error
        import traceback
        print(f"Traceback: {traceback.format_exc()}")  # Print the full traceback
        raise HTTPException(status_code=500, detail=str(e))  # Return the actual error message

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = authenticate_user(db, payload.email, payload.password)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
        token = create_access_token({"user_id": user.id})
        return {"access_token": token, "token_type": "bearer","user_id": user.id}
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
