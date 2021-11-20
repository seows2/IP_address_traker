import { useState } from 'react';
import { RouterLocation } from '../core/Router';

function useLocation() {
  const [location, setLocation] = useState(window.location);

  const setLocationWrapper = (newLocation: Partial<RouterLocation>) => {
    window.history.pushState({}, '/', newLocation.pathname);
    setLocation({ ...location, ...newLocation });
  };

  return [location, setLocationWrapper] as const;
}

export default useLocation;
