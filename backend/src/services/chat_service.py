from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, desc
from sqlalchemy.orm import Session
from datetime import datetime
from ..db import Base

# ChatMessage Table Definition
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Save Message to PostgreSQL
def save_message(db: Session, sender_id: int, recipient_id: int, message: str):
    """Save a chat message to the database."""
    new_message = ChatMessage(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=message
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

# Retrieve Chat History
def get_chat_history(db: Session, user_id: int, with_user_id: int):
    """Retrieve chat history between two users."""
    return db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == user_id) & (ChatMessage.recipient_id == with_user_id)) |
        ((ChatMessage.sender_id == with_user_id) & (ChatMessage.recipient_id == user_id))
    ).order_by(desc(ChatMessage.timestamp)).all()
