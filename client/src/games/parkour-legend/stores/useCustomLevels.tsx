import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LevelConfig } from "../game/engine/types";

export interface CustomLevel {
  id: string;
  config: LevelConfig;
  createdAt: number;
  updatedAt: number;
}

interface CustomLevelsState {
  levels: CustomLevel[];
  save: (config: LevelConfig, id?: string) => string;
  remove: (id: string) => void;
  get: (id: string) => CustomLevel | undefined;
}

export const useCustomLevels = create<CustomLevelsState>()(
  persist(
    (set, get) => ({
      levels: [],

      save: (config: LevelConfig, id?: string) => {
        const now = Date.now();
        const existing = id ? get().levels.find((l) => l.id === id) : undefined;

        if (existing) {
          set((state) => ({
            levels: state.levels.map((l) =>
              l.id === id ? { ...l, config, updatedAt: now } : l,
            ),
          }));
          return id!;
        }

        const newId = crypto.randomUUID();
        set((state) => ({
          levels: [
            ...state.levels,
            { id: newId, config, createdAt: now, updatedAt: now },
          ],
        }));
        return newId;
      },

      remove: (id: string) => {
        set((state) => ({
          levels: state.levels.filter((l) => l.id !== id),
        }));
      },

      get: (id: string) => {
        return get().levels.find((l) => l.id === id);
      },
    }),
    { name: "parkour-legend-custom-levels" },
  ),
);
