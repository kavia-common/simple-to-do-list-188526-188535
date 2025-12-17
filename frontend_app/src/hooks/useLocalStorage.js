import { useState, useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * useLocalStorage - React hook that persists a state value to localStorage with JSON serialization.
 * @param {string} key - Storage key.
 * @param {any} initialValue - Initial value or function returning value.
 * @returns {[any, Function, Function]} - [value, setValue, clearValue]
 */
export default function useLocalStorage(key, initialValue) {
  const isFirst = useRef(true);
  const readValue = () => {
    if (typeof window === 'undefined') return typeof initialValue === 'function' ? initialValue() : initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : (typeof initialValue === 'function' ? initialValue() : initialValue);
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    // Initialize from localStorage on mount
    if (!isFirst.current) return;
    isFirst.current = false;
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // noop - storage may be disabled
    }
  }, [key, storedValue]);

  const clear = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // noop
    }
  };

  return [storedValue, setStoredValue, clear];
}
