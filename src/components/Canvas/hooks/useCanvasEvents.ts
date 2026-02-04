import { useCallback, useRef } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';
import { LINE_STYLES } from '@/core/LineStyles';
import { getBounds } from '@/utils/coordinates';

interface UseCanvasEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  screenToGrid: (x: number, y: number) => { x: number; y: number };
}

export function useCanvasEvents({ canvasRef, screenToGrid }: UseCanvasEventsProps) {
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  const { 
    setCharAt, 
    getCharAt, 
    clearPreview, 
    primaryChar, 
    secondaryChar, 
    styleIndex,
    startChange,
    commitChange,
    primitives,
  } = useCanvasStore();
  
  const { activeTool, dragState, startDrag, updateDrag, endDrag } = useToolStore();


  // Get current line style
  const style = LINE_STYLES[styleIndex];

  // Handle drawing for freehand tool
  const handleFreehandDraw = useCallback((gridX: number, gridY: number, char: string) => {
    setCharAt(gridX, gridY, char, true);
  }, [setCharAt]);

  // Handle rectangle preview/draw
  const handleRectangle = useCallback((
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    toDrawing: boolean,
    filled: boolean = false
  ) => {
    const bounds = getBounds({ x: startX, y: startY }, { x: endX, y: endY });
    
    if (filled) {
      // Draw filled rectangle
      for (let dy = 0; dy < bounds.height; dy++) {
        for (let dx = 0; dx < bounds.width; dx++) {
          setCharAt(bounds.x + dx, bounds.y + dy, primaryChar, toDrawing);
        }
      }
    } else {
      // Draw outline with current style
      primitives?.drawRectangle(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        style,
        toDrawing
      );
    }
  }, [setCharAt, primitives, style, primaryChar]);

  // Handle line drawing
  const handleLine = useCallback((
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    toDrawing: boolean
  ) => {
    primitives?.drawLine(startX, startY, endX, endY, style.horizontal, toDrawing);
  }, [primitives, style]);

  // Handle flood fill
  const handleFloodFill = useCallback((x: number, y: number, char: string) => {
    startChange('Fill');
    primitives?.floodFill(x, y, char);
    commitChange();
  }, [primitives, startChange, commitChange]);

  // Handle eraser
  const handleEraser = useCallback((x: number, y: number) => {
    setCharAt(x, y, ' ', true);
  }, [setCharAt]);

  // Handle picker (sample character under cursor)
  const handlePicker = useCallback((x: number, y: number) => {
    const char = getCharAt(x, y);
    if (char && char !== ' ') {
      useCanvasStore.getState().setPrimaryChar(char);
    }
  }, [getCharAt]);

  // Mouse down handler
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { x: gridX, y: gridY } = screenToGrid(e.clientX, e.clientY);
    const char = e.button === 0 ? primaryChar : secondaryChar;

    isDrawingRef.current = true;
    startPointRef.current = { x: gridX, y: gridY };
    lastPointRef.current = { x: gridX, y: gridY };
    startDrag(gridX, gridY, e.button);

    switch (activeTool) {
      case 'freehand':
        startChange('Draw');
        handleFreehandDraw(gridX, gridY, char);
        break;
        
      case 'eraser':
        startChange('Erase');
        handleEraser(gridX, gridY);
        break;
        
      case 'fill':
        handleFloodFill(gridX, gridY, char);
        break;
        
      case 'picker':
        handlePicker(gridX, gridY);
        break;
        
      case 'rectangle':
      case 'filledRectangle':
        startChange(activeTool === 'rectangle' ? 'Rectangle' : 'Filled Rectangle');
        break;
        
      case 'line':
        startChange('Line');
        break;
    }
  }, [
    canvasRef, screenToGrid, activeTool, primaryChar, secondaryChar,
    startDrag, startChange, handleFreehandDraw, handleEraser, handleFloodFill, handlePicker
  ]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !startPointRef.current) return;

    const { x: gridX, y: gridY } = screenToGrid(e.clientX, e.clientY);
    const char = dragState?.button === 0 ? primaryChar : secondaryChar;

    // Skip if position hasn't changed
    if (lastPointRef.current?.x === gridX && lastPointRef.current?.y === gridY) {
      return;
    }
    lastPointRef.current = { x: gridX, y: gridY };
    updateDrag(gridX, gridY);

    switch (activeTool) {
      case 'freehand':
        handleFreehandDraw(gridX, gridY, char);
        break;
        
      case 'eraser':
        handleEraser(gridX, gridY);
        break;
        
      case 'rectangle':
        clearPreview();
        handleRectangle(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          false, // to preview
          false  // not filled
        );
        break;
        
      case 'filledRectangle':
        clearPreview();
        handleRectangle(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          false, // to preview
          true   // filled
        );
        break;
        
      case 'line':
        clearPreview();
        handleLine(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          false // to preview
        );
        break;
    }
  }, [
    screenToGrid, activeTool, dragState, primaryChar, secondaryChar,
    updateDrag, clearPreview, handleFreehandDraw, handleEraser, handleRectangle, handleLine
  ]);

  // Mouse up handler
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !startPointRef.current) return;

    const { x: gridX, y: gridY } = screenToGrid(e.clientX, e.clientY);

    switch (activeTool) {
      case 'rectangle':
        clearPreview();
        handleRectangle(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          true, // to drawing
          false // not filled
        );
        commitChange();
        break;
        
      case 'filledRectangle':
        clearPreview();
        handleRectangle(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          true, // to drawing
          true  // filled
        );
        commitChange();
        break;
        
      case 'line':
        clearPreview();
        handleLine(
          startPointRef.current.x,
          startPointRef.current.y,
          gridX,
          gridY,
          true // to drawing
        );
        commitChange();
        break;
        
      case 'freehand':
      case 'eraser':
        commitChange();
        break;
    }

    isDrawingRef.current = false;
    startPointRef.current = null;
    lastPointRef.current = null;
    endDrag();
  }, [
    screenToGrid, activeTool, clearPreview, commitChange, endDrag,
    handleRectangle, handleLine
  ]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    if (isDrawingRef.current) {
      // Commit any in-progress drawing
      if (activeTool === 'freehand' || activeTool === 'eraser') {
        commitChange();
      }
      isDrawingRef.current = false;
      startPointRef.current = null;
      lastPointRef.current = null;
      clearPreview();
      endDrag();
    }
  }, [activeTool, commitChange, clearPreview, endDrag]);

  // Prevent context menu on right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
  };
}
