import type { Point, CanvasConfig } from '@/types';

/**
 * Convert screen coordinates to grid coordinates
 */
export function screenToGrid(
  screenX: number,
  screenY: number,
  config: CanvasConfig,
  zoom: number = 1
): Point {
  return {
    x: Math.floor(screenX / (config.cellWidth * zoom)),
    y: Math.floor(screenY / (config.cellHeight * zoom)),
  };
}

/**
 * Convert grid coordinates to screen coordinates (top-left of cell)
 */
export function gridToScreen(
  gridX: number,
  gridY: number,
  config: CanvasConfig,
  zoom: number = 1
): Point {
  return {
    x: gridX * config.cellWidth * zoom,
    y: gridY * config.cellHeight * zoom,
  };
}

/**
 * Get the bounds of a rectangle defined by two points
 */
export function getBounds(p1: Point, p2: Point): { x: number; y: number; width: number; height: number } {
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x) + 1;
  const height = Math.abs(p2.y - p1.y) + 1;
  return { x, y, width, height };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
