"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { ROLE_DEFINITIONS, ALL_ROLE_IDS, validateRoleConfig, generateDefaultRoleConfig } from "@/lib/roles";
import { Player } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { Plus, Trash2, Shuffle, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function SetupPage() {
  const router = useRouter();
  const { players, setPlayers, roleConfig, setRoleConfig, generateRoles, hydrate } = useGameStore();
  const [names, setNames] = useState<string[]>(players.length ? players.map((p) => p.name) : ["", "", "", ""]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const addPlayerField = () => setNames([...names, ""]);
  const removePlayerField = (idx: number) => setNames(names.filter((_, i) => i !== idx));
  const updateName = (idx: number, value: string) => {
    const copy = [...names];
    copy[idx] = value;
    setNames(copy);
  };

  const validNames = names.map((n) => n.trim()).filter(Boolean);
  const hasDuplicate = new Set(validNames.map((n) => n.toLowerCase())).size !== validNames.length;

  const handleConfirmPlayers = () => {
    if (validNames.length < 8) {
      toast.error("Minimal 8 pemain dibutuhkan untuk balancing role yang baik.");
      return;
    }
    if (hasDuplicate) {
      toast.error("Ada nama pemain yang sama. Gunakan nama unik.");
      return;
    }
    const newPlayers: Player[] = validNames.map((name) => ({
      id: uuid(),
      name,
      roleId: null,
      alive: true,
    }));
    setPlayers(newPlayers);
    setRoleConfig(generateDefaultRoleConfig(newPlayers.length));
    toast.success(`${newPlayers.length} pemain disimpan.`);
  };

  const updateRoleCount = (roleId: string, count: number) => {
    const updated = roleConfig.map((rc) =>
      rc.roleId === roleId ? { ...rc, count: Math.max(0, count), enabled: count > 0 } : rc
    );
    setRoleConfig(updated);
  };

  const toggleRole = (roleId: string) => {
    const updated = roleConfig.map((rc) =>
      rc.roleId === roleId ? { ...rc, enabled: !rc.enabled, count: !rc.enabled ? Math.max(1, rc.count) : 0 } : rc
    );
    setRoleConfig(updated);
  };

  const validation = validateRoleConfig(roleConfig, players.length);

  const handleGenerate = () => {
    const result = generateRoles();
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Role berhasil dibagikan secara acak!");
    router.push("/game");
  };

  return (
    <main className="relative z-10 min-h-screen px-4 py-10 md:px-10 max-w-5xl mx-auto">
      <button onClick={() => router.push("/")} className="flex items-center gap-1 text-moon/60 hover:text-moon text-sm mb-6">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <h1 className="font-display text-3xl text-moon mb-2">Setup Permainan</h1>
      <p className="text-moon/60 text-sm mb-8">Masukkan nama pemain, lalu atur konfigurasi role.</p>

      {/* PLAYERS */}
      <section className="card-panel p-5 mb-8">
        <h2 className="font-display text-xl mb-4 text-ember">1. Daftar Pemain ({validNames.length})</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {names.map((name, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={name}
                onChange={(e) => updateName(idx, e.target.value)}
                placeholder={`Nama pemain ${idx + 1}`}
                className="flex-1 bg-forest-800/70 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-moon-glow"
              />
              <button
                onClick={() => removePlayerField(idx)}
                className="px-2 rounded-lg bg-blood/20 text-blood hover:bg-blood/30"
                aria-label="Hapus pemain"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={addPlayerField} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Tambah Pemain
          </button>
          <button onClick={handleConfirmPlayers} className="btn-primary px-4 py-2 rounded-lg text-sm">
            Simpan Daftar Pemain
          </button>
        </div>
        {hasDuplicate && <p className="text-blood text-xs mt-2">Ada nama yang duplikat.</p>}
      </section>

      {/* ROLES */}
      <section className="card-panel p-5 mb-8">
        <h2 className="font-display text-xl mb-1 text-ember">2. Konfigurasi Role</h2>
        <p className="text-xs text-moon/50 mb-4">
          Total role harus sama dengan jumlah pemain ({players.length}). Saat ini: {roleConfig.reduce((s, c) => s + (c.enabled ? c.count : 0), 0)}.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {ALL_ROLE_IDS.map((id) => {
            const def = ROLE_DEFINITIONS[id];
            const rc = roleConfig.find((c) => c.roleId === id)!;
            return (
              <div key={id} className={`rounded-lg border p-3 transition ${rc.enabled ? "border-ember/40 bg-forest-800/60" : "border-white/5 bg-forest-900/40"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium text-sm ${def.color}`}>{def.name}</span>
                  <input type="checkbox" checked={rc.enabled} onChange={() => toggleRole(id)} className="accent-ember" />
                </div>
                <p className="text-[11px] text-moon/50 mb-2 line-clamp-2">{def.description}</p>
                {rc.enabled && (
                  <input
                    type="number"
                    min={1}
                    max={def.unique ? 1 : 10}
                    value={rc.count}
                    onChange={(e) => updateRoleCount(id, parseInt(e.target.value) || 0)}
                    className="w-full bg-forest-900/70 border border-white/10 rounded px-2 py-1 text-xs"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm">
          <span className={validation.valid ? "text-emerald-400" : "text-blood"}>{validation.message}</span>
        </div>
      </section>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={!validation.valid}
        className="btn-primary w-full py-4 rounded-xl font-display text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Shuffle className="w-5 h-5" /> Generate &amp; Bagikan Role
      </motion.button>
    </main>
  );
}
