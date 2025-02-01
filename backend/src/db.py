from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://postgres:1117@localhost:5432/todo_app"
# DATABASE_URL = "postgresql://rchat_user:n7JNecTQKuBL1hgXXKGoviE1hedQ7trX@dpg-cti5hh3tq21c73a0tmc0-a.singapore-postgres.render.com/rchat"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

from src.services.chat_service import ChatMessage
from src.models.user import User
from src.models.user import MessageRequest

Base.metadata.create_all(bind=engine)