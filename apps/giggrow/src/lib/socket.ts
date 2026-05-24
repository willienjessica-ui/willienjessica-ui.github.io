import { io } from 'socket.io-client';

// In development, the socket server is the same as the dev server
// In production, it's the same origin
const socket = io(window.location.origin);

export default socket;
