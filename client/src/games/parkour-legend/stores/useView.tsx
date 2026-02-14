import { create } from "zustand";

export type ViewMode = "menu" | "campaign" | "custom-play" | "editor";

interface ViewState {
  mode: ViewMode;
  editingLevelId: string | null;
  setMode: (mode: ViewMode) => void;
  openEditor: (levelId?: string) => void;
  backToMenu: () => void;
}

export const useView = create<ViewState>()((set) => ({
  mode: "menu",
  editingLevelId: null,

  setMode: (mode: ViewMode) => set({ mode }),

  openEditor: (levelId?: string) =>
    set({ mode: "editor", editingLevelId: levelId ?? null }),

  backToMenu: () => set({ mode: "menu", editingLevelId: null }),
}));
