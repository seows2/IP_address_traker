import { FC, memo, useEffect, useRef } from 'react';
import { Video } from './index.style';

const RTCVideo: FC<{ id: string; stream: MediaStream; muted?: boolean }> = ({
  id,
  stream,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream ?? null;
  });

  return (
    <figure>
      <figcaption>{id.slice(0, 8)}</figcaption>
      <Video ref={videoRef} autoPlay controls muted={muted} />
    </figure>
  );
};

export default memo(RTCVideo);
