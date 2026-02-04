import { useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { Modal } from '@/components/common/Modal';
import { DEFAULT_CANVAS, MAX_CANVAS_SIZE, MIN_CANVAS_SIZE } from '@/constants/defaultStyles';

/**
 * Canvas Resize Modal
 * Allows users to resize the canvas dimensions
 */
export function CanvasResizeModal() {
  const { config, resizeCanvas } = useCanvasStore();
  const { showResizeModal, closeResizeModal } = useUIStore();
  
  const [width, setWidth] = useState(config.width);
  const [height, setHeight] = useState(config.height);
  const [anchor, setAnchor] = useState<'top-left' | 'center' | 'bottom-right'>('top-left');

  const handleResize = () => {
    resizeCanvas(width, height);
    closeResizeModal();
  };

  const handleReset = () => {
    setWidth(DEFAULT_CANVAS.width);
    setHeight(DEFAULT_CANVAS.height);
  };

  return (
    <Modal
      isOpen={showResizeModal}
      onClose={closeResizeModal}
      title="Resize Canvas"
      size="sm"
    >
      <div className="space-y-4">
        {/* Current size display */}
        <div className="text-sm text-gray-500">
          Current size: {config.width} × {config.height}
        </div>

        {/* Size inputs */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              min={MIN_CANVAS_SIZE}
              max={MAX_CANVAS_SIZE}
              value={width}
              onChange={(e) => setWidth(Math.max(MIN_CANVAS_SIZE, Math.min(MAX_CANVAS_SIZE, parseInt(e.target.value) || MIN_CANVAS_SIZE)))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Height</label>
            <input
              type="number"
              min={MIN_CANVAS_SIZE}
              max={MAX_CANVAS_SIZE}
              value={height}
              onChange={(e) => setHeight(Math.max(MIN_CANVAS_SIZE, Math.min(MAX_CANVAS_SIZE, parseInt(e.target.value) || MIN_CANVAS_SIZE)))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Preset sizes */}
        <div>
          <label className="block text-sm font-medium mb-2">Presets</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Small', w: 40, h: 20 },
              { label: 'Medium', w: 80, h: 40 },
              { label: 'Large', w: 120, h: 60 },
              { label: 'Wide', w: 120, h: 30 },
              { label: 'Tall', w: 40, h: 60 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
                className={`px-3 py-1 text-sm rounded border ${
                  width === preset.w && height === preset.h
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {preset.label} ({preset.w}×{preset.h})
              </button>
            ))}
          </div>
        </div>

        {/* Anchor selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Content Anchor</label>
          <div className="grid grid-cols-3 gap-2 w-24">
            {(['top-left', 'center', 'bottom-right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setAnchor(pos)}
                className={`w-8 h-8 rounded border ${
                  anchor === pos
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={pos.replace('-', ' ')}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Where existing content will be positioned
          </p>
        </div>

        {/* Warning */}
        {(width < config.width || height < config.height) && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Reducing canvas size may crop existing content
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Reset to Default
          </button>
          <div className="flex-1" />
          <button
            onClick={closeResizeModal}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleResize}
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Resize
          </button>
        </div>
      </div>
    </Modal>
  );
}
