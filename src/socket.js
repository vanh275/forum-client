// socket.js
import { io } from "socket.io-client";
const api_url = import.meta.env.VITE_URL;
const socket = io(api_url, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"],
});
window.socket = socket;

export default socket;
