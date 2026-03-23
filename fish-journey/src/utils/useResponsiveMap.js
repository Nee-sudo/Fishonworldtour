import { useState, useEffect } from 'react';

const getZoomLevel = () => {
  if (window.innerWidth < 375) {
    return 1.0;
  } else if (window.innerWidth < 770) {
    return 1.3;
  } else if (window.innerWidth < 1024) {
    return 1.8;
  }
  return 2.5;
};

export const useResponsiveMap = () => {
  const [zoom, setZoom] = useState(getZoomLevel());

  useEffect(() => {
    const handleResize = () => {
      setZoom(getZoomLevel());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return zoom;
};
