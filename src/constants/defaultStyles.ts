import type { CanvasConfig } from '@/types';

// Default canvas configuration
export const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 60, // Characters wide
  height: 30, // Characters tall
  cellWidth: 12, // Pixels per character X
  cellHeight: 20, // Pixels per character Y
};

// Maximum canvas dimensions
export const MAX_CANVAS_WIDTH = 200;
export const MAX_CANVAS_HEIGHT = 100;
export const MIN_CANVAS_WIDTH = 10;
export const MIN_CANVAS_HEIGHT = 5;

// Simplified size constants
export const MAX_CANVAS_SIZE = 200;
export const MIN_CANVAS_SIZE = 10;
export const DEFAULT_CANVAS = {
  width: DEFAULT_CANVAS_CONFIG.width,
  height: DEFAULT_CANVAS_CONFIG.height,
};

// History limits
export const MAX_HISTORY_SIZE = 50;

// Zoom limits
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 0.1;
export const DEFAULT_ZOOM = 1;

// Grid settings
export const GRID_LINE_WIDTH = 0.5;
export const GRID_COLOR_LIGHT = 'rgba(0, 0, 0, 0.1)';
export const GRID_COLOR_DARK = 'rgba(255, 255, 255, 0.1)';
