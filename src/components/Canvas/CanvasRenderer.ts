import type { CanvasConfig } from '@/types';

/**
 * Canvas renderer class for drawing ASCII characters on HTML5 Canvas
 */
export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private config: CanvasConfig;
  private fontFamily: string = "'JetBrains Mono', monospace";
  private isDarkMode: boolean = false;

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    
    this.ctx = ctx;
    this.config = config;
    this.setupCanvas();
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: CanvasConfig): void {
    this.config = config;
    this.setupCanvas();
  }

  /**
   * Set dark mode for color adjustments
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode = isDark;
  }

  /**
   * Initialize canvas dimensions and context settings
   */
  private setupCanvas(): void {
    const { width, height, cellWidth, cellHeight } = this.config;
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with device pixel ratio for sharp rendering
    this.ctx.canvas.width = width * cellWidth * dpr;
    this.ctx.canvas.height = height * cellHeight * dpr;
    this.ctx.canvas.style.width = `${width * cellWidth}px`;
    this.ctx.canvas.style.height = `${height * cellHeight}px`;
    
    // Scale context for high DPI displays
    this.ctx.scale(dpr, dpr);
    
    // Configure text rendering
    this.ctx.font = `${cellHeight * 0.75}px ${this.fontFamily}`;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
  }

  /**
   * Main render method - draws background, grid, and both layers
   */
  render(
    drawing: string[][],
    preview: string[][],
    showGrid: boolean = true,
    _zoom: number = 1
  ): void {
    this.clear();
    
    if (showGrid) {
      this.drawGrid();
    }
    
    this.drawLayer(drawing, this.isDarkMode ? '#f1f5f9' : '#1e293b');
    this.drawLayer(preview, this.isDarkMode ? '#60a5fa' : '#3b82f6', 0.8);
  }

  /**
   * Clear the canvas
   */
  private clear(): void {
    const { width, height, cellWidth, cellHeight } = this.config;
    this.ctx.fillStyle = this.isDarkMode ? '#1e293b' : '#ffffff';
    this.ctx.fillRect(0, 0, width * cellWidth, height * cellHeight);
  }

  /**
   * Draw the grid lines
   */
  private drawGrid(): void {
    const { width, height, cellWidth, cellHeight } = this.config;
    
    this.ctx.strokeStyle = this.isDarkMode 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.08)';
    this.ctx.lineWidth = 0.5;

    this.ctx.beginPath();
    
    // Vertical lines
    for (let x = 0; x <= width; x++) {
      this.ctx.moveTo(x * cellWidth, 0);
      this.ctx.lineTo(x * cellWidth, height * cellHeight);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y++) {
      this.ctx.moveTo(0, y * cellHeight);
      this.ctx.lineTo(width * cellWidth, y * cellHeight);
    }

    this.ctx.stroke();
  }

  /**
   * Draw a character layer
   */
  private drawLayer(layer: string[][], color: string, alpha: number = 1): void {
    const { cellWidth, cellHeight } = this.config;
    
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;

    for (let y = 0; y < layer.length; y++) {
      for (let x = 0; x < layer[y].length; x++) {
        const char = layer[y][x];
        if (char && char !== ' ' && char !== '') {
          // Center the character in the cell
          const centerX = x * cellWidth + cellWidth / 2;
          const centerY = y * cellHeight + cellHeight / 2;
          this.ctx.fillText(char, centerX, centerY);
        }
      }
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Convert screen coordinates to grid coordinates
   */
  screenToGrid(screenX: number, screenY: number): { x: number; y: number } {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const scaleX = this.ctx.canvas.width / (rect.width * (window.devicePixelRatio || 1));
    const scaleY = this.ctx.canvas.height / (rect.height * (window.devicePixelRatio || 1));
    
    const x = Math.floor((screenX - rect.left) * scaleX / this.config.cellWidth);
    const y = Math.floor((screenY - rect.top) * scaleY / this.config.cellHeight);
    
    return { x, y };
  }

  /**
   * Get pixel dimensions of the canvas
   */
  getCanvasDimensions(): { width: number; height: number } {
    return {
      width: this.config.width * this.config.cellWidth,
      height: this.config.height * this.config.cellHeight,
    };
  }
}
