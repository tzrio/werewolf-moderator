"use client";

import { Player } from "@/lib/types";
import { ROLE_DEFINITIONS } from "@/lib/roles";
import { Skull, Crown } from "lucide-react";
import clsx from "clsx";

interface Props {
  player: Player;
  onClick?: () => void;
  selected?: boolean;
  showRole?: boolean;
  voteCount?: number;
  disabled?: boolean;
}

export default function PlayerCard({ player, onClick, selected, showRole, voteCount, disabled }: Props) {
  const def = player.roleId ? ROLE_DEFINITIONS[player.roleId] : null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "relative rounded-xl p-3 text-left border transition w-full",
        player.alive ? "bg-forest-800/60" : "bg-forest-950/60 opacity-50",
        selected ? "border-ember shadow-glow" : "border-white/10",
        !disabled && "hover:border-moon-glow/40 cursor-pointer",
        disabled && "cursor-not-allowed"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm flex items-center gap-1">
          {player.isMayor && <Crown className="w-3.5 h-3.5 text-yellow-300" />}
          {player.name}
        </span>
        {!player.alive && <Skull className="w-4 h-4 text-blood" />}
      </div>
      {showRole && def && <span className={clsx("text-xs", def.color)}>{def.name}</span>}
      {typeof voteCount === "number" && voteCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blood text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {voteCount}
        </span>
      )}
    </button>
  );
}
