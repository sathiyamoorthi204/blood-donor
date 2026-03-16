import { io } from "socket.io-client";

// Use REACT_APP_SOCKET_URL to allow overriding in .env when needed
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  path: "/ws",
  transports: ["websocket", "polling"],
});

export default socket;
