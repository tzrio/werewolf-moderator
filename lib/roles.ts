import { RoleDefinition, RoleId, RoleConfig } from "./types";

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  werewolf: {
    id: "werewolf",
    name: "Werewolf",
    team: "werewolf",
    description:
      "Setiap malam, kamu dan sesama Werewolf memilih satu warga untuk diterkam. Berpura-puralah jadi warga biasa di siang hari.",
    winCondition: "Werewolf menang jika jumlah Werewolf sama atau lebih banyak dari warga yang masih hidup.",
    nightAction: "Pilih satu pemain untuk diserang bersama sesama Werewolf.",
    hasNightAction: true,
    icon: "Moon",
    defaultCount: 0,
    color: "text-red-400",
  },
  alpha_wolf: {
    id: "alpha_wolf",
    name: "Alpha Wolf",
    team: "werewolf",
    description: "Pemimpin kawanan Werewolf. Sekali per permainan bisa mengubah satu warga menjadi Wolf Cub baru jika Wolf Cub mati.",
    winCondition: "Sama seperti Werewolf: menang jika kawanan menyamai atau melebihi jumlah warga hidup.",
    nightAction: "Memimpin pemilihan target bersama kawanan, bisa merekrut pengganti.",
    hasNightAction: true,
    icon: "Crown",
    defaultCount: 1,
    color: "text-red-500",
  },
  wolf_cub: {
    id: "wolf_cub",
    name: "Wolf Cub",
    team: "werewolf",
    description: "Werewolf muda. Jika Wolf Cub mati, kawanan Werewolf mendapat dua korban pada malam berikutnya sebagai balas dendam.",
    winCondition: "Sama seperti Werewolf.",
    nightAction: "Ikut memilih target bersama kawanan Werewolf.",
    hasNightAction: true,
    icon: "PawPrint",
    defaultCount: 1,
    color: "text-red-400",
  },
  minion: {
    id: "minion",
    name: "Minion",
    team: "werewolf",
    description: "Kamu tahu siapa para Werewolf, namun mereka tidak mengenalmu. Kamu tidak bisa membunuh, tetapi bisa menyesatkan warga.",
    winCondition: "Menang bersama Werewolf jika kawanan menang.",
    nightAction: "Melihat identitas seluruh Werewolf di malam pertama.",
    hasNightAction: true,
    icon: "EyeOff",
    defaultCount: 1,
    color: "text-red-300",
  },
  villager: {
    id: "villager",
    name: "Villager",
    team: "village",
    description: "Warga biasa tanpa kekuatan khusus. Andalkan logika dan kejelian saat diskusi siang hari.",
    winCondition: "Menang jika seluruh Werewolf berhasil disingkirkan dari desa.",
    nightAction: null,
    hasNightAction: false,
    icon: "User",
    defaultCount: 0,
    color: "text-moon",
  },
  doctor: {
    id: "doctor",
    name: "Doctor",
    team: "village",
    description: "Setiap malam, pilih satu pemain (boleh diri sendiri) untuk diselamatkan dari serangan Werewolf.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Pilih satu pemain untuk diselamatkan malam ini.",
    hasNightAction: true,
    icon: "Stethoscope",
    defaultCount: 1,
    unique: true,
    color: "text-emerald-300",
  },
  seer: {
    id: "seer",
    name: "Seer",
    team: "village",
    description: "Setiap malam, pilih satu pemain untuk diketahui identitas timnya (Werewolf atau bukan).",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Pilih satu pemain untuk diintip jati dirinya.",
    hasNightAction: true,
    icon: "Eye",
    defaultCount: 1,
    unique: true,
    color: "text-sky-300",
  },
  hunter: {
    id: "hunter",
    name: "Hunter",
    team: "village",
    description: "Jika kamu mati (dibunuh atau dieksekusi), kamu boleh langsung menembak satu pemain lain untuk ikut mati.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Tidak ada aksi malam rutin, hanya aktif saat Hunter mati.",
    hasNightAction: false,
    icon: "Target",
    defaultCount: 1,
    unique: true,
    color: "text-amber-300",
  },
  cupid: {
    id: "cupid",
    name: "Cupid",
    team: "village",
    description: "Pada malam pertama, pasangkan dua pemain menjadi sepasang kekasih. Jika salah satu mati, yang lain ikut mati karena patah hati.",
    winCondition: "Menang bersama tim aslinya, kecuali kedua kekasih membentuk tim baru jika berasal dari tim berbeda.",
    nightAction: "Pilih dua pemain untuk dijadikan pasangan kekasih (hanya malam pertama).",
    hasNightAction: true,
    icon: "Heart",
    defaultCount: 1,
    unique: true,
    color: "text-pink-300",
  },
  witch: {
    id: "witch",
    name: "Witch",
    team: "village",
    description: "Memiliki satu ramuan penyembuh dan satu ramuan racun, masing-masing hanya bisa dipakai sekali sepanjang permainan.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Boleh menyembuhkan korban Werewolf malam ini, dan/atau meracuni satu pemain.",
    hasNightAction: true,
    icon: "FlaskConical",
    defaultCount: 1,
    unique: true,
    color: "text-violet-300",
  },
  bodyguard: {
    id: "bodyguard",
    name: "Bodyguard",
    team: "village",
    description: "Setiap malam, lindungi satu pemain. Jika Werewolf menyerang pemain itu, Bodyguard yang akan mati menggantikannya.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Pilih satu pemain untuk dilindungi malam ini.",
    hasNightAction: true,
    icon: "Shield",
    defaultCount: 1,
    unique: true,
    color: "text-blue-300",
  },
  mayor: {
    id: "mayor",
    name: "Mayor",
    team: "village",
    description: "Suara Mayor saat voting dihitung dua kali. Mayor dipilih warga di awal permainan atau ditentukan moderator.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: null,
    hasNightAction: false,
    icon: "Landmark",
    defaultCount: 1,
    unique: true,
    color: "text-yellow-300",
  },
  little_girl: {
    id: "little_girl",
    name: "Little Girl",
    team: "village",
    description: "Boleh mengintip diam-diam saat Werewolf berunding di malam hari, namun berisiko tertangkap jika terlalu berani.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Boleh mengintip pertemuan Werewolf (diceritakan moderator).",
    hasNightAction: true,
    icon: "Sparkles",
    defaultCount: 1,
    unique: true,
    color: "text-fuchsia-300",
  },
  tanner: {
    id: "tanner",
    name: "Tanner",
    team: "neutral",
    description: "Penyamak kulit yang ingin mati. Kamu hanya menang jika dieksekusi oleh warga melalui voting siang.",
    winCondition: "Menang sendirian jika berhasil dieksekusi oleh voting warga.",
    nightAction: null,
    hasNightAction: false,
    icon: "Skull",
    defaultCount: 1,
    unique: true,
    color: "text-stone-300",
  },
  serial_killer: {
    id: "serial_killer",
    name: "Serial Killer",
    team: "neutral",
    description: "Pembunuh berantai yang bekerja sendiri. Setiap malam membunuh satu pemain, kebal dari kemampuan membunuh lainnya.",
    winCondition: "Menang jika menjadi satu-satunya pemain atau kelompok yang tersisa.",
    nightAction: "Pilih satu pemain untuk dibunuh malam ini.",
    hasNightAction: true,
    icon: "Knife",
    defaultCount: 1,
    unique: true,
    color: "text-orange-400",
  },
  guardian_angel: {
    id: "guardian_angel",
    name: "Guardian Angel",
    team: "village",
    description: "Diam-diam menjaga satu pemain sepanjang permainan tanpa diketahui siapa pun, termasuk Bodyguard dan Doctor.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Pilih satu pemain untuk dijaga malam ini.",
    hasNightAction: true,
    icon: "Feather",
    defaultCount: 1,
    unique: true,
    color: "text-cyan-300",
  },
  medium: {
    id: "medium",
    name: "Medium",
    team: "village",
    description: "Dapat berbicara dengan satu pemain yang sudah mati setiap malam untuk mendapat petunjuk dari moderator.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: "Pilih satu pemain yang sudah mati untuk diajak 'berbicara'.",
    hasNightAction: true,
    icon: "Ghost",
    defaultCount: 1,
    unique: true,
    color: "text-indigo-300",
  },
  diseased: {
    id: "diseased",
    name: "Diseases",
    team: "village",
    description: "Membawa penyakit menular. Jika Werewolf menyerangmu, mereka tertular dan tidak bisa menyerang di malam berikutnya.",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: null,
    hasNightAction: false,
    icon: "Bug",
    defaultCount: 1,
    unique: true,
    color: "text-lime-300",
  },
  prince: {
    id: "prince",
    name: "Prince",
    team: "village",
    description: "Identitasmu terlindungi: kamu tidak bisa dieksekusi oleh hasil voting siang (hanya bisa mati di malam hari).",
    winCondition: "Menang bersama warga jika seluruh Werewolf disingkirkan.",
    nightAction: null,
    hasNightAction: false,
    icon: "Gem",
    defaultCount: 1,
    unique: true,
    color: "text-purple-300",
  },
  fool: {
    id: "fool",
    name: "Fool",
    team: "neutral",
    description: "Si Bodoh yang sebenarnya menang jika dieksekusi oleh warga, mirip Tanner namun dengan kedok role village biasa.",
    winCondition: "Menang sendirian jika berhasil dieksekusi oleh voting warga.",
    nightAction: null,
    hasNightAction: false,
    icon: "Drama",
    defaultCount: 1,
    unique: true,
    color: "text-teal-300",
  },
};

