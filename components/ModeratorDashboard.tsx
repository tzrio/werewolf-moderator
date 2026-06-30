"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { ROLE_DEFINITIONS } from "@/lib/roles";
import RoleModal from "./RoleModal";
import { Player } from "@/lib/types";
import { Skull, RotateCcw, Crown } from "lucide-react";

export default function ModeratorDashboard() {
  const { players, killPlayer, revivePlayer, setMayor, moderatorNotes, setModeratorNotes } = useGameStore();
  const [revealedPlayer, setRevealedPlayer] = useState<Player | null>(null);

  const alive = players.filter((p) => p.alive);
  const dead = players.filter((p) => !p.alive);

  return (
    <div className="space-y-4">
      <div className="card-panel p-4">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-emerald-300">Hidup: {alive.length}</span>
          <span className="text-blood">Mati: {dead.length}</span>
          <span className="text-moon/60">Total: {players.length}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {players.map((p) => {
            const def = p.roleId ? ROLE_DEFINITIONS[p.roleId] : null;
            return (
              <div key={p.id} className={`rounded-lg p-3 border flex flex-col gap-1 ${p.alive ? "border-white/10 bg-forest-800/60" : "border-blood/30 bg-forest-950/60 opacity-60"}`}>
                <div className="flex items-center justify-between">
                  <button onClick={() => setRevealedPlayer(p)} className="font-medium text-sm flex items-center gap-1 hover:text-ember">
                    {p.isMayor && <Crown className="w-3.5 h-3.5 text-yellow-300" />}
                    {p.name}
                  </button>
                  <span className={`text-xs ${def?.color}`}>{def?.name}</span>
                </div>
                <div className="flex gap-2 mt-1">
                  {p.alive ? (
                    <button onClick={() => killPlayer(p.id, "Moderator")} className="text-xs flex items-center gap-1 text-blood hover:underline">
                      <Skull className="w-3 h-3" /> Matikan
                    </button>
                  ) : (
                    <button onClick={() => revivePlayer(p.id)} className="text-xs flex items-center gap-1 text-emerald-300 hover:underline">
                      <RotateCcw className="w-3 h-3" /> Hidupkan
                    </button>
                  )}
                  <button onClick={() => setMayor(p.id)} className="text-xs flex items-center gap-1 text-yellow-300 hover:underline">
                    <Crown className="w-3 h-3" /> Jadikan Mayor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-panel p-4">
        <h3 className="font-display text-lg mb-2 text-ember">Catatan Moderator</h3>
        <textarea
          value={moderatorNotes}
          onChange={(e) => setModeratorNotes(e.target.value)}
          placeholder="Catat strategi, kecurigaan, atau pengingat di sini..."
          className="w-full bg-forest-900/70 border border-white/10 rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-moon-glow"
        />
      </div>

      <RoleModal player={revealedPlayer} onClose={() => setRevealedPlayer(null)} />
    </div>
  );
}
