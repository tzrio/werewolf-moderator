"use client";

import { useGameStore } from "@/lib/store";
import { getRandomNarration } from "@/lib/narration";
import toast from "react-hot-toast";
import { Moon, Sun, Vote, Skull, Trophy, RotateCcw, Undo2 } from "lucide-react";
import { useState } from "react";

const PHASES = [
  { id: "night", label: "Mulai Malam", icon: Moon },
  { id: "day", label: "Mulai Siang", icon: Sun },
  { id: "voting", label: "Voting", icon: Vote },
  { id: "execution", label: "Eksekusi", icon: Skull },
  { id: "gameover", label: "Game Over", icon: Trophy },
] as const;

export default function PhaseControls() {
  const { phase, goToPhase, resolveNight, nextDay, day, checkWinCondition, winner, saveHistory, resetGame, undo, addLog } = useGameStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const handlePhaseChange = (id: typeof PHASES[number]["id"]) => {
    if (id === "night") {
      nextDay();
      addLog(getRandomNarration("nightStart"));
      toast(getRandomNarration("nightStart"), { icon: "🌙", duration: 4000 });
    }
    if (id === "day") {
      const { deaths } = resolveNight();
      if (deaths.length === 0) {
        addLog(getRandomNarration("noDeath"));
        toast(getRandomNarration("noDeath"), { duration: 4000 });
      }
      addLog(getRandomNarration("dayStart"));
      toast(getRandomNarration("dayStart"), { icon: "☀️", duration: 4000 });
    }
    if (id === "voting") {
      addLog(getRandomNarration("votingStart"));
    }
    if (id === "gameover") {
      const w = checkWinCondition();
      saveHistory();
      addLog(w ? `Permainan selesai. Pemenang: ${w}` : "Permainan selesai.");
    }
    goToPhase(id);
  };

  const win = checkWinCondition();

  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-moon/60">Hari ke-{day} • Fase: <span className="text-ember capitalize">{phase}</span></span>
        {win && phase !== "gameover" && (
          <span className="text-xs text-emerald-400">Kondisi menang terdeteksi: {win}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {PHASES.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => handlePhaseChange(p.id)}
              className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
            >
              <Icon className="w-4 h-4" /> {p.label}
            </button>
          );
        })}
        <button onClick={undo} className="px-4 py-2 rounded-lg text-sm bg-forest-800 border border-white/10 flex items-center gap-1.5">
          <Undo2 className="w-4 h-4" /> Undo
        </button>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="btn-danger px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-blood">Yakin reset semua data?</span>
            <button onClick={() => { resetGame(); setConfirmReset(false); }} className="btn-danger px-3 py-1.5 rounded-lg text-xs">
              Ya, Reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="px-3 py-1.5 rounded-lg text-xs bg-forest-800 border border-white/10">
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
