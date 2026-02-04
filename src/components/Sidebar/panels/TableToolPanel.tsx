import { useState, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';
import { LINE_STYLES } from '@/core/LineStyles';

/**
 * Table Tool Panel Component
 * Creates ASCII tables with customizable rows/columns
 */
export function TableToolPanel() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [cellWidth, setCellWidth] = useState(10);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tableType, setTableType] = useState<'full' | 'header' | 'minimal'>('full');
  
  const { primitives, startChange, commitChange, clearPreview, styleIndex } = useCanvasStore();
  const activeTool = useToolStore((state) => state.activeTool);
  const style = LINE_STYLES[styleIndex];

  const drawTable = useCallback((toDrawing: boolean) => {
    if (!primitives) return;
    
    const { x: startX, y: startY } = position;
    const tableWidth = cols * cellWidth + cols + 1;
    const tableHeight = rows * 2 + 1;

    // Draw outer border
    primitives.drawRectangle(startX, startY, tableWidth, tableHeight, style, toDrawing);

    // Draw vertical dividers
    for (let c = 1; c < cols; c++) {
      const x = startX + c * (cellWidth + 1);
      for (let r = 0; r < tableHeight; r++) {
        const y = startY + r;
        if (r === 0) {
          primitives.setCharAt(x, y, style.topIntersect, toDrawing);
        } else if (r === tableHeight - 1) {
          primitives.setCharAt(x, y, style.bottomIntersect, toDrawing);
        } else if (r % 2 === 0 && tableType === 'full') {
          primitives.setCharAt(x, y, style.cross, toDrawing);
        } else if (r === 2 && tableType === 'header') {
          primitives.setCharAt(x, y, style.cross, toDrawing);
        } else {
          primitives.setCharAt(x, y, style.vertical, toDrawing);
        }
      }
    }

    // Draw horizontal dividers
    if (tableType === 'full') {
      for (let r = 1; r < rows; r++) {
        const y = startY + r * 2;
        for (let c = 0; c < tableWidth; c++) {
          const x = startX + c;
          if (c === 0) {
            primitives.setCharAt(x, y, style.leftIntersect, toDrawing);
          } else if (c === tableWidth - 1) {
            primitives.setCharAt(x, y, style.rightIntersect, toDrawing);
          } else if ((c - 1) % (cellWidth + 1) === cellWidth) {
            // Already handled by vertical dividers
          } else {
            primitives.setCharAt(x, y, style.horizontal, toDrawing);
          }
        }
      }
    } else if (tableType === 'header' && rows > 1) {
      const y = startY + 2;
      for (let c = 0; c < tableWidth; c++) {
        const x = startX + c;
        if (c === 0) {
          primitives.setCharAt(x, y, style.leftIntersect, toDrawing);
        } else if (c === tableWidth - 1) {
          primitives.setCharAt(x, y, style.rightIntersect, toDrawing);
        } else {
          primitives.setCharAt(x, y, style.horizontal, toDrawing);
        }
      }
    }
  }, [primitives, position, rows, cols, cellWidth, tableType, style]);

  const handlePreview = useCallback(() => {
    if (!primitives) return;
    clearPreview();
    drawTable(false);
  }, [primitives, clearPreview, drawTable]);

  const handleInsert = useCallback(() => {
    if (!primitives) return;
    startChange('Table');
    drawTable(true);
    commitChange();
    clearPreview();
  }, [primitives, startChange, commitChange, clearPreview, drawTable]);

  if (activeTool !== 'table') return null;

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Table Tool</h3>
      
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

      {/* Size inputs */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-xs text-gray-500">Rows</label>
          <input
            type="number"
            min={1}
            max={20}
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Cols</label>
          <input
            type="number"
            min={1}
            max={20}
            value={cols}
            onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Cell Width</label>
          <input
            type="number"
            min={3}
            max={30}
            value={cellWidth}
            onChange={(e) => setCellWidth(Math.max(3, parseInt(e.target.value) || 3))}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Table type */}
      <div className="mb-3">
        <label className="text-xs text-gray-500 block mb-1">Table Type</label>
        <select
          value={tableType}
          onChange={(e) => setTableType(e.target.value as 'full' | 'header' | 'minimal')}
          className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="full">All Dividers</option>
          <option value="header">Header Only</option>
          <option value="minimal">Border Only</option>
        </select>
      </div>

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
          className="flex-1 px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Insert
        </button>
      </div>
    </div>
  );
}
