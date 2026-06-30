"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ROLE_DEFINITIONS } from "@/lib/roles";
import { Player } from "@/lib/types";

interface Props {
  player: Player | null;
  onClose: () => void;
}

export default function RoleModal({ player, onClose }: Props) {
  const def = player?.roleId ? ROLE_DEFINITIONS[player.roleId] : null;

  return (
    <AnimatePresence>
      {player && def && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="card-panel max-w-sm w-full p-6 relative"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-moon/50 hover:text-moon">
              <X className="w-5 h-5" />
            </button>
            <p className="text-xs text-moon/50 mb-1">Peran untuk</p>
            <h2 className="font-display text-2xl mb-3 text-moon">{player.name}</h2>
            <div className={`font-display text-3xl mb-4 ${def.color}`}>{def.name}</div>
            <div className="space-y-3 text-sm text-moon/80">
              <p>{def.description}</p>
              <p>
                <span className="text-ember font-medium">Cara Menang: </span>
                {def.winCondition}
              </p>
              {def.hasNightAction && (
                <p>
                  <span className="text-ember font-medium">Aksi Malam: </span>
                  {def.nightAction}
                </p>
              )}
            </div>
            <p className="mt-5 text-[11px] text-moon/40">
              Tutup ini sebelum menyerahkan HP ke pemain berikutnya. Moderator bisa membuka ulang lewat panel.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
