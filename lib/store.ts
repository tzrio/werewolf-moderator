import { create } from "zustand";
import { v4 as uuid } from "uuid";
import {
  GameState,
  Player,
  RoleConfig,
  Phase,
  LogEntry,
  Team,
  NightActions,
  RoleId,
} from "./types";
import { ROLE_DEFINITIONS, generateDefaultRoleConfig, validateRoleConfig } from "./roles";

const STORAGE_KEY = "werewolf-moderator-state-v1";
const HISTORY_KEY = "werewolf-moderator-history-v1";

interface GameStore extends GameState {
  history: any[];
  pastSnapshots: GameState[]; // for undo
  // setup
  setPlayers: (players: Player[]) => void;
  setRoleConfig: (config: RoleConfig[]) => void;
  resetRoleConfigForCount: (count: number) => void;
  // flow
  generateRoles: () => { ok: boolean; message: string };
  goToPhase: (phase: Phase) => void;
  nextDay: () => void;
  // players
  killPlayer: (id: string, cause?: string) => void;
  revivePlayer: (id: string) => void;
  setMayor: (id: string) => void;
  // night actions
  setNightAction: <K extends keyof NightActions>(key: K, value: NightActions[K]) => void;
  resolveNight: () => { deaths: string[] };
  // voting
  castVote: (voterId: string, targetId: string) => void;
  resetVotes: () => void;
  resolveVoting: () => { tie: boolean; topPlayers: string[] };
  executePlayer: (id: string) => void;
  // witch
  useWitchHeal: (targetId: string) => void;
  useWitchPoison: (targetId: string) => void;
  // log + notes
  addLog: (message: string) => void;
  setModeratorNotes: (text: string) => void;
  // misc
  checkWinCondition: () => Team | null;
  undo: () => void;
  snapshot: () => void;
  saveHistory: () => void;
  resetGame: () => void;
  hydrate: () => void;
}

const initialState: GameState = {
  phase: "lobby",
  day: 0,
  players: [],
  roleConfig: generateDefaultRoleConfig(12),
  nightActions: {},
  witchPotions: { hasHeal: true, hasPoison: true },
  voteState: { votes: {}, isOpen: false },
  log: [],
  moderatorNotes: "",
  gameStartedAt: null,
  winner: null,
};

