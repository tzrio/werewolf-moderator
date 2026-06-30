"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import PlayerCard from "./PlayerCard";
import { getRandomNarration } from "@/lib/narration";
import toast from "react-hot-toast";

export default function VotingPanel() {
  const { players, voteState, castVote, resetVotes, resolveVoting, executePlayer, addLog } = useGameStore();
  const alive = players.filter((p) => p.alive);
  const [activeVoter, setActiveVoter] = useState<string | null>(null);
  const [tieMode, setTieMode] = useState(false);

  const tally: Record<string, number> = {};
  Object.entries(voteState.votes).forEach(([voterId, targetId]) => {
    const voter = players.find((p) => p.id === voterId);
    const weight = voter?.isMayor ? 2 : 1;
    tally[targetId] = (tally[targetId] ?? 0) + weight;
  });

  const handleResolve = () => {
    const result = resolveVoting();
    if (result.tie) {
      setTieMode(true);
      toast.error(getRandomNarration("voteTie"));
    } else if (result.topPlayers.length === 1) {
      setTieMode(false);
      const target = players.find((p) => p.id === result.topPlayers[0]);
      addLog(getRandomNarration("executionAnnounce", { name: target?.name ?? "" }));
      toast(getRandomNarration("executionAnnounce", { name: target?.name ?? "" }), { duration: 5000 });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs italic text-moon/50">"{getRandomNarration("votingStart")}"</p>

      <div className="card-panel p-4">
        <h3 className="font-display text-lg mb-3 text-ember">1. Pilih Voter</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alive.map((p) => (
            <PlayerCard key={p.id} player={p} selected={activeVoter === p.id} onClick={() => setActiveVoter(p.id)} />
          ))}
        </div>
      </div>

      <div className="card-panel p-4">
        <h3 className="font-display text-lg mb-3 text-ember">2. Pilih Target Suara {activeVoter && `(untuk ${players.find(p=>p.id===activeVoter)?.name})`}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alive.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              voteCount={tally[p.id]}
              disabled={!activeVoter}
              onClick={() => {
                if (!activeVoter) {
                  toast.error("Pilih voter terlebih dahulu.");
                  return;
                }
                castVote(activeVoter, p.id);
                setActiveVoter(null);
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={handleResolve} className="btn-primary px-4 py-2 rounded-lg text-sm">
          Hitung Suara
        </button>
        <button onClick={resetVotes} className="px-4 py-2 rounded-lg text-sm bg-forest-800 border border-white/10">
          Reset Voting
        </button>
      </div>

      {tieMode && (
        <div className="card-panel p-4 border-blood/40">
          <p className="text-sm text-blood mb-2">{getRandomNarration("voteTie")}</p>
          <button onClick={resetVotes} className="px-4 py-2 rounded-lg text-sm bg-forest-800 border border-white/10">
            Voting Ulang
          </button>
        </div>
      )}

      <div className="card-panel p-4">
        <h3 className="font-display text-lg mb-3 text-blood">3. Eksekusi Manual</h3>
        <p className="text-xs text-moon/50 mb-2">Moderator bisa langsung menetapkan siapa yang dieksekusi, termasuk jika seri.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alive.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              onClick={() => {
                executePlayer(p.id);
                addLog(getRandomNarration("executionAnnounce", { name: p.name }));
                setTieMode(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
