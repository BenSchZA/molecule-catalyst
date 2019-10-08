import { useState, useEffect } from 'react';

// Our hook
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      console.log('received new value');
      console.log(value);
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },

    [value] 
  );

  return debouncedValue;
}
