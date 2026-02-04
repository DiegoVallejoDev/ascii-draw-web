import { create } from 'zustand';
import type { CanvasConfig } from '@/types';
import { DEFAULT_CANVAS_CONFIG } from '@/constants/defaultStyles';
import { DEFAULT_PRIMARY_CHAR, DEFAULT_SECONDARY_CHAR } from '@/constants/characters';
import { HistoryManager } from '@/core/HistoryManager';
import { DrawingPrimitives } from '@/core/DrawingPrimitives';
import { LINE_STYLES } from '@/core/LineStyles';

// Create empty grid helper
const createEmptyGrid = (width: number, height: number): string[][] => {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));
};

// Canvas store state interface
interface CanvasStoreState {
  // Configuration
  config: CanvasConfig;
  
  // Layers
  drawing: string[][];
  preview: string[][];
  
  // Character selection
  primaryChar: string;
  secondaryChar: string;
  styleIndex: number;
  
  // File state
  isSaved: boolean;
  fileName: string | null;
  
  // Managers (non-reactive, stored in refs)
  history: HistoryManager | null;
  primitives: DrawingPrimitives | null;
  
  // History state for UI
  canUndo: boolean;
  canRedo: boolean;
}

interface CanvasStoreActions {
  // Initialization
  initializeManagers: () => void;
  
  // Character operations
  setCharAt: (x: number, y: number, char: string, toDrawing?: boolean) => void;
  getCharAt: (x: number, y: number) => string;
  
  // Preview management
  clearPreview: () => void;
  
  // Character selection
  setPrimaryChar: (char: string) => void;
  setSecondaryChar: (char: string) => void;
  setStyleIndex: (index: number) => void;
  
  // Canvas management
  resizeCanvas: (width: number, height: number) => void;
  clearCanvas: () => void;
  newCanvas: () => void;
  
  // History operations
  startChange: (name: string) => void;
  commitChange: () => void;
  discardChange: () => void;
  undo: () => void;
  redo: () => void;
  
  // File operations
  exportAsText: () => string;
  importFromText: (text: string) => void;
  copyToClipboard: () => Promise<void>;
  setFileName: (name: string | null) => void;
  markAsSaved: () => void;
  
  // State restoration
  loadFromState: (drawing: string[][], config: { width: number; height: number }) => void;
}

type CanvasStore = CanvasStoreState & CanvasStoreActions;

