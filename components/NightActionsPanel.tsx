"use client";

import { useGameStore } from "@/lib/store";
import { ROLE_DEFINITIONS } from "@/lib/roles";
import { RoleId } from "@/lib/types";
import PlayerCard from "./PlayerCard";
import { getRandomNarration } from "@/lib/narration";
import toast from "react-hot-toast";

export default function NightActionsPanel() {
  const { players, nightActions, setNightAction, witchPotions, addLog } = useGameStore();
  const alive = players.filter((p) => p.alive);

  const hasRole = (id: string) => players.some((p) => p.roleId === id && p.alive);

  const select = (key: keyof typeof nightActions, playerId: string, label: string) => {
    setNightAction(key, playerId as any);
    const target = players.find((p) => p.id === playerId);
    addLog(`${label}: ${target?.name}`);
    toast.success(`${label} dipilih.`);
  };

  const Section = ({
    title,
    roleId,
    actionKey,
    narration,
  }: {
    title: string;
    roleId: string;
    actionKey: keyof typeof nightActions;
    narration: string;
  }) => {
    if (!hasRole(roleId)) return null;
    return (
      <div className="card-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-display text-lg ${ROLE_DEFINITIONS[roleId as RoleId].color}`}>{title}</h3>
        </div>
        <p className="text-xs text-moon/50 italic mb-3">"{narration}"</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alive.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              selected={(nightActions as any)[actionKey] === p.id}
              onClick={() => select(actionKey, p.id, title)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Section title="Werewolf — pilih mangsa" roleId="werewolf" actionKey="werewolfTarget" narration={getRandomNarration("werewolfWake")} />
      <Section title="Doctor — pilih yang diselamatkan" roleId="doctor" actionKey="doctorTarget" narration={getRandomNarration("doctorWake")} />
      <Section title="Seer — pilih yang diintip" roleId="seer" actionKey="seerTarget" narration={getRandomNarration("seerWake")} />
      <Section title="Bodyguard — pilih yang dilindungi" roleId="bodyguard" actionKey="bodyguardTarget" narration={getRandomNarration("bodyguardWake")} />
      <Section title="Serial Killer — pilih korban" roleId="serial_killer" actionKey="serialKillerTarget" narration="Pembunuh berantai mencari mangsa malam ini." />
      <Section title="Guardian Angel — pilih yang dijaga" roleId="guardian_angel" actionKey="guardianAngelTarget" narration="Sang penjaga tak terlihat menjaga seseorang." />

      {hasRole("witch") && (
        <div className="card-panel p-4">
          <h3 className="font-display text-lg text-violet-300 mb-2">Witch — ramuan</h3>
          <p className="text-xs text-moon/50 italic mb-3">"{getRandomNarration("witchWake")}"</p>
          <p className="text-xs mb-2 text-moon/60">
            Heal: {witchPotions.hasHeal ? "tersedia" : "sudah dipakai"} • Poison: {witchPotions.hasPoison ? "tersedia" : "sudah dipakai"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {alive.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                disabled={!witchPotions.hasHeal}
                selected={nightActions.witchHealTarget === p.id}
                onClick={() => select("witchHealTarget", p.id, "Witch menyembuhkan")}
              />
            ))}
          </div>
          <p className="text-xs text-moon/40 mb-1">Pilih untuk heal di atas, atau racun di bawah:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {alive.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                disabled={!witchPotions.hasPoison}
                selected={nightActions.witchPoisonTarget === p.id}
                onClick={() => select("witchPoisonTarget", p.id, "Witch meracuni")}
              />
            ))}
          </div>
        </div>
      )}

      {hasRole("cupid") && (
        <div className="card-panel p-4">
          <h3 className="font-display text-lg text-pink-300 mb-2">Cupid — pasangkan dua hati (malam 1)</h3>
          <p className="text-xs text-moon/50 italic mb-3">"{getRandomNarration("cupidWake")}"</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {alive.map((p) => {
              const pair = nightActions.cupidPair;
              const isSelected = pair?.includes(p.id);
              return (
                <PlayerCard
                  key={p.id}
                  player={p}
                  selected={isSelected}
                  onClick={() => {
                    const current: string[] = nightActions.cupidPair ? [...nightActions.cupidPair] : [];
                    if (current.includes(p.id)) {
                      setNightAction("cupidPair", current.filter((id) => id !== p.id) as any);
                    } else if (current.length < 2) {
                      setNightAction("cupidPair", [...current, p.id] as any);
                    } else {
                      toast.error("Sudah 2 pasangan dipilih. Klik salah satu untuk mengganti.");
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