function persist(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  history: [],
  pastSnapshots: [],

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const hist = window.localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        set({ ...parsed });
      }
      if (hist) {
        set({ history: JSON.parse(hist) });
      }
    } catch {
      /* ignore */
    }
  },

  snapshot: () => {
    const { pastSnapshots, ...rest } = get();
    const clone: GameState = JSON.parse(
      JSON.stringify({
        phase: rest.phase,
        day: rest.day,
        players: rest.players,
        roleConfig: rest.roleConfig,
        nightActions: rest.nightActions,
        witchPotions: rest.witchPotions,
        voteState: rest.voteState,
        log: rest.log,
        moderatorNotes: rest.moderatorNotes,
        gameStartedAt: rest.gameStartedAt,
        winner: rest.winner,
      })
    );
    const newSnaps = [...pastSnapshots.slice(-19), clone]; // keep last 20
    set({ pastSnapshots: newSnaps });
  },

  undo: () => {
    const { pastSnapshots } = get();
    if (pastSnapshots.length === 0) return;
    const last = pastSnapshots[pastSnapshots.length - 1];
    set({ ...last, pastSnapshots: pastSnapshots.slice(0, -1) });
    persist(get());
  },

  setPlayers: (players) => {
    get().snapshot();
    set({ players });
    persist(get());
  },

  setRoleConfig: (config) => {
    set({ roleConfig: config });
    persist(get());
  },

  resetRoleConfigForCount: (count) => {
    set({ roleConfig: generateDefaultRoleConfig(count) });
    persist(get());
  },

  generateRoles: () => {
    const { players, roleConfig } = get();
    const validation = validateRoleConfig(roleConfig, players.length);
    if (!validation.valid) {
      return { ok: false, message: validation.message };
    }
    get().snapshot();

    const pool: RoleId[] = [];
    roleConfig.forEach((rc) => {
      if (rc.enabled) {
        for (let i = 0; i < rc.count; i++) pool.push(rc.roleId);
      }
    });

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const newPlayers: Player[] = players.map((p, idx) => ({
      ...p,
      roleId: pool[idx] ?? null,
      alive: true,
      inLove: undefined,
      hasUsedAbility: false,
    }));

    set({
      players: newPlayers,
      phase: "reveal",
      day: 0,
      log: [
        {
          id: uuid(),
          day: 0,
          phase: "reveal",
          timestamp: Date.now(),
          message: "Role telah dibagikan secara acak ke seluruh pemain.",
        },
      ],
      gameStartedAt: Date.now(),
      winner: null,
      witchPotions: { hasHeal: true, hasPoison: true },
    });
    persist(get());
    return { ok: true, message: "Role berhasil dibagikan." };
  },

  goToPhase: (phase) => {
    get().snapshot();
    set({ phase, nightActions: phase === "night" ? {} : get().nightActions });
    persist(get());
  },

  nextDay: () => {
    set({ day: get().day + 1 });
    persist(get());
  },

  addLog: (message) => {
    const entry: LogEntry = {
      id: uuid(),
      day: get().day,
      phase: get().phase,
      timestamp: Date.now(),
      message,
    };
    set({ log: [...get().log, entry] });
    persist(get());
  },

  killPlayer: (id, cause) => {
    get().snapshot();
    const players = get().players.map((p) => (p.id === id ? { ...p, alive: false } : p));
    set({ players });
    const player = players.find((p) => p.id === id);
    if (player) {
      get().addLog(`${player.name} meninggal dunia.${cause ? ` (${cause})` : ""}`);
      // lover death chain
      if (player.inLove) {
        const lover = players.find((p) => p.id === player.inLove);
        if (lover && lover.alive) {
          const updated = players.map((p) =>
            p.id === lover.id ? { ...p, alive: false } : p
          );
          set({ players: updated });
          get().addLog(`${lover.name} meninggal karena patah hati kehilangan ${player.name}.`);
        }
      }
    }
    persist(get());
  },

  revivePlayer: (id) => {
    get().snapshot();
    const players = get().players.map((p) => (p.id === id ? { ...p, alive: true } : p));
    set({ players });
    persist(get());
  },

  setMayor: (id) => {
    const players = get().players.map((p) => ({ ...p, isMayor: p.id === id }));
    set({ players });
    get().addLog(`${players.find((p) => p.id === id)?.name} ditetapkan sebagai Mayor.`);
    persist(get());
  },

  setNightAction: (key, value) => {
    set({ nightActions: { ...get().nightActions, [key]: value } });
    persist(get());
  },

  resolveNight: () => {
    get().snapshot();
    const { nightActions, players, witchPotions } = get();
    const deaths: string[] = [];

    let wolfTarget = nightActions.werewolfTarget ?? null;
    const doctorTarget = nightActions.doctorTarget ?? null;
    const bodyguardTarget = nightActions.bodyguardTarget ?? null;
    const witchHeal = nightActions.witchHealTarget ?? null;
    const witchPoison = nightActions.witchPoisonTarget ?? null;
    const serialKillerTarget = nightActions.serialKillerTarget ?? null;

    // Cupid pairing (only meaningfully applied night 1, but allow whenever set)
    if (nightActions.cupidPair) {
      const [a, b] = nightActions.cupidPair;
      const updatedPlayers = players.map((p) =>
        p.id === a ? { ...p, inLove: b } : p.id === b ? { ...p, inLove: a } : p
      );
      set({ players: updatedPlayers });
      get().addLog(`Cupid menjadikan ${updatedPlayers.find(p=>p.id===a)?.name} dan ${updatedPlayers.find(p=>p.id===b)?.name} sepasang kekasih.`);
    }

    let saved = false;
    if (wolfTarget && (wolfTarget === doctorTarget || wolfTarget === witchHeal)) {
      saved = true;
    }
    if (wolfTarget && wolfTarget === bodyguardTarget) {
      // bodyguard dies instead
      if (!saved) {
        deaths.push(bodyguardTarget);
        get().killPlayer(bodyguardTarget, "Melindungi target Werewolf");
        wolfTarget = null; // protected target survives
      }
    } else if (wolfTarget && !saved) {
      deaths.push(wolfTarget);
      get().killPlayer(wolfTarget, "Diserang Werewolf");
    } else if (wolfTarget && saved) {
      get().addLog(`Serangan Werewolf terhadap ${players.find((p) => p.id === wolfTarget)?.name} berhasil digagalkan.`);
    }

    if (witchPoison) {
      deaths.push(witchPoison);
      get().killPlayer(witchPoison, "Diracun Witch");
    }

    if (serialKillerTarget) {
      deaths.push(serialKillerTarget);
      get().killPlayer(serialKillerTarget, "Dibunuh Serial Killer");
    }

    // consume witch potions
    if (witchHeal) {
      set({ witchPotions: { ...witchPotions, hasHeal: false } });
    }
    if (witchPoison) {
      set({ witchPotions: { ...get().witchPotions, hasPoison: false } });
    }

    set({ nightActions: {} });
    persist(get());
    return { deaths };
  },

  castVote: (voterId, targetId) => {
    set({ voteState: { ...get().voteState, votes: { ...get().voteState.votes, [voterId]: targetId }, isOpen: true } });
    persist(get());
  },

  resetVotes: () => {
    set({ voteState: { votes: {}, isOpen: true } });
    persist(get());
  },

  resolveVoting: () => {
    const { voteState, players } = get();
    const tally: Record<string, number> = {};
    Object.entries(voteState.votes).forEach(([voterId, targetId]) => {
      const voter = players.find((p) => p.id === voterId);
      const weight = voter?.isMayor ? 2 : 1;
      tally[targetId] = (tally[targetId] ?? 0) + weight;
    });
    const maxVotes = Math.max(0, ...Object.values(tally));
    const topPlayers = Object.entries(tally)
      .filter(([, v]) => v === maxVotes)
      .map(([id]) => id);

    return { tie: topPlayers.length > 1, topPlayers };
  },

  executePlayer: (id) => {
    get().killPlayer(id, "Dieksekusi hasil voting warga");
    set({ voteState: { votes: {}, isOpen: false } });
    persist(get());
  },

  useWitchHeal: (targetId) => {
    get().setNightAction("witchHealTarget", targetId);
  },

  useWitchPoison: (targetId) => {
    get().setNightAction("witchPoisonTarget", targetId);
  },

  setModeratorNotes: (text) => {
    set({ moderatorNotes: text });
    persist(get());
  },

  checkWinCondition: () => {
    const { players } = get();
    const alive = players.filter((p) => p.alive);
    if (alive.length === 0) return null;

    const aliveWolves = alive.filter((p) => p.roleId && ROLE_DEFINITIONS[p.roleId].team === "werewolf");
    const aliveVillage = alive.filter((p) => p.roleId && ROLE_DEFINITIONS[p.roleId].team === "village");
    const aliveNeutral = alive.filter((p) => p.roleId && ROLE_DEFINITIONS[p.roleId].team === "neutral");

    if (aliveWolves.length === 0 && aliveVillage.length > 0) {
      return "village";
    }
    if (aliveWolves.length >= aliveVillage.length + aliveNeutral.length && aliveWolves.length > 0) {
      return "werewolf";
    }
    if (alive.length === aliveNeutral.length && aliveNeutral.length === 1) {
      return "neutral";
    }
    return null;
  },

  saveHistory: () => {
    const state = get();
    const entry = {
      id: uuid(),
      finishedAt: Date.now(),
      winner: state.winner,
      days: state.day,
      durationMs: state.gameStartedAt ? Date.now() - state.gameStartedAt : 0,
      players: state.players,
      log: state.log,
    };
    const newHistory = [...state.history, entry];
    set({ history: newHistory });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    }
  },

  resetGame: () => {
    set({
      ...initialState,
      roleConfig: generateDefaultRoleConfig(get().players.length || 12),
      pastSnapshots: [],
    });
    persist(get());
  },
}));
