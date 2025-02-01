export function getBaseUrl() {
    if (typeof window !== 'undefined') {
      return `http://${window.location.hostname}:8000`;
    }
    return `http://localhost:8000`;  // Ensure this is reachable
}


export const getWsUrl = () => {
	const protocol = window.location.protocol === "https:" ? "wss" : "ws";
	const host = window.location.hostname;
	const port = "8000"; // Replace with the backend WebSocket port
	return `${protocol}://${host}:${port}`;
};
