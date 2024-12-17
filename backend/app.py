from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.orm import Session
from src.routers import auth  # Authentication routes
from src.db import SessionLocal  # Database session
from src.services.chat_service import save_message  # Save messages to PostgreSQL
from typing import Dict, List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]
)

# Include authentication routes
app.include_router(auth.router, prefix="/auth")

# Active WebSocket connections (user_id -> WebSocket)
active_connections: Dict[int, WebSocket] = {}

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    user_id = None  # Initialize to handle disconnects
    await websocket.accept()
    try:
        # Wait for the initial JSON data containing user_id
        initial_data = await websocket.receive_json()
        user_id = initial_data.get("user_id")

        if not user_id:
            print("WebSocket connection closed: Missing user_id")
            await websocket.close()
            return

        # Add user to active connections
        active_connections[user_id] = websocket
        print(f"User {user_id} connected. Active users: {list(active_connections.keys())}")

        while True:
            # Receive message and process
            data = await websocket.receive_json()
            recipient_id = data.get("recipient_id")
            message = data.get("message")

            save_message(db, sender_id=user_id, recipient_id=recipient_id, message=message)

            # Send to recipient if online
            if recipient_id in active_connections:
                await active_connections[recipient_id].send_json({
                    "sender_id": user_id,
                    "message": message
                })

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Cleanup the disconnected user
        if user_id and user_id in active_connections:
            del active_connections[user_id]
            print(f"User {user_id} removed from active connections")


@app.get("/active-users", response_model=List[int])
async def get_active_users():
    """Returns a list of currently active user IDs."""
    return list(active_connections.keys())


from src.services.chat_service import get_chat_history
# New endpoint to fetch chat history
@app.get("/chats")
def get_chats(
    sender_id: int = Query(...),
    recipient_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Fetch all chat messages between two users.
    """
    messages = get_chat_history(db, sender_id, recipient_id)
    return [
        {
            "sender_id": msg.sender_id,
            "recipient_id": msg.recipient_id,
            "message": msg.message,
            "timestamp": msg.timestamp
        }
        for msg in messages
    ]
