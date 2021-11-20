import { useState } from 'react';
import { RouterLocation } from '../core/Router';

function useBrowserLocation() {
  const [location, setLocation] = useState(window.location);

  const setLocationWrapper = (newLocation: Partial<RouterLocation>) => {
    setLocation({ ...location, ...newLocation });
  };

  return [location, setLocationWrapper] as const;
}

export default useBrowserLocation;
