export type RoleId =
  | "werewolf"
  | "alpha_wolf"
  | "wolf_cub"
  | "minion"
  | "villager"
  | "doctor"
  | "seer"
  | "hunter"
  | "cupid"
  | "witch"
  | "bodyguard"
  | "mayor"
  | "little_girl"
  | "tanner"
  | "serial_killer"
  | "guardian_angel"
  | "medium"
  | "diseased"
  | "prince"
  | "fool";

export type Team = "village" | "werewolf" | "neutral";

export interface RoleDefinition {
  id: RoleId;
  name: string;
  team: Team;
  description: string;
  winCondition: string;
  nightAction: string | null; // description of night action, null = no night action
  hasNightAction: boolean;
  icon: string; // lucide icon name, resolved in UI
  defaultCount: number; // default suggested count relative to player pool (0 = scales manually)
  unique?: boolean; // only 1 in game
  color: string; // tailwind text color class
}

export interface Player {
  id: string;
  name: string;
  roleId: RoleId | null;
  alive: boolean;
  isMayor?: boolean;
  inLove?: string; // id of paired player (Cupid)
  hasUsedAbility?: boolean; // e.g. hunter shot, witch potions tracked separately
  notes?: string;
}

export interface RoleConfig {
  roleId: RoleId;
  enabled: boolean;
  count: number;
}

export type Phase =
  | "lobby"
  | "setup"
  | "reveal"
  | "night"
  | "day"
  | "voting"
  | "execution"
  | "gameover";

export interface LogEntry {
  id: string;
  day: number;
  phase: Phase;
  timestamp: number;
  message: string;
}

export interface WitchPotions {
  hasHeal: boolean;
  hasPoison: boolean;
}

export interface NightActions {
  werewolfTarget?: string | null;
  doctorTarget?: string | null;
  seerTarget?: string | null;
  bodyguardTarget?: string | null;
  witchHealTarget?: string | null;
  witchPoisonTarget?: string | null;
  serialKillerTarget?: string | null;
  guardianAngelTarget?: string | null;
  cupidPair?: [string, string] | null;
}

export interface VoteState {
  votes: Record<string, string>; // voterId -> targetId
  isOpen: boolean;
}

export interface GameHistoryEntry {
  id: string;
  finishedAt: number;
  winner: Team | null;
  days: number;
  durationMs: number;
  players: Player[];
}

export interface GameState {
  phase: Phase;
  day: number;
  players: Player[];
  roleConfig: RoleConfig[];
  nightActions: NightActions;
  witchPotions: WitchPotions;
  voteState: VoteState;
  log: LogEntry[];
  moderatorNotes: string;
  gameStartedAt: number | null;
  winner: Team | null;
}
