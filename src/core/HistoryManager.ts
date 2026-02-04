import type { Change, ChangeRecord } from '@/types';
import { MAX_HISTORY_SIZE } from '@/constants/defaultStyles';

/**
 * Manages undo/redo history for canvas operations
 */
export class HistoryManager {
  private undoStack: Change[] = [];
  private redoStack: Change[] = [];
  private currentChange: Change | null = null;
  private maxHistory: number;
  private onHistoryChange: () => void;

  constructor(onHistoryChange: () => void, maxHistory: number = MAX_HISTORY_SIZE) {
    this.maxHistory = maxHistory;
    this.onHistoryChange = onHistoryChange;
  }

  /**
   * Start recording a new change group
   */
  startChange(name: string): void {
    this.currentChange = { name, changes: [] };
  }

  /**
   * Record a single character change
   */
  recordChange(x: number, y: number, prevChar: string): void {
    if (!this.currentChange) return;

    // Avoid duplicate entries for same position
    const exists = this.currentChange.changes.some(
      (c: ChangeRecord) => c.x === x && c.y === y
    );
    if (!exists) {
      this.currentChange.changes.push({ x, y, prevChar });
    }
  }

  /**
   * Commit the current change group to history
   */
  commitChange(): void {
    if (this.currentChange && this.currentChange.changes.length > 0) {
      this.undoStack.push(this.currentChange);
      this.redoStack = []; // Clear redo stack on new change

      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }
      
      this.onHistoryChange();
    }
    this.currentChange = null;
  }

  /**
   * Discard the current change without committing
   */
  discardChange(): void {
    this.currentChange = null;
  }

  /**
   * Undo the last change, returns the changes to apply
   */
  undo(drawing: string[][]): Change | null {
    const change = this.undoStack.pop();
    if (!change) return null;

    const redoChange: Change = { name: change.name, changes: [] };

    for (const { x, y, prevChar } of change.changes) {
      if (y >= 0 && y < drawing.length && x >= 0 && x < drawing[y].length) {
        redoChange.changes.push({
          x,
          y,
          prevChar: drawing[y][x],
        });
        drawing[y][x] = prevChar;
      }
    }

    this.redoStack.push(redoChange);
    this.onHistoryChange();
    return change;
  }

  /**
   * Redo the last undone change, returns the changes to apply
   */
  redo(drawing: string[][]): Change | null {
    const change = this.redoStack.pop();
    if (!change) return null;

    const undoChange: Change = { name: change.name, changes: [] };

    for (const { x, y, prevChar } of change.changes) {
      if (y >= 0 && y < drawing.length && x >= 0 && x < drawing[y].length) {
        undoChange.changes.push({
          x,
          y,
          prevChar: drawing[y][x],
        });
        drawing[y][x] = prevChar;
      }
    }

    this.undoStack.push(undoChange);
    this.onHistoryChange();
    return change;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Get the name of the next undo action
   */
  getUndoName(): string | null {
    return this.undoStack[this.undoStack.length - 1]?.name ?? null;
  }

  /**
   * Get the name of the next redo action
   */
  getRedoName(): string | null {
    return this.redoStack[this.redoStack.length - 1]?.name ?? null;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentChange = null;
    this.onHistoryChange();
  }
}
