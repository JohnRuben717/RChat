import axios from "axios";
// import { getBaseUrl } from '@/lib/utils/host';

const BASE_URL = "http://localhost:8000/auth";
// const BASE_URL = `${getBaseUrl()}/auth`;
// const BASE_URL = `${process.env.API}/auth`;

export interface SignupPayload {
	email: string;
	phone?: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export const signup = async (payload: SignupPayload) => {
	console.log("Payload:", payload); // Debug log
	const response = await axios.post(`${BASE_URL}/signup`, payload, {
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true, // Important for cross-origin cookies
	});
	return response.data;
};

export const login = async (payload: LoginPayload) => {
	const response = await axios.post(`${BASE_URL}/login`, payload, {
		withCredentials: true,
	});
	const { access_token, user_id } = response.data; // Expect user_id in response
	localStorage.setItem("token", access_token);
	localStorage.setItem("user_id", user_id.toString());
	return response.data; // { access_token: string, token_type: string }
};
