import https from 'https';
import { Server, Socket } from 'socket.io';
import app from '@/app';
import config from '@/config';
import { cert, key } from '@/config/pem_config';

const { port } = config;
app.set('port', port);

const server = https.createServer({ cert, key }, app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('move', (data: any) => {
    console.log('[MOVE]', data);
    io.emit('update-moves', data);
  });
  socket.on('join-room', (userId) => {
    socket.broadcast.emit('user-connected', userId);
    console.log(`user-connected! id: ${userId}`);
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId);
    });
  });
});

/**
 * HTTP "error" 이벤트를 위한 리스너
 */

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // 메세지에 따른 에러 처리
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * HTTP "listening" 이벤트를 위한 이벤트 리스너
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr?.port}`;
  console.info(`Listening on ${bind}`);
};

server.listen(port, () => {
  console.log(`Express Server ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);
