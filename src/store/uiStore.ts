import { create } from 'zustand';
import { DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/constants/defaultStyles';
import { clamp } from '@/utils/coordinates';

interface UIStoreState {
  // Zoom
  zoom: number;
  
  // Theme
  isDarkMode: boolean;
  
  // Sidebar
  isSidebarOpen: boolean;
  
  // Modals
  isNewCanvasModalOpen: boolean;
  isResizeModalOpen: boolean;
  isExportModalOpen: boolean;
  isAboutModalOpen: boolean;
  
  // Grid visibility
  showGrid: boolean;
}

interface UIStoreActions {
  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // Theme
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Modals
  openModal: (modal: 'newCanvas' | 'resize' | 'export' | 'about') => void;
  closeModal: (modal: 'newCanvas' | 'resize' | 'export' | 'about') => void;
  closeAllModals: () => void;
  
  // Convenience modal methods
  showNewCanvasModal: boolean;
  closeNewCanvasModal: () => void;
  showResizeModal: boolean;
  closeResizeModal: () => void;
  
  // Grid
  toggleGrid: () => void;
}

type UIStore = UIStoreState & UIStoreActions;

// Check for system dark mode preference
const getInitialDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true; // Default to dark
};

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  zoom: DEFAULT_ZOOM,
  isDarkMode: getInitialDarkMode(),
  isSidebarOpen: true,
  isNewCanvasModalOpen: false,
  isResizeModalOpen: false,
  isExportModalOpen: false,
  isAboutModalOpen: false,
  showGrid: true,

  // Zoom actions
  setZoom: (zoom) => set({ zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) }),
  zoomIn: () => set((state) => ({ zoom: clamp(state.zoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM) })),
  zoomOut: () => set((state) => ({ zoom: clamp(state.zoom - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM) })),
  resetZoom: () => set({ zoom: DEFAULT_ZOOM }),

  // Theme actions
  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    document.documentElement.classList.toggle('dark', newMode);
    set({ isDarkMode: newMode });
  },
  setDarkMode: (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDarkMode: isDark });
  },

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Modal actions
  openModal: (modal) => {
    switch (modal) {
      case 'newCanvas':
        set({ isNewCanvasModalOpen: true });
        break;
      case 'resize':
        set({ isResizeModalOpen: true });
        break;
      case 'export':
        set({ isExportModalOpen: true });
        break;
      case 'about':
        set({ isAboutModalOpen: true });
        break;
    }
  },
  closeModal: (modal) => {
    switch (modal) {
      case 'newCanvas':
        set({ isNewCanvasModalOpen: false });
        break;
      case 'resize':
        set({ isResizeModalOpen: false });
        break;
      case 'export':
        set({ isExportModalOpen: false });
        break;
      case 'about':
        set({ isAboutModalOpen: false });
        break;
    }
  },
  closeAllModals: () =>
    set({
      isNewCanvasModalOpen: false,
      isResizeModalOpen: false,
      isExportModalOpen: false,
      isAboutModalOpen: false,
    }),

  // Grid actions
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  
  // Convenience getters/methods for modals
  get showNewCanvasModal() {
    return get().isNewCanvasModalOpen;
  },
  closeNewCanvasModal: () => set({ isNewCanvasModalOpen: false }),
  get showResizeModal() {
    return get().isResizeModalOpen;
  },
  closeResizeModal: () => set({ isResizeModalOpen: false }),
}));
