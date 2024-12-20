import axios from "axios";
// import { getBaseUrl } from "@/lib/utils/host";

// const BASE_URL = `${getBaseUrl()}`;

// const BASE_URL = 'http://<backend-ip>:8000';

export const fetchActiveUsers = async (): Promise<number[]> => {
	// const response = await axios.get(`${BASE_URL}/active-users`);
	const response = await axios.get(`https://rchat-api.onrender.com/active-users`);

	return response.data; // List of active user IDs
};

export const fetchChatHistory = async (senderId: number, recipientId: number) => {
	// const response = await fetch(`http://localhost:8000/chats?sender_id=${senderId}&recipient_id=${recipientId}`);
	const response = await fetch(`https://rchat-api.onrender.com/chats?sender_id=${senderId}&recipient_id=${recipientId}`);
	if (!response.ok) throw new Error("Failed to fetch chat history");
	return response.json();
  };
  