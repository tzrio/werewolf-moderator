"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, BookOpen, Info, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Moon className="w-16 h-16 text-moon-glow animate-flicker" strokeWidth={1.2} />
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-wide text-moon">
          Werewolf <span className="text-ember">Moderator</span>
        </h1>
        <p className="max-w-md text-sm md:text-base text-moon/70">
          Asisten digital untuk memandu permainan Werewolf bersama 12–20 pemain.
          Kamu tetap jadi Moderator — website ini hanya membantu membagikan
          peran, mengatur fase malam &amp; siang, dan mencatat semuanya.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/setup"
          className="btn-primary px-8 py-4 rounded-xl font-display text-lg shadow-glow"
        >
          Start Game
        </Link>
        <Link
          href="/history"
          className="px-8 py-4 rounded-xl font-display text-lg border border-white/15 hover:border-white/30 text-moon/80"
        >
          Riwayat
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-14 grid gap-4 max-w-2xl w-full sm:grid-cols-2"
      >
        <div className="card-panel p-5 text-left">
          <div className="flex items-center gap-2 mb-2 text-ember">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-display">Cara Bermain</h3>
          </div>
          <p className="text-sm text-moon/70">
            1) Masukkan nama pemain. 2) Atur role &amp; jumlahnya. 3) Generate role
            secara acak. 4) Bagikan HP ke tiap pemain untuk lihat role mereka
            sendiri. 5) Moderator memimpin fase Malam → Siang → Voting →
            Eksekusi sampai permainan selesai.
          </p>
        </div>
        <div className="card-panel p-5 text-left">
          <div className="flex items-center gap-2 mb-2 text-ember">
            <Info className="w-5 h-5" />
            <h3 className="font-display">Tentang</h3>
          </div>
          <p className="text-sm text-moon/70">
            Website ini bukan game otomatis. Moderator (kamu) tetap memegang
            kendali penuh atas cerita, tempo, dan keputusan akhir. Semua data
            tersimpan otomatis di browser kamu — tidak ada server, tidak ada
            login.
          </p>
        </div>
      </motion.div>

      <footer className="mt-16 text-xs text-moon/40 flex items-center gap-2">
        <span>Werewolf Moderator &copy; {new Date().getFullYear()}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Github className="w-3 h-3" /> Built for offline &amp; voice-call game nights
        </span>
      </footer>
    </main>
  );
}
