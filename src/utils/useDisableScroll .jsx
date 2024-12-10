// useDisableScroll.js
import { useEffect } from 'react';

const useDisableScroll = () => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (event.target.type === 'number') {
        event.preventDefault();
      }
    };

    // Add event listener to the document
    document.addEventListener('wheel', handleWheel, { passive: false });

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);
};

export default useDisableScroll;
