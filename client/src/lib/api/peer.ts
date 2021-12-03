import Peer from 'peerjs';

const createPeer = (uuid?: string) => {
  const peer = new Peer(uuid, {
    host: 'localhost',
    path: '/p2p',
    port: 5001,
  });

  return peer;
};

export default createPeer;
