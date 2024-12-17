
from sqlalchemy.orm import Session
from ..db import Base
from src.models.user import ChatMessage
# ChatMessage Table Definition


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

def get_chat_history(db: Session, sender_id: int, recipient_id: int):
    """
    Retrieve all messages between two users.
    """
    return db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == sender_id) & (ChatMessage.recipient_id == recipient_id)) |
        ((ChatMessage.sender_id == recipient_id) & (ChatMessage.recipient_id == sender_id))
    ).order_by(ChatMessage.timestamp).all()