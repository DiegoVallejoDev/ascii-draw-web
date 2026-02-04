import { useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';
import { useUIStore } from '@/store/uiStore';
import { KEYBOARD_SHORTCUTS, TOOL_NAMES } from '@/constants/shortcuts';
import type { ToolName } from '@/types';

export function useKeyboardShortcuts() {
  const { undo, redo, copyToClipboard, newCanvas, clearCanvas } = useCanvasStore();
  const { setActiveTool } = useToolStore();
  const { zoomIn, zoomOut, resetZoom } = useUIStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Build key string
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    
    // Add the key itself (handle special cases)
    let key = e.key;
    if (key === ' ') key = 'Space';
    if (key.length === 1) key = key.toLowerCase();
    
    parts.push(key);
    const keyCombo = parts.join('+');

    // Check for tool shortcuts (single letter keys without modifiers)
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      const toolAction = KEYBOARD_SHORTCUTS[e.key.toLowerCase()];
      if (toolAction && TOOL_NAMES.includes(toolAction as ToolName)) {
        e.preventDefault();
        setActiveTool(toolAction as ToolName);
        return;
      }
      // Check uppercase for shifted tools
      const shiftedAction = KEYBOARD_SHORTCUTS[e.key];
      if (shiftedAction && TOOL_NAMES.includes(shiftedAction as ToolName)) {
        e.preventDefault();
        setActiveTool(shiftedAction as ToolName);
        return;
      }
    }

    // Check for action shortcuts
    const action = KEYBOARD_SHORTCUTS[keyCombo];
    if (!action) return;

    // Always prevent default for our handled shortcuts
    e.preventDefault();

    switch (action) {
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
      case 'copy':
        copyToClipboard();
        break;
      case 'newCanvas':
        const isSaved = useCanvasStore.getState().isSaved;
        if (!isSaved) {
          if (confirm('You have unsaved changes. Create a new canvas anyway?')) {
            newCanvas();
          }
        } else {
          newCanvas();
        }
        break;
      case 'zoomIn':
        zoomIn();
        break;
      case 'zoomOut':
        zoomOut();
        break;
      case 'zoomReset':
        resetZoom();
        break;
      case 'deleteSelection':
        clearCanvas();
        break;
      case 'clearSelection':
        useCanvasStore.getState().clearPreview();
        break;
    }
  }, [undo, redo, copyToClipboard, newCanvas, clearCanvas, setActiveTool, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
