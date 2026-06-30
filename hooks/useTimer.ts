"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface UseTimerOptions {
  onComplete?: () => void;
}

/**
 * Hook timer hitung-mundur sederhana untuk setiap fase permainan.
 * Mendukung start/pause/reset dan durasi kustom (dalam detik).
 */
export function useTimer({ onComplete }: UseTimerOptions = {}) {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = useCallback((seconds?: number) => {
    if (seconds !== undefined) {
      setDuration(seconds);
      setRemaining(seconds);
    }
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback((seconds?: number) => {
    setRunning(false);
    setRemaining(seconds ?? duration);
    if (seconds !== undefined) setDuration(seconds);
  }, [duration]);

  const progress = duration > 0 ? (remaining / duration) * 100 : 0;

  return { duration, remaining, running, progress, start, pause, reset, setDuration };
}
