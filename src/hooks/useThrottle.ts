import { useRef, useCallback } from 'react';


export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - timeSinceLastRun
        );
      }
    },
    [callback, delay]
  );
}


export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * RequestAnimationFrame throttle for smooth 60fps animations
 * 
 * @param callback - Function to call on animation frame
 * @returns RAF-throttled function
 */
export function useRAFThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  const rafRef = useRef<number>();
  const argsRef = useRef<Parameters<T>>();

  return useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;

      if (rafRef.current) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        if (argsRef.current) {
          callback(...argsRef.current);
        }
        rafRef.current = undefined;
      });
    },
    [callback]
  );
}
