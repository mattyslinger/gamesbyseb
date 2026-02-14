import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { LevelConfig } from "../game/engine/types";

export type GamePhase = "ready" | "playing" | "ended" | "won";

interface GameState {
  phase: GamePhase;
  level: number;       // 0-indexed
  score: number;
  lives: number;
  customLevel: LevelConfig | null;

  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  nextLevel: () => void;
  addScore: (pts: number) => void;
  loseLife: () => boolean;   // returns true if lives remain
  resetForLevel: () => void;
  setCustomLevel: (cfg: LevelConfig | null) => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "ready",
    level: 0,
    score: 0,
    lives: 3,
    customLevel: null,

    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          return { phase: "playing" };
        }
        return {};
      });
    },

    restart: () => {
      set(() => ({ phase: "ready", level: 0, score: 0, lives: 3, customLevel: null }));
    },

    end: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },

    nextLevel: () => {
      set((state) => ({
        level: state.level + 1,
        lives: 3,
      }));
    },

    addScore: (pts: number) => {
      set((state) => ({ score: state.score + pts }));
    },

    loseLife: () => {
      const { lives } = get();
      const remaining = lives - 1;
      set({ lives: remaining });
      return remaining > 0;
    },

    resetForLevel: () => {
      set({ lives: 3 });
    },

    setCustomLevel: (cfg: LevelConfig | null) => {
      set({ customLevel: cfg });
    },
  })),
);
