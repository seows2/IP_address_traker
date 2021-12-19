import { FC, useEffect, useRef } from 'react';

const RTCAudio: FC<{ id: string; stream: MediaStream }> = ({ id, stream }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = stream ?? null;
  });

  return (
    <figure>
      <figcaption>{id.slice(0, 8)}</figcaption>
      <audio ref={audioRef} autoPlay controls />
    </figure>
  );
};

export default RTCAudio;
