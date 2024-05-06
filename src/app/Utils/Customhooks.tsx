"use client";
import { useEffect, useState } from "react";

const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  const isClient = typeof window !== "undefined";
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    } else {
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearValue = (): void => {
    try {
      if (isClient) {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, isClient]);

  return [storedValue, setValue, clearValue];
};

export default useLocalStorage;
