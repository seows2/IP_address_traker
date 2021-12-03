import Peer from 'peerjs';

const peer = new Peer(undefined, {
  host: 'localhost',
  path: '/p2p',
  port: 5001,
});

export default peer;
