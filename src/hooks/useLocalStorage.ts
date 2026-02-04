import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';

const STORAGE_KEY = 'ascii-draw-state';
const SETTINGS_KEY = 'ascii-draw-settings';
const AUTOSAVE_DELAY = 2000; // 2 seconds

interface SavedState {
  drawing: string[][];
  config: {
    width: number;
    height: number;
  };
  primaryChar: string;
  secondaryChar: string;
  styleIndex: number;
  savedAt: number;
}

interface SavedSettings {
  isDarkMode: boolean;
  showGrid: boolean;
  isSidebarOpen: boolean;
}

/**
 * Hook to persist canvas state to localStorage
 */
export function useLocalStorage() {
  const { 
    drawing, 
    config, 
    primaryChar, 
    secondaryChar, 
    styleIndex,
    loadFromState 
  } = useCanvasStore();
  
  const { isDarkMode, showGrid, isSidebarOpen } = useUIStore();

  // Load state on mount
  useEffect(() => {
    try {
      // Load canvas state
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const state: SavedState = JSON.parse(savedState);
        loadFromState(state.drawing, state.config);
        
        const store = useCanvasStore.getState();
        if (state.primaryChar) store.setPrimaryChar(state.primaryChar);
        if (state.secondaryChar) store.setSecondaryChar(state.secondaryChar);
        if (state.styleIndex !== undefined) store.setStyleIndex(state.styleIndex);
      }

      // Load settings
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const settings: SavedSettings = JSON.parse(savedSettings);
        const uiStore = useUIStore.getState();
        
        if (settings.isDarkMode !== undefined) {
          if (settings.isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        if (settings.showGrid !== undefined && !settings.showGrid) {
          uiStore.toggleGrid();
        }
        if (settings.isSidebarOpen !== undefined && !settings.isSidebarOpen) {
          uiStore.toggleSidebar();
        }
      }
    } catch (error) {
      console.warn('Failed to load saved state:', error);
    }
  }, [loadFromState]);

  // Auto-save canvas state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const state: SavedState = {
          drawing,
          config: {
            width: config.width,
            height: config.height,
          },
          primaryChar,
          secondaryChar,
          styleIndex,
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save state:', error);
      }
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [drawing, config, primaryChar, secondaryChar, styleIndex]);

  // Save settings immediately when they change
  useEffect(() => {
    try {
      const settings: SavedSettings = {
        isDarkMode,
        showGrid,
        isSidebarOpen,
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [isDarkMode, showGrid, isSidebarOpen]);
}

/**
 * Clear all saved data
 */
export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
