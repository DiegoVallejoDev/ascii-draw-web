import { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { CanvasRenderer } from './CanvasRenderer';
import { useCanvasEvents } from './hooks/useCanvasEvents';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  const { config, drawing, preview } = useCanvasStore();
  const { zoom, showGrid, isDarkMode } = useUIStore();

  // Initialize renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new CanvasRenderer(canvasRef.current, config);
    }
  }, []);

  // Update renderer config when canvas config changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updateConfig(config);
    }
  }, [config]);

  // Update dark mode
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setDarkMode(isDarkMode);
    }
  }, [isDarkMode]);

  // Re-render when drawing/preview/grid changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.render(drawing, preview, showGrid, zoom);
    }
  }, [drawing, preview, showGrid, zoom, isDarkMode]);

  // Screen to grid conversion
  const screenToGrid = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / (config.cellWidth * zoom));
    const y = Math.floor((clientY - rect.top) / (config.cellHeight * zoom));
    
    return { 
      x: Math.max(0, Math.min(x, config.width - 1)), 
      y: Math.max(0, Math.min(y, config.height - 1)) 
    };
  }, [config, zoom]);

  // Set up event handlers
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
  } = useCanvasEvents({ canvasRef, screenToGrid });

  // Handle zoom with scroll wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const { zoomIn, zoomOut } = useUIStore.getState();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  }, []);

  return (
    <div 
      className="relative shadow-xl rounded-lg overflow-hidden bg-white dark:bg-gray-800"
      style={{ 
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
      />
    </div>
  );
}
