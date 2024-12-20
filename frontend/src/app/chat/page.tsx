"use client";

import { useState, useEffect, useRef } from "react";
import createWebSocket from "@/lib/api/ws";
import { fetchChatHistory } from "@/lib/api/chat"; // Import the fetchChatHistory function

interface Message {
	sender_id: number;
	recipient_id: number;
	message: string;
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [messageText, setMessageText] = useState("");
	const [activeUsers, setActiveUsers] = useState<number[]>([]);
	const [selectedUser, setSelectedUser] = useState<number | null>(null);
	const [userId, setUserId] = useState<number | null>(null);
	const wsRef = useRef<WebSocket | null>(null);

	// Fetch active users
	const fetchActiveUsers = async (currentUserId: number) => {
		try {
			// const response = await fetch("http://localhost:8000/active-users");
			const response = await fetch(`${process.env.API}/active-users`);

			const users = await response.json();
			// Exclude the current user's ID
			setActiveUsers(
				users.filter((user: number) => user !== currentUserId)
			);
		} catch (error) {
			console.error("Error fetching active users:", error);
		}
	};

	// Add this to the ChatPage component
	useEffect(() => {
	  const loadPreviousMessages = async () => {
		if (userId && selectedUser) {
		  try {
			const history = await fetchChatHistory(userId, selectedUser);
			setMessages(history); // Replace current messages with chat history
		  } catch (error) {
			console.error("Error fetching chat history:", error);
		  }
		}
	  };
	
	  loadPreviousMessages();
	}, [selectedUser]); // Runs when a new user is selected
	
	// Initialize WebSocket and fetch active users
	useEffect(() => {
		const storedUserId = localStorage.getItem("user_id");
		if (storedUserId) {
			const id = parseInt(storedUserId);
			setUserId(id);
			const ws = createWebSocket(id);
			wsRef.current = ws;

			ws.onmessage = (event) => {
				const data: Message = JSON.parse(event.data);
				setMessages((prev) => [...prev, data]);
			};

			ws.onclose = () => {
				console.log("WebSocket disconnected");
			};

			return () => ws.close();
		} else {
			console.error(
				"User ID not found in localStorage. Please log in again."
			);
		}
	}, []);

	// Fetch active users whenever userId changes
	useEffect(() => {
		if (userId !== null) {
			fetchActiveUsers(userId);
			const interval = setInterval(() => fetchActiveUsers(userId), 5000);
			return () => clearInterval(interval);
		}
	}, [userId]); // Run when userId is updated

	// Send message
	const sendMessage = () => {
		if (!wsRef.current || !selectedUser || !userId) return;

		const messageData = {
			recipient_id: selectedUser,
			message: messageText,
		};

		wsRef.current.send(JSON.stringify(messageData));
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
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Chat</h1>

			{userId ? (
				<>
					{/* Display Active Users */}
					<div className="mb-4">
						<h2 className="text-lg font-semibold">Active Users</h2>
						<ul>
							{activeUsers.map((user) => (
								<li
									key={user}
									className={`cursor-pointer p-2 text-black ${
										selectedUser === user
											? "bg-blue-300"
											: "bg-gray-200"
									}`}
									onClick={() => setSelectedUser(user)}
								>
									User {user}
								</li>
							))}
						</ul>
					</div>

					{/* Chat Messages */}
					<div className="border p-4 h-64 overflow-y-scroll">
						{messages.map((msg, index) => (
							<p
								key={index}
								className={`mb-1 ${
									msg.sender_id === userId
										? "text-blue-500 text-right"
										: "text-gray-700 text-left"
								}`}
							>
								{msg.sender_id === userId
									? `You: ${msg.message}`
									: `User ${msg.sender_id}: ${msg.message}`}
							</p>
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
				<p>Loading...</p>
			)}
		</div>
	);
}
