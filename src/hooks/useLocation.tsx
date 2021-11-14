import { useState } from 'react';

function useLocation() {
  const { pathname } = window.location;
  const [location, setLocation] = useState(pathname);

  const setLocationWrapper = (newLocation: string) => {
    window.history.pushState({}, '/', newLocation);
    setLocation(newLocation);
  };

  return [location, setLocationWrapper] as const;
}

export default useLocation;
