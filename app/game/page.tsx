"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import PhaseControls from "@/components/PhaseControls";
import Timer from "@/components/Timer";
import ModeratorDashboard from "@/components/ModeratorDashboard";
import NightActionsPanel from "@/components/NightActionsPanel";
import VotingPanel from "@/components/VotingPanel";
import LogPanel from "@/components/LogPanel";
import RoleModal from "@/components/RoleModal";
import PlayerCard from "@/components/PlayerCard";
import { Player } from "@/lib/types";
import { Moon, Vote, ScrollText, LayoutDashboard, Tv, Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";

type Tab = "dashboard" | "night" | "voting" | "log";

export default function GamePage() {
  const router = useRouter();
  const { players, phase, hydrate, winner, checkWinCondition } = useGameStore();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [revealedPlayer, setRevealedPlayer] = useState<Player | null>(null);
  const [projectorMode, setProjectorMode] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (players.length === 0) {
      router.push("/setup");
    }
  }, [players, router]);

  if (players.length === 0) return null;

  const win = checkWinCondition();

  if (phase === "reveal") {
    return (
      <main className="relative z-10 min-h-screen px-4 py-10 max-w-4xl mx-auto">
        <h1 className="font-display text-2xl mb-2 text-moon">Pembagian Role</h1>
        <p className="text-sm text-moon/60 mb-6">
          Serahkan HP secara bergiliran. Klik nama pemain untuk melihat role mereka, lalu tutup sebelum lanjut ke pemain berikutnya.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {players.map((p) => (
            <PlayerCard key={p.id} player={p} onClick={() => setRevealedPlayer(p)} />
          ))}
        </div>
        <button
          onClick={() => useGameStore.getState().goToPhase("night")}
          className="btn-primary w-full py-4 rounded-xl font-display text-lg"
        >
          Semua Sudah Lihat Role — Mulai Malam Pertama
        </button>
        <RoleModal player={revealedPlayer} onClose={() => setRevealedPlayer(null)} />
      </main>
    );
  }

  if (projectorMode) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-10 relative z-10">
        <button onClick={() => setProjectorMode(false)} className="absolute top-6 right-6 text-moon/50 text-sm">
          Keluar Mode Projector
        </button>
        <h1 className="font-display text-5xl mb-4 text-moon">Hari ke-{useGameStore.getState().day}</h1>
        <p className="font-display text-3xl text-ember capitalize mb-10">{phase}</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl">
          {players.map((p) => (
            <div key={p.id} className={clsx("p-4 rounded-xl border", p.alive ? "border-emerald-400/30 bg-forest-800/50" : "border-blood/40 bg-forest-950/50 opacity-50")}>
              <p className="font-display text-lg">{p.name}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 py-6 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl text-moon">Panel Moderator</h1>
        <div className="flex gap-2">
          <button onClick={() => setSoundOn((s) => !s)} className="p-2 rounded-lg bg-forest-800 border border-white/10" title="Suara ambience (placeholder)">
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={() => setProjectorMode(true)} className="p-2 rounded-lg bg-forest-800 border border-white/10 flex items-center gap-1 text-xs">
            <Tv className="w-4 h-4" /> Projector
          </button>
        </div>
      </div>

      {win && phase !== "gameover" && (
        <div className="card-panel p-3 mb-4 border-emerald-400/40 text-emerald-300 text-sm">
          Kondisi menang terdeteksi untuk tim <strong className="capitalize">{win}</strong>. Pindah ke fase "Game Over" untuk menutup permainan.
        </div>
      )}

      <div className="mb-4">
        <PhaseControls />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "night", label: "Aksi Malam", icon: Moon },
              { id: "voting", label: "Voting", icon: Vote },
              { id: "log", label: "Log", icon: ScrollText },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as Tab)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 whitespace-nowrap",
                    tab === t.id ? "btn-primary" : "bg-forest-800/50 border border-white/10 text-moon/60"
                  )}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === "dashboard" && <ModeratorDashboard />}
          {tab === "night" && <NightActionsPanel />}
          {tab === "voting" && <VotingPanel />}
          {tab === "log" && <LogPanel />}
        </div>

        <div className="space-y-4">
          <Timer />
          {tab !== "log" && <LogPanel />}
        </div>
      </div>
    </main>
  );
}
