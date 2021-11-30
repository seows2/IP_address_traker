import Peer from 'peerjs';

const peer = new Peer('someid', {
  host: 'localhost',
  port: 5000,
});

export default peer;
