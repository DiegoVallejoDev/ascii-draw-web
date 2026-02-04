import type { Point, LineStyle } from '@/types';

/**
 * Abstract base class for all drawing tools
 * Provides common functionality and lifecycle hooks
 */
export abstract class Tool {
  private _isActive: boolean = false;
  
  // Public getter for active state
  get isActive(): boolean {
    return this._isActive;
  }

  // Tool metadata - must be implemented by subclasses
  abstract readonly name: string;
  abstract readonly displayName: string;
  abstract readonly icon: string;
  abstract readonly shortcut: string;

  // Lifecycle methods
  activate(): void {
    this._isActive = true;
    this.onActivate();
  }

  deactivate(): void {
    this._isActive = false;
    this.onDeactivate();
  }

  // Event handlers - override in subclasses as needed
  onDragBegin(_point: Point, _button: number): void {}
  onDragUpdate(_point: Point, _delta: Point): void {}
  onDragEnd(_point: Point): void {}
  onClick(_point: Point, _button: number): void {}
  onKeyDown(_key: string): void {}

  // Optional lifecycle hooks
  protected onActivate(): void {}
  protected onDeactivate(): void {}

  // Sidebar component for tool-specific options (optional)
  getSidebarComponent(): React.ComponentType | null {
    return null;
  }
}

/**
 * Interface for tools that support different line styles
 */
export interface StyleAwareTool {
  setStyle(style: LineStyle): void;
}

/**
 * Interface for tools that support brush sizes
 */
export interface SizeableTool {
  setBrushSize(size: number): void;
  getBrushSize(): number;
}

/**
 * Interface for tools that can be committed/cancelled
 */
export interface CommittableTool {
  commit(): void;
  cancel(): void;
}