export const useCanvasStore = create<CanvasStore>((set, get) => {
  const initialDrawing = createEmptyGrid(DEFAULT_CANVAS_CONFIG.width, DEFAULT_CANVAS_CONFIG.height);
  const initialPreview = createEmptyGrid(DEFAULT_CANVAS_CONFIG.width, DEFAULT_CANVAS_CONFIG.height);

  return {
    // Initial state
    config: DEFAULT_CANVAS_CONFIG,
    drawing: initialDrawing,
    preview: initialPreview,
    primaryChar: DEFAULT_PRIMARY_CHAR,
    secondaryChar: DEFAULT_SECONDARY_CHAR,
    styleIndex: 0,
    isSaved: true,
    fileName: null,
    history: null,
    primitives: null,
    canUndo: false,
    canRedo: false,

    // Initialize managers (call once on mount)
    initializeManagers: () => {
      const state = get();
      if (state.history) return; // Already initialized

      const history = new HistoryManager(() => {
        const h = get().history;
        set({
          canUndo: h?.canUndo() ?? false,
          canRedo: h?.canRedo() ?? false,
        });
      });

      const primitives = new DrawingPrimitives(
        () => get().drawing,
        () => get().preview,
        () => get().config,
        (x, y, char, toDrawing) => {
          const layer = toDrawing ? 'drawing' : 'preview';
          set((state) => {
            const newLayer = state[layer].map((row, rowIdx) =>
              rowIdx === y ? row.map((c, colIdx) => (colIdx === x ? char : c)) : row
            );
            
            // Record change for undo if drawing to main layer
            if (toDrawing && state.history) {
              state.history.recordChange(x, y, state.drawing[y][x]);
            }
            
            return { [layer]: newLayer, isSaved: toDrawing ? false : state.isSaved };
          });
        }
      );

      set({ history, primitives });
    },

    // Character operations
    setCharAt: (x, y, char, toDrawing = true) => {
      const { config, history } = get();
      if (x < 0 || x >= config.width || y < 0 || y >= config.height) return;

      const layer = toDrawing ? 'drawing' : 'preview';
      set((state) => {
        const newLayer = state[layer].map((row, rowIdx) =>
          rowIdx === y ? row.map((c, colIdx) => (colIdx === x ? char : c)) : row
        );

        if (toDrawing && history) {
          history.recordChange(x, y, state.drawing[y][x]);
        }

        return { [layer]: newLayer, isSaved: toDrawing ? false : state.isSaved };
      });
    },

    getCharAt: (x, y) => {
      const { config, drawing } = get();
      if (x < 0 || x >= config.width || y < 0 || y >= config.height) return ' ';
      return drawing[y][x];
    },

    clearPreview: () => {
      const { config } = get();
      set({ preview: createEmptyGrid(config.width, config.height) });
    },

    // Character selection
    setPrimaryChar: (char) => set({ primaryChar: char }),
    setSecondaryChar: (char) => set({ secondaryChar: char }),
    setStyleIndex: (index) => set({ styleIndex: Math.max(0, Math.min(index, LINE_STYLES.length - 1)) }),

    // Canvas management
    resizeCanvas: (width, height) => {
      set((state) => {
        const newDrawing = createEmptyGrid(width, height);
        const newPreview = createEmptyGrid(width, height);

        // Copy existing content
        for (let y = 0; y < Math.min(height, state.config.height); y++) {
          for (let x = 0; x < Math.min(width, state.config.width); x++) {
            newDrawing[y][x] = state.drawing[y][x];
          }
        }

        return {
          config: { ...state.config, width, height },
          drawing: newDrawing,
          preview: newPreview,
          isSaved: false,
        };
      });
    },

    clearCanvas: () => {
      const state = get();
      state.history?.startChange('Clear Canvas');
      
      // Record all non-empty cells for undo
      for (let y = 0; y < state.config.height; y++) {
        for (let x = 0; x < state.config.width; x++) {
          if (state.drawing[y][x] !== ' ') {
            state.history?.recordChange(x, y, state.drawing[y][x]);
          }
        }
      }

      set({
        drawing: createEmptyGrid(state.config.width, state.config.height),
        isSaved: false,
      });
      
      state.history?.commitChange();
    },

    newCanvas: () => {
      get().history?.clear();
      set({
        config: DEFAULT_CANVAS_CONFIG,
        drawing: createEmptyGrid(DEFAULT_CANVAS_CONFIG.width, DEFAULT_CANVAS_CONFIG.height),
        preview: createEmptyGrid(DEFAULT_CANVAS_CONFIG.width, DEFAULT_CANVAS_CONFIG.height),
        isSaved: true,
        fileName: null,
      });
    },

    // History operations
    startChange: (name) => get().history?.startChange(name),
    commitChange: () => get().history?.commitChange(),
    discardChange: () => get().history?.discardChange(),

    undo: () => {
      const { history, drawing } = get();
      if (history) {
        const drawingCopy = drawing.map((row) => [...row]);
        history.undo(drawingCopy);
        set({ drawing: drawingCopy });
      }
    },

    redo: () => {
      const { history, drawing } = get();
      if (history) {
        const drawingCopy = drawing.map((row) => [...row]);
        history.redo(drawingCopy);
        set({ drawing: drawingCopy });
      }
    },

    // File operations
    exportAsText: () => {
      const { drawing } = get();
      return drawing.map((row) => row.join('')).join('\n');
    },

    importFromText: (text) => {
      const lines = text.split('\n');
      const height = lines.length;
      const width = Math.max(...lines.map((l) => l.length), 1);

      const newDrawing = createEmptyGrid(width, height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < lines[y].length; x++) {
          newDrawing[y][x] = lines[y][x];
        }
      }

      get().history?.clear();
      set({
        config: { ...get().config, width, height },
        drawing: newDrawing,
        preview: createEmptyGrid(width, height),
        isSaved: true,
      });
    },

    copyToClipboard: async () => {
      const text = get().exportAsText();
      await navigator.clipboard.writeText(text);
    },

    setFileName: (name) => set({ fileName: name }),
    markAsSaved: () => set({ isSaved: true }),
    
    // State restoration
    loadFromState: (savedDrawing, savedConfig) => {
      get().history?.clear();
      set({
        config: { ...get().config, width: savedConfig.width, height: savedConfig.height },
        drawing: savedDrawing,
        preview: createEmptyGrid(savedConfig.width, savedConfig.height),
        isSaved: true,
      });
    },
  };
});

// Helper to get current line style
export const useCurrentStyle = () => {
  const styleIndex = useCanvasStore((state) => state.styleIndex);
  return LINE_STYLES[styleIndex];
};
