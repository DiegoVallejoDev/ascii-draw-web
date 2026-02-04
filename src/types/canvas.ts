// Point in 2D space (grid coordinates)
export interface Point {
  x: number;
  y: number;
}

// Size dimensions
export interface Size {
  width: number;
  height: number;
}

// Canvas configuration
export interface CanvasConfig {
  width: number; // Characters wide
  height: number; // Characters tall
  cellWidth: number; // Pixels per character X
  cellHeight: number; // Pixels per character Y
}

// Single change record for undo/redo
export interface ChangeRecord {
  x: number;
  y: number;
  prevChar: string;
}

// Named change group for history
export interface Change {
  name: string;
  changes: ChangeRecord[];
}

// Canvas state interface
export interface CanvasState {
  config: CanvasConfig;
  drawing: string[][]; // Main drawing layer
  preview: string[][]; // Preview layer for tool feedback
  primaryChar: string; // Primary drawing character
  secondaryChar: string; // Secondary drawing character
  styleIndex: number; // Current line style (0-5)
  isSaved: boolean;
  filePath: string | null;
}
