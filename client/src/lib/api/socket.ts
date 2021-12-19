import { io } from 'socket.io-client';

const createSocket = () => {
  const socket = io('https://192.168.0.5:5000');
  return socket;
};

export default createSocket;
