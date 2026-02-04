import type { ToolConfig, ToolName } from '@/types';

// Keyboard shortcut mappings
export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  // Tools
  'r': 'rectangle',
  'R': 'filledRectangle',
  'l': 'line',
  'b': 'freehand',
  't': 'text',
  'a': 'table',
  'y': 'tree',
  'e': 'eraser',
  'f': 'fill',
  's': 'select',
  'p': 'picker',

  // Actions
  'Ctrl+z': 'undo',
  'Ctrl+Z': 'undo',
  'Ctrl+y': 'redo',
  'Ctrl+Y': 'redo',
  'Ctrl+Shift+z': 'redo',
  'Ctrl+Shift+Z': 'redo',
  'Ctrl+c': 'copy',
  'Ctrl+C': 'copy',
  'Ctrl+v': 'paste',
  'Ctrl+V': 'paste',
  'Ctrl+s': 'save',
  'Ctrl+S': 'save',
  'Ctrl+Shift+s': 'saveAs',
  'Ctrl+Shift+S': 'saveAs',
  'Ctrl+o': 'open',
  'Ctrl+O': 'open',
  'Ctrl+n': 'newCanvas',
  'Ctrl+N': 'newCanvas',
  'Delete': 'deleteSelection',
  'Escape': 'clearSelection',

  // View
  'Ctrl+=': 'zoomIn',
  'Ctrl++': 'zoomIn',
  'Ctrl+-': 'zoomOut',
  'Ctrl+0': 'zoomReset',
};

// Tool configurations
export const TOOL_CONFIGS: Record<ToolName, ToolConfig> = {
  rectangle: {
    name: 'rectangle',
    displayName: 'Rectangle',
    icon: '⬜',
    shortcut: 'R',
    hasSidebar: false,
  },
  filledRectangle: {
    name: 'filledRectangle',
    displayName: 'Filled Rectangle',
    icon: '⬛',
    shortcut: 'Shift+R',
    hasSidebar: false,
  },
  line: {
    name: 'line',
    displayName: 'Line',
    icon: '╱',
    shortcut: 'L',
    hasSidebar: true,
  },
  freehand: {
    name: 'freehand',
    displayName: 'Freehand',
    icon: '✏',
    shortcut: 'B',
    hasSidebar: true,
  },
  text: {
    name: 'text',
    displayName: 'Text',
    icon: 'A',
    shortcut: 'T',
    hasSidebar: true,
  },
  table: {
    name: 'table',
    displayName: 'Table',
    icon: '▦',
    shortcut: 'A',
    hasSidebar: true,
  },
  tree: {
    name: 'tree',
    displayName: 'Tree',
    icon: '🌲',
    shortcut: 'Y',
    hasSidebar: true,
  },
  eraser: {
    name: 'eraser',
    displayName: 'Eraser',
    icon: '🧹',
    shortcut: 'E',
    hasSidebar: true,
  },
  fill: {
    name: 'fill',
    displayName: 'Fill',
    icon: '🪣',
    shortcut: 'F',
    hasSidebar: false,
  },
  select: {
    name: 'select',
    displayName: 'Select',
    icon: '⛶',
    shortcut: 'S',
    hasSidebar: false,
  },
  picker: {
    name: 'picker',
    displayName: 'Picker',
    icon: '💉',
    shortcut: 'P',
    hasSidebar: false,
  },
};

// Tool names list for iteration
export const TOOL_NAMES = Object.keys(TOOL_CONFIGS) as ToolName[];
