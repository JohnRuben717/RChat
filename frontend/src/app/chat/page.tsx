"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import createWebSocket from "@/lib/api/ws";
import { fetchChatHistory } from "@/lib/api/chat";
import Sidebar from "../components/Sidebar";

interface Message {
  sender_id: number;
  recipient_id: number;
  message: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [highlightedUsers, setHighlightedUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Create a ref for the messages container
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch previous chat history when a conversation is selected
  useEffect(() => {
    const loadPreviousMessages = async () => {
      if (userId && selectedUser) {
        try {
          const history = await fetchChatHistory(userId, selectedUser);
          setMessages(history);
          // Remove highlight for the selected conversation
          setHighlightedUsers((prev) => prev.filter((id) => id !== selectedUser));
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    loadPreviousMessages();
  }, [selectedUser]);

  // Initialize WebSocket and handle incoming messages
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      const id = parseInt(storedUserId);
      setUserId(id);
      const ws = createWebSocket(id);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data: Message = JSON.parse(event.data);

        if (
          selectedUser &&
          (data.sender_id === selectedUser || data.recipient_id === selectedUser)
        ) {
          setMessages((prev) => [...prev, data]);
        } else {
          if (data.sender_id !== userId) {
            setHighlightedUsers((prev) =>
              Array.from(new Set([...prev, data.sender_id]))
            );
          }
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      return () => ws.close();
    } else {
      console.error("User ID not found in localStorage. Please log in again.");
    }
  }, [selectedUser]);

  // Send message
  const sendMessage = () => {
    if (!wsRef.current || !selectedUser || !userId) return;

    const messageData = {
      recipient_id: selectedUser,
      message: messageText,
    };

    wsRef.current.send(JSON.stringify(messageData));

    // Remove the highlight for the currently active conversation
    setHighlightedUsers((prev) => prev.filter((id) => id !== selectedUser));

    setMessages((prev) => [
      ...prev,
      {
        sender_id: userId,
        recipient_id: selectedUser,
        message: messageText,
      },
    ]);
    setMessageText("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        userId={userId!}
        selectedConversation={selectedUser}
        onConversationSelect={setSelectedUser}
        highlightedUsers={highlightedUsers}
      />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        {selectedUser ? (
          <>
            {/* Chat Messages */}
            <div
              className="border p-4 h-64 overflow-y-scroll scroll-smooth"
              ref={messagesContainerRef}
            >
              {messages.map((msg, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-1 ${
                    msg.sender_id === userId
                      ? "text-blue-500 text-right"
                      : "text-gray-700 text-left"
                  }`}
                >
                  {msg.sender_id === userId
                    ? `You: ${msg.message}`
                    : `User ${msg.sender_id}: ${msg.message}`}
                </motion.p>
              ))}
            </div>

            {/* Message Input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type a message"
                className="border p-2 w-full text-black"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={!selectedUser}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded mt-2"
                disabled={!selectedUser}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
}
