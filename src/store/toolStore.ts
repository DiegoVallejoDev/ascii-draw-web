import { create } from 'zustand';
import type { ToolName, DragState } from '@/types';

interface ToolStoreState {
  activeTool: ToolName;
  dragState: DragState | null;
}

interface ToolStoreActions {
  setActiveTool: (tool: ToolName) => void;
  startDrag: (x: number, y: number, button: number) => void;
  updateDrag: (x: number, y: number) => void;
  endDrag: () => void;
}

type ToolStore = ToolStoreState & ToolStoreActions;

export const useToolStore = create<ToolStore>((set) => ({
  activeTool: 'freehand',
  dragState: null,

  setActiveTool: (tool) => set({ activeTool: tool }),

  startDrag: (x, y, button) =>
    set({
      dragState: {
        isDragging: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        button,
      },
    }),

  updateDrag: (x, y) =>
    set((state) => ({
      dragState: state.dragState
        ? { ...state.dragState, currentX: x, currentY: y }
        : null,
    })),

  endDrag: () => set({ dragState: null }),
}));
