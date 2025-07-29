import { useState, useEffect, useCallback } from 'react';

const useContainerWidth = (ref: React.RefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0);

  const updateWidth = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref]);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    const observer = new ResizeObserver(updateWidth);
    
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', updateWidth);
      observer.disconnect();
    };
  }, [ref, updateWidth]);

  return width;
};

export default useContainerWidth; 