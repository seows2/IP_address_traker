import Peer from 'peerjs';

const createPeer = (uuid?: string) => {
  const peer = new Peer(uuid, {
    host: '192.168.0.5',
    path: '/p2p',
    port: 5001,
    secure: true,
  });

  return peer;
};

export default createPeer;
