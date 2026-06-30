"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { ROLE_DEFINITIONS } from "@/lib/roles";
import { formatDuration } from "@/lib/utils";
import { ChevronLeft, Trophy, Download, Users } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { history, hydrate } = useGameStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `werewolf-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative z-10 min-h-screen px-4 py-10 md:px-10 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-moon/60 hover:text-moon text-sm mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-moon">Riwayat Permainan</h1>
        {history.length > 0 && (
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-forest-800 border border-white/10 hover:border-white/30"
          >
            <Download className="w-4 h-4" /> Export Semua (JSON)
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card-panel p-8 text-center text-moon/50">
          Belum ada permainan yang selesai. Riwayat akan muncul di sini setiap kali kamu menyelesaikan sebuah game (fase Game Over).
        </div>
      ) : (
        <div className="space-y-4">
          {history
            .slice()
            .reverse()
            .map((entry: any, idx: number) => (
              <div key={entry.id ?? idx} className="card-panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="font-display text-lg text-moon">
                      Pemenang: <span className="text-ember capitalize">{entry.winner ?? "—"}</span>
                    </span>
                  </div>
                  <span className="text-xs text-moon/50">
                    {new Date(entry.finishedAt).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-moon/70 mb-3">
                  <span>Hari bermain: {entry.days}</span>
                  <span>Durasi: {formatDuration(entry.durationMs ?? 0)}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {entry.players?.length ?? 0} pemain
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {entry.players?.map((p: any) => {
                    const def = p.roleId ? ROLE_DEFINITIONS[p.roleId as keyof typeof ROLE_DEFINITIONS] : null;
                    return (
                      <div
                        key={p.id}
                        className={`text-xs px-2 py-1.5 rounded-lg border flex justify-between ${
                          p.alive ? "border-emerald-400/20 bg-forest-800/40" : "border-blood/20 bg-forest-950/40 opacity-70"
                        }`}
                      >
                        <span>{p.name}</span>
                        <span className={def?.color}>{def?.name ?? "-"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
