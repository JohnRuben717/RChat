'use client';

import { useState, useEffect, useRef } from 'react';
import createWebSocket from '@/lib/api/ws';

interface Message {
  sender_id: number;
  recipient_id: number;
  message: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
      const ws = createWebSocket(parseInt(storedUserId));
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      };
    } else {
      console.error("User ID not found in localStorage. Please log in again.");
    }
  }, []);

  const sendMessage = () => {
    if (!wsRef.current || !recipientId || !userId) return;

    const messageData = {
      recipient_id: parseInt(recipientId),
      message: messageText,
    };

    wsRef.current.send(JSON.stringify(messageData));
    setMessages((prev) => [
      ...prev,
      { sender_id: userId, recipient_id: parseInt(recipientId), message: messageText },
    ]);
    setMessageText('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      {userId ? (
        <>
          <input
            type="text"
            placeholder="Recipient ID"
            className="border p-2 mb-4"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
          <div className="border p-4 h-64 overflow-y-scroll">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`mb-1 ${
                  msg.sender_id === userId ? 'text-blue-500 text-right' : 'text-gray-700 text-left'
                }`}
              >
                {msg.sender_id === userId
                  ? `You: ${msg.message}`
                  : `User ${msg.sender_id}: ${msg.message}`}
              </p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            className="border p-2 w-full"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded mt-2">
            Send
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
