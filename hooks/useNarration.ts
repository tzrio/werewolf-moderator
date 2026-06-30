"use client";
import { useCallback, useState } from "react";
import { getRandomNarration, NarrationCategory } from "@/lib/narration";

/**
 * Hook untuk mengambil dan menampilkan baris narasi otomatis terbaru
 * di panel moderator (lihat NarrationBar component).
 */
export function useNarration() {
  const [currentLine, setCurrentLine] = useState<string>(
    "Selamat datang, Moderator. Mulai permainan untuk mendengar narasi pertama."
  );

  const say = useCallback((key: NarrationCategory, replacements?: Record<string, string>) => {
    const line = getRandomNarration(key, replacements);
    setCurrentLine(line);
    return line;
  }, []);

  return { currentLine, say };
}
