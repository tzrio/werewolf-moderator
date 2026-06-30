"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const PRESETS = [15, 30, 45, 60, 90];

export default function Timer() {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = (d: number) => {
    setDuration(d);
    setRemaining(d);
    setRunning(false);
  };

  const progress = (remaining / duration) * 100;

  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-moon/70">Timer Fase</span>
        <span className="font-display text-2xl text-ember">{remaining}s</span>
      </div>
      <div className="w-full h-2 bg-forest-900 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-ember to-blood transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => reset(p)}
            className="px-3 py-1 rounded-lg text-xs bg-forest-800 hover:bg-forest-700 border border-white/10"
          >
            {p}s
          </button>
        ))}
        <input
          type="number"
          placeholder="Custom"
          className="w-20 px-2 py-1 rounded-lg text-xs bg-forest-800 border border-white/10"
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v > 0) reset(v);
          }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-sm">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {running ? "Pause" : "Mulai"}
        </button>
        <button onClick={() => reset(duration)} className="px-3 rounded-lg bg-forest-800 border border-white/10">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
