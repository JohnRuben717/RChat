from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from src.routers import auth  # Authentication routes
from src.db import SessionLocal  # Database session
from src.services.chat_service import save_message  # Save messages to PostgreSQL
from typing import Dict

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Add this line
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

# WebSocket Endpoint for Real-Time Chat
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        # Expect the first message to include the user_id
        initial_data = await websocket.receive_json()
        user_id = initial_data.get("user_id")
        active_connections[user_id] = websocket

        while True:
            # Receive a message from the client
            data = await websocket.receive_json()
            recipient_id = data.get("recipient_id")
            message = data.get("message")

            # Save the message to PostgreSQL
            save_message(db, sender_id=user_id, recipient_id=recipient_id, message=message)

            # Forward the message to the recipient if connected
            if recipient_id in active_connections:
                await active_connections[recipient_id].send_json({
                    "sender_id": user_id,
                    "message": message
                })

    except WebSocketDisconnect:
        # Remove user from active connections on disconnect
        if user_id in active_connections:
            del active_connections[user_id]
