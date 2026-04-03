'use client';

import { create } from 'zustand';

interface UIStore {
  // Card interactions
  selectedCardId: string | null;
  hoveredCardId: string | null;
  draggedCardId: string | null;
  enlargedCardId: string | null;

  // Modals / overlays
  showSkillTest: boolean;
  showDamageAssign: boolean;
  showHandDiscard: boolean;
  showNarrative: boolean;
  showGameLog: boolean;
  narrativeContent: { title: string; text: string } | null;

  // Actions
  selectCard: (id: string | null) => void;
  hoverCard: (id: string | null) => void;
  setDraggedCard: (id: string | null) => void;
  setEnlargedCard: (id: string | null) => void;
  setShowSkillTest: (show: boolean) => void;
  setShowDamageAssign: (show: boolean) => void;
  setShowHandDiscard: (show: boolean) => void;
  setShowNarrative: (show: boolean, content?: { title: string; text: string }) => void;
  toggleGameLog: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedCardId: null,
  hoveredCardId: null,
  draggedCardId: null,
  enlargedCardId: null,
  showSkillTest: false,
  showDamageAssign: false,
  showHandDiscard: false,
  showNarrative: false,
  showGameLog: false,
  narrativeContent: null,

  selectCard: (id) => set({ selectedCardId: id }),
  hoverCard: (id) => set({ hoveredCardId: id }),
  setDraggedCard: (id) => set({ draggedCardId: id }),
  setEnlargedCard: (id) => set({ enlargedCardId: id }),
  setShowSkillTest: (show) => set({ showSkillTest: show }),
  setShowDamageAssign: (show) => set({ showDamageAssign: show }),
  setShowHandDiscard: (show) => set({ showHandDiscard: show }),
  setShowNarrative: (show, content) =>
    set({ showNarrative: show, narrativeContent: content ?? null }),
  toggleGameLog: () => set((s) => ({ showGameLog: !s.showGameLog })),
}));
