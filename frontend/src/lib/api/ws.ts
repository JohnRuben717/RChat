import { getWsUrl } from "../utils/host";

export default function createWebSocket(userId: number): WebSocket {
    const ws = new WebSocket(`${getWsUrl()}/ws`);
    // const ws = new WebSocket(`${process.env.API}/ws`);

    
    ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ user_id: userId }));
    };
  
    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return ws;
  }
  