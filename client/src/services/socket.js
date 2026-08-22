import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Socket connected to server with ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('⚠️ Socket connection issue, falling back to polling:', error.message);
    });
  }
  return socket;
};

export const joinLocationRoom = (locationId = 'campus-canteen') => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('join_location', locationId);
  } else if (s) {
    s.once('connect', () => {
      s.emit('join_location', locationId);
    });
  }
};

export const leaveLocationRoom = (locationId = 'campus-canteen') => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('leave_location', locationId);
  }
};
