import { io } from 'socket.io-client';

const createSocket = () => {
  const socket = io('https://localhost:5000');
  return socket;
};

export default createSocket;
