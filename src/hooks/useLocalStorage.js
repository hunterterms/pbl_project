import { useState, useEffect } from 'react';

// Works like useState, but the value is saved in the browser so it survives page reloads
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // Storage is blocked or the saved data is corrupted
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
