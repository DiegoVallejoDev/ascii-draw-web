import { useState, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';
import { LINE_STYLES } from '@/core/LineStyles';

/**
 * Tree Tool Panel Component
 * Creates ASCII tree structures from indented text
 */
export function TreeToolPanel() {
  const [text, setText] = useState(`Root
  Child 1
    Grandchild 1
    Grandchild 2
  Child 2
  Child 3`);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const { primitives, startChange, commitChange, clearPreview, styleIndex } = useCanvasStore();
  const activeTool = useToolStore((state) => state.activeTool);
  const style = LINE_STYLES[styleIndex];

  const parseTree = useCallback((input: string) => {
    const lines = input.split('\n').filter(line => line.trim());
    const result: string[] = [];
    
    // Calculate indentation levels
    const levels = lines.map(line => {
      const indent = line.search(/\S/);
      return { level: Math.floor(indent / 2), text: line.trim() };
    });

    // Track which levels have more siblings below
    const hasSiblingBelow = (idx: number, level: number): boolean => {
      for (let i = idx + 1; i < levels.length; i++) {
        if (levels[i].level < level) return false;
        if (levels[i].level === level) return true;
      }
      return false;
    };

    // Build tree lines
    const prefixStack: boolean[] = [];
    
    for (let i = 0; i < levels.length; i++) {
      const { level, text: nodeText } = levels[i];
      
      // Adjust prefix stack
      while (prefixStack.length > level) {
        prefixStack.pop();
      }
      while (prefixStack.length < level) {
        prefixStack.push(true);
      }

      // Build prefix
      let prefix = '';
      for (let j = 0; j < level; j++) {
        if (j < prefixStack.length - 1) {
          prefix += (prefixStack[j] ? style.vertical + '   ' : '    ');
        }
      }

      // Add connector
      if (level > 0) {
        const hasMore = hasSiblingBelow(i, level);
        prefix += hasMore 
          ? style.leftIntersect + style.horizontal + style.horizontal + ' '
          : style.bottomLeft + style.horizontal + style.horizontal + ' ';
        
        if (prefixStack.length > 0) {
          prefixStack[prefixStack.length - 1] = hasMore;
        }
      }

      result.push(prefix + nodeText);
    }

    return result;
  }, [style]);

  const drawTree = useCallback((toDrawing: boolean) => {
    if (!primitives) return;
    
    const treeLines = parseTree(text);
    const { x: startX, y: startY } = position;

    treeLines.forEach((line, idx) => {
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char !== ' ') {
          primitives.setCharAt(startX + i, startY + idx, char, toDrawing);
        }
      }
    });
  }, [primitives, text, position, parseTree]);

  const handlePreview = useCallback(() => {
    if (!primitives) return;
    clearPreview();
    drawTree(false);
  }, [primitives, clearPreview, drawTree]);

  const handleInsert = useCallback(() => {
    if (!primitives) return;
    startChange('Tree');
    drawTree(true);
    commitChange();
    clearPreview();
  }, [primitives, startChange, commitChange, clearPreview, drawTree]);

  if (activeTool !== 'tree') return null;

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Tree Tool</h3>
      
      {/* Position inputs */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500">X</label>
          <input
            type="number"
            value={position.x}
            onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Y</label>
          <input
            type="number"
            value={position.y}
            onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 mb-2">
        Use 2-space indentation for hierarchy:
      </p>

      {/* Text input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter indented text..."
        className="w-full h-32 px-3 py-2 text-sm font-mono rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none mb-3"
        spellCheck={false}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePreview}
          className="flex-1 px-3 py-2 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Preview
        </button>
        <button
          onClick={handleInsert}
          disabled={!text.trim()}
          className="flex-1 px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert
        </button>
      </div>
    </div>
  );
}
