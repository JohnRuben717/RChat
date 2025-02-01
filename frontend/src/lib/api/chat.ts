import axios from "axios";
// import { getBaseUrl } from "@/lib/utils/host";

// const BASE_URL = `${getBaseUrl()}`;
const BASE_URL = "http://localhost:8000";

// const BASE_URL = 'http://<backend-ip>:8000';

export const fetchActiveUsers = async (): Promise<number[]> => {
	const response = await axios.get(`${BASE_URL}/active-users`);
	// const response = await axios.get(`${process.env.API}/active-users`);

	return response.data; // List of active user IDs
};

export const fetchChatHistory = async (
	senderId: number,
	recipientId: number
) => {
	const response = await fetch(
		`${BASE_URL}/chats?sender_id=${senderId}&recipient_id=${recipientId}`
	);
	// const response = await fetch(`${process.env.API}/chats?sender_id=${senderId}&recipient_id=${recipientId}`);
	if (!response.ok) throw new Error("Failed to fetch chat history");
	return response.json();
};

export async function fetchConversations(userId: number): Promise<number[]> {
	const response = await fetch(
		`${BASE_URL}/conversations?user_id=${userId}`
	);

	if (!response.ok) {
		throw new Error("Failed to fetch conversations.");
	}

	return await response.json();
}