export const ALL_ROLE_IDS = Object.keys(ROLE_DEFINITIONS) as RoleId[];

// Default role config generator based on player count.
// Simple, transparent balancing heuristic: ~1 werewolf per 4 players, key unique roles added if room allows.
export function generateDefaultRoleConfig(playerCount: number): RoleConfig[] {
  const wolfCount = Math.max(1, Math.round(playerCount / 4));
  const uniqueRolesOrder: RoleId[] = [
    "seer",
    "doctor",
    "hunter",
    "witch",
    "bodyguard",
    "cupid",
  ];

  const config: RoleConfig[] = ALL_ROLE_IDS.map((id) => ({
    roleId: id,
    enabled: false,
    count: 0,
  }));

  const setRole = (id: RoleId, count: number) => {
    const r = config.find((c) => c.roleId === id)!;
    r.enabled = count > 0;
    r.count = count;
  };

  setRole("werewolf", wolfCount);

  let remaining = playerCount - wolfCount;
  let uniqueBudget = Math.min(uniqueRolesOrder.length, Math.max(1, Math.floor(playerCount / 3)));

  for (let i = 0; i < uniqueBudget && remaining > 1; i++) {
    setRole(uniqueRolesOrder[i], 1);
    remaining -= 1;
  }

  setRole("villager", Math.max(0, remaining));

  return config;
}

