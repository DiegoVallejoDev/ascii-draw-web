import { useState, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';

/**
 * Text Tool Panel Component
 * Provides text input and positioning for the text tool
 */
export function TextToolPanel() {
  const [text, setText] = useState('');
  const [isVertical, setIsVertical] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const { primitives, startChange, commitChange, clearPreview } = useCanvasStore();
  const activeTool = useToolStore((state) => state.activeTool);

  const updatePreview = useCallback(() => {
    if (!primitives || activeTool !== 'text') return;
    clearPreview();
    
    let displayText = text;
    if (isVertical) {
      displayText = text.split('').join('\n');
    }
    
    primitives.drawText(position.x, position.y, displayText, isTransparent, false);
  }, [primitives, text, isVertical, isTransparent, position, activeTool, clearPreview]);

  const handleInsert = useCallback(() => {
    if (!primitives || !text) return;
    
    startChange('Text');
    
    let displayText = text;
    if (isVertical) {
      displayText = text.split('').join('\n');
    }
    
    primitives.drawText(position.x, position.y, displayText, isTransparent, true);
    commitChange();
    clearPreview();
    setText('');
  }, [primitives, text, isVertical, isTransparent, position, startChange, commitChange, clearPreview]);

  // Update preview when text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setTimeout(updatePreview, 0);
  };

  if (activeTool !== 'text') return null;

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Text Tool</h3>
      
      {/* Position inputs */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500">X</label>
          <input
            type="number"
            value={position.x}
            onChange={(e) => {
              setPosition({ ...position, x: parseInt(e.target.value) || 0 });
              setTimeout(updatePreview, 0);
            }}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Y</label>
          <input
            type="number"
            value={position.y}
            onChange={(e) => {
              setPosition({ ...position, y: parseInt(e.target.value) || 0 });
              setTimeout(updatePreview, 0);
            }}
            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Text input */}
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text..."
        className="w-full h-24 px-3 py-2 text-sm font-mono rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none mb-3"
      />

      {/* Options */}
      <div className="space-y-2 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isVertical}
            onChange={(e) => {
              setIsVertical(e.target.checked);
              setTimeout(updatePreview, 0);
            }}
            className="rounded"
          />
          Vertical text
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTransparent}
            onChange={(e) => {
              setIsTransparent(e.target.checked);
              setTimeout(updatePreview, 0);
            }}
            className="rounded"
          />
          Transparent (skip spaces)
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={updatePreview}
          className="flex-1 px-3 py-2 text-sm rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Preview
        </button>
        <button
          onClick={handleInsert}
          disabled={!text}
          className="flex-1 px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert
        </button>
      </div>
    </div>
  );
}
