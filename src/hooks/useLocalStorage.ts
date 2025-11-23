import { useEffect, useState } from "react";

type LocalStorageErrorContext = "read" | "write";

interface UseLocalStorageOptions {
  onError?: (error: unknown, context: LocalStorageErrorContext) => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
) {
  const { onError } = options || {};
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `[useLocalStorage] Failed to write key "${key}" to localStorage:`,
        error
      );
      onError?.(error, "write");
    }
  }, [key, value]);

  return [value, setValue] as const;
}
