import type { Point, CanvasConfig, LineStyle } from '@/types';

/**
 * Core drawing primitives for canvas operations
 */
export class DrawingPrimitives {
  constructor(
    private getDrawing: () => string[][],
    private getPreview: () => string[][],
    private getConfig: () => CanvasConfig,
    private setCharCallback: (x: number, y: number, char: string, toDrawing: boolean) => void
  ) {}

  /**
   * Check if coordinates are within canvas bounds
   */
  isInBounds(x: number, y: number): boolean {
    const config = this.getConfig();
    return x >= 0 && x < config.width && y >= 0 && y < config.height;
  }

  /**
   * Set a character at a position
   */
  setCharAt(x: number, y: number, char: string, toDrawing: boolean = true): void {
    if (this.isInBounds(x, y)) {
      this.setCharCallback(x, y, char, toDrawing);
    }
  }

  /**
   * Get a character at a position from the drawing layer
   */
  getCharAt(x: number, y: number): string {
    const drawing = this.getDrawing();
    if (this.isInBounds(x, y)) {
      return drawing[y][x];
    }
    return ' ';
  }

  /**
   * Draw a horizontal line
   */
  horizontalLine(
    y: number,
    startX: number,
    length: number,
    char: string,
    toDrawing: boolean = true
  ): void {
    const direction = length >= 0 ? 1 : -1;
    const absLength = Math.abs(length);
    for (let i = 0; i < absLength; i++) {
      this.setCharAt(startX + i * direction, y, char, toDrawing);
    }
  }

  /**
   * Draw a vertical line
   */
  verticalLine(
    x: number,
    startY: number,
    length: number,
    char: string,
    toDrawing: boolean = true
  ): void {
    const direction = length >= 0 ? 1 : -1;
    const absLength = Math.abs(length);
    for (let i = 0; i < absLength; i++) {
      this.setCharAt(x, startY + i * direction, char, toDrawing);
    }
  }

  /**
   * Draw a rectangle outline
   */
  drawRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    style: LineStyle,
    toDrawing: boolean = true
  ): void {
    if (width < 1 || height < 1) return;

    if (width === 1 && height === 1) {
      this.setCharAt(x, y, style.cross, toDrawing);
      return;
    }

    if (width === 1) {
      // Vertical line only
      this.setCharAt(x, y, style.topIntersect, toDrawing);
      for (let i = 1; i < height - 1; i++) {
        this.setCharAt(x, y + i, style.vertical, toDrawing);
      }
      this.setCharAt(x, y + height - 1, style.bottomIntersect, toDrawing);
      return;
    }

    if (height === 1) {
      // Horizontal line only
      this.setCharAt(x, y, style.leftIntersect, toDrawing);
      for (let i = 1; i < width - 1; i++) {
        this.setCharAt(x + i, y, style.horizontal, toDrawing);
      }
      this.setCharAt(x + width - 1, y, style.rightIntersect, toDrawing);
      return;
    }

    // Corners
    this.setCharAt(x, y, style.topLeft, toDrawing);
    this.setCharAt(x + width - 1, y, style.topRight, toDrawing);
    this.setCharAt(x, y + height - 1, style.bottomLeft, toDrawing);
    this.setCharAt(x + width - 1, y + height - 1, style.bottomRight, toDrawing);

    // Horizontal edges
    for (let i = 1; i < width - 1; i++) {
      this.setCharAt(x + i, y, style.horizontal, toDrawing);
      this.setCharAt(x + i, y + height - 1, style.horizontal, toDrawing);
    }

    // Vertical edges
    for (let i = 1; i < height - 1; i++) {
      this.setCharAt(x, y + i, style.vertical, toDrawing);
      this.setCharAt(x + width - 1, y + i, style.vertical, toDrawing);
    }
  }

  /**
   * Draw a filled rectangle
   */
  drawFilledRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    char: string,
    toDrawing: boolean = true
  ): void {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        this.setCharAt(x + dx, y + dy, char, toDrawing);
      }
    }
  }

  /**
   * Draw text at a position
   */
  drawText(
    x: number,
    y: number,
    text: string,
    transparent: boolean,
    toDrawing: boolean = true
  ): void {
    const lines = text.split('\n');
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (!transparent || char !== ' ') {
          this.setCharAt(x + charIdx, y + lineIdx, char, toDrawing);
        }
      }
    }
  }

  /**
   * Draw a line using Bresenham's algorithm
   */
  drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    char: string,
    toDrawing: boolean = true
  ): void {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      this.setCharAt(x, y, char, toDrawing);

      if (x === x1 && y === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  /**
   * Draw an orthogonal (stepped) line
   */
  drawOrthogonalLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    style: LineStyle,
    toDrawing: boolean = true
  ): void {
    // Draw horizontal segment
    const xDir = x1 > x0 ? 1 : -1;
    for (let x = x0; x !== x1; x += xDir) {
      this.setCharAt(x, y0, style.horizontal, toDrawing);
    }

    // Draw corner if needed
    if (y0 !== y1) {
      const cornerChar = y1 > y0 
        ? (x1 > x0 ? style.topLeft : style.topRight)
        : (x1 > x0 ? style.bottomLeft : style.bottomRight);
      this.setCharAt(x1, y0, cornerChar, toDrawing);

      // Draw vertical segment
      const yDir = y1 > y0 ? 1 : -1;
      for (let y = y0 + yDir; y !== y1; y += yDir) {
        this.setCharAt(x1, y, style.vertical, toDrawing);
      }
    }

    // End point
    this.setCharAt(x1, y1, style.cross, toDrawing);
  }

  /**
   * Flood fill algorithm
   */
  floodFill(startX: number, startY: number, replacementChar: string): void {
    const targetChar = this.getCharAt(startX, startY);
    if (targetChar === replacementChar) return;

    const stack: Point[] = [{ x: startX, y: startY }];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key) || !this.isInBounds(x, y)) continue;
      if (this.getCharAt(x, y) !== targetChar) continue;

      visited.add(key);
      this.setCharAt(x, y, replacementChar, true);

      stack.push(
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
      );
    }
  }

  /**
   * Clear the preview layer
   */
  clearPreview(): void {
    const config = this.getConfig();
    const preview = this.getPreview();
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        preview[y][x] = '';
      }
    }
  }
}
