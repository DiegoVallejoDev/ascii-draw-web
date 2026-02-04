import { useCanvasStore } from '@/store/canvasStore';
import { useToolStore } from '@/store/toolStore';
import { LINE_STYLES } from '@/core/LineStyles';
import { CHARACTER_SETS } from '@/constants/characters';
import { TOOL_CONFIGS } from '@/constants/shortcuts';
import { useState } from 'react';

function StylePicker() {
  const { styleIndex, setStyleIndex } = useCanvasStore();

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Line Style</h3>
      <div className="grid grid-cols-2 gap-2">
        {LINE_STYLES.map((style, index) => (
          <button
            key={style.name}
            onClick={() => setStyleIndex(index)}
            className={`
              p-2 rounded border text-sm font-mono text-center
              ${styleIndex === index
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <div className="text-lg leading-none mb-1">
              {style.topLeft}{style.horizontal}{style.topRight}
            </div>
            <div className="text-xs text-gray-500">{style.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CharacterPicker() {
  const { primaryChar, secondaryChar, setPrimaryChar, setSecondaryChar } = useCanvasStore();
  const [isPrimarySelected, setIsPrimarySelected] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Box Drawing');

  const handleCharacterClick = (char: string) => {
    if (isPrimarySelected) {
      setPrimaryChar(char);
    } else {
      setSecondaryChar(char);
    }
  };

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Characters</h3>
      
      {/* Primary/Secondary toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsPrimarySelected(true)}
          className={`
            flex-1 p-3 text-2xl font-mono rounded border-2 text-center
            ${isPrimarySelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-gray-700'
            }
          `}
          title="Primary Character (Left Click)"
        >
          {primaryChar || '␣'}
        </button>
        <button
          onClick={() => setIsPrimarySelected(false)}
          className={`
            flex-1 p-3 text-2xl font-mono rounded border-2 text-center
            ${!isPrimarySelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-gray-700'
            }
          `}
          title="Secondary Character (Right Click)"
        >
          {secondaryChar || '␣'}
        </button>
      </div>

      {/* Character categories */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Object.entries(CHARACTER_SETS).map(([category, chars]) => (
          <div key={category}>
            <button
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className="w-full text-left px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              {expandedCategory === category ? '▼' : '▶'} {category}
            </button>
            {expandedCategory === category && (
              <div className="grid grid-cols-8 gap-0.5 p-2">
                {chars.map((char, idx) => (
                  <button
                    key={`${char}-${idx}`}
                    onClick={() => handleCharacterClick(char)}
                    className="char-button"
                  >
                    {char}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CanvasInfo() {
  const { config, clearCanvas } = useCanvasStore();

  return (
    <div className="sidebar-panel">
      <h3 className="sidebar-panel-title">Canvas</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Size:</span>
          <span className="font-mono">{config.width} × {config.height}</span>
        </div>
        <button
          onClick={() => {
            if (confirm('Clear the entire canvas?')) {
              clearCanvas();
            }
          }}
          className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const activeTool = useToolStore((state) => state.activeTool);
  const toolConfig = TOOL_CONFIGS[activeTool];

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto shrink-0">
      {/* Active tool info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{toolConfig.icon}</span>
          <div>
            <div className="font-medium">{toolConfig.displayName}</div>
            <div className="text-xs text-gray-500">Press {toolConfig.shortcut} to select</div>
          </div>
        </div>
      </div>

      {/* Tool-specific options would go here */}
      
      {/* Common panels */}
      <StylePicker />
      <CharacterPicker />
      <CanvasInfo />
    </aside>
  );
}
