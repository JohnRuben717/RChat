export function getBaseUrl() {
    // Check if we're running on the server or browser
    if (typeof window !== 'undefined') {
      // Client-side: Use window.location.hostname
      const host = window.location.hostname;
      const port = '8000'; // Backend port
      return `http://${host}:${port}`;
    } else {
      // Server-side: Use a predefined environment variable or default host
      const host = process.env.BACKEND_HOST || '127.0.0.1';
      const port = process.env.BACKEND_PORT || '8000';
      return `http://${host}:${port}`;
    }
  }
  
  export const getWsUrl = () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = "8000"; // Replace with the backend WebSocket port
    return `${protocol}://${host}:${port}`;
  };
  