// Validates total role count matches player count, and unique roles aren't duplicated improperly.
export function validateRoleConfig(
  config: RoleConfig[],
  playerCount: number
): { valid: boolean; message: string; total: number } {
  const enabled = config.filter((c) => c.enabled && c.count > 0);
  const total = enabled.reduce((sum, c) => sum + c.count, 0);

  for (const c of enabled) {
    const def = ROLE_DEFINITIONS[c.roleId];
    if (def.unique && c.count > 1) {
      return {
        valid: false,
        message: `${def.name} adalah role unik dan hanya boleh berjumlah 1.`,
        total,
      };
    }
  }

  const wolfTeamCount = enabled
    .filter((c) => ROLE_DEFINITIONS[c.roleId].team === "werewolf")
    .reduce((s, c) => s + c.count, 0);

  if (wolfTeamCount < 1) {
    return { valid: false, message: "Harus ada minimal 1 role dari tim Werewolf.", total };
  }

  if (total !== playerCount) {
    return {
      valid: false,
      message: `Total role (${total}) tidak sama dengan jumlah pemain (${playerCount}). Sesuaikan jumlah Villager atau role lain.`,
      total,
    };
  }

  return { valid: true, message: "Konfigurasi role seimbang.", total };
}

export const PLAYER_PRESETS: Record<number, RoleConfig[]> = Object.fromEntries(
  [8, 10, 12, 14, 16, 18, 20].map((n) => [n, generateDefaultRoleConfig(n)])
);
