// Available tool names
export type ToolName =
  | 'rectangle'
  | 'filledRectangle'
  | 'line'
  | 'freehand'
  | 'text'
  | 'table'
  | 'tree'
  | 'eraser'
  | 'fill'
  | 'select'
  | 'picker';

// Tool configuration metadata
export interface ToolConfig {
  name: ToolName;
  displayName: string;
  icon: string;
  shortcut: string;
  hasSidebar: boolean;
}

// Drag state for drawing operations
export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  button: number; // 0 = left, 2 = right
}

// Tool-specific configurations
export interface FreehandConfig {
  brushSize: number; // 1-7
}

export interface LineConfig {
  lineType: 'cartesian' | 'freehand' | 'stepped';
  hasArrow: boolean;
}

export interface TextConfig {
  text: string;
  font: string; // FIGlet font name
  isVertical: boolean;
  isTransparent: boolean;
}

export interface TableConfig {
  rows: number;
  columns: number;
  cellContents: string[][];
  tableType: 'allDivided' | 'headerDivided' | 'noDividers';
}

export interface TreeConfig {
  text: string; // Indented text for tree structure
}

export interface SelectConfig {
  hasSelection: boolean;
  selectionBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  selectedContent: string[][] | null;
}

// Union of all tool-specific configs
export type ToolSpecificConfig =
  | FreehandConfig
  | LineConfig
  | TextConfig
  | TableConfig
  | TreeConfig
  | SelectConfig;

// Tool state in store
export interface ToolState {
  activeTool: ToolName;
  dragState: DragState | null;
}
