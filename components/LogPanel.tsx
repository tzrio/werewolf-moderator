"use client";

import { useGameStore } from "@/lib/store";
import { Download } from "lucide-react";

export default function LogPanel() {
  const { log, players, day, winner, history } = useGameStore();

  const handleExportJSON = () => {
    const data = { players, day, winner, log, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `werewolf-game-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-panel p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg text-ember">Log Permainan</h3>
        <button onClick={handleExportJSON} className="flex items-center gap-1 text-xs text-moon/60 hover:text-moon">
          <Download className="w-3.5 h-3.5" /> Export JSON
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 max-h-80 pr-1">
        {log.length === 0 && <p className="text-xs text-moon/40">Belum ada aktivitas tercatat.</p>}
        {log
          .slice()
          .reverse()
          .map((entry) => (
            <div key={entry.id} className="text-xs border-l-2 border-ember/40 pl-2">
              <span className="text-moon/40">
                Hari {entry.day} • {entry.phase}
              </span>
              <p className="text-moon/80">{entry.message}</p>
            </div>
          ))}
      </div>
      {history.length > 0 && (
        <p className="text-[11px] text-moon/40 mt-3">{history.length} riwayat permainan tersimpan.</p>
      )}
    </div>
  );
}
