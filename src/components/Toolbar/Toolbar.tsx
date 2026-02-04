import { useToolStore } from '@/store/toolStore';
import { TOOL_CONFIGS } from '@/constants/shortcuts';
import type { ToolName } from '@/types';

interface ToolButtonProps {
  tool: ToolName;
  isActive: boolean;
  onClick: () => void;
}

function ToolButton({ tool, isActive, onClick }: ToolButtonProps) {
  const config = TOOL_CONFIGS[tool];
  
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center rounded-lg text-lg
        transition-all duration-150 relative group
        ${isActive 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }
      `}
      title={`${config.displayName} (${config.shortcut})`}
    >
      {config.icon}
      
      {/* Tooltip */}
      <div className="tooltip left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
        {config.displayName}
        <span className="ml-2 opacity-60">{config.shortcut}</span>
      </div>
    </button>
  );
}

export function Toolbar() {
  const { activeTool, setActiveTool } = useToolStore();

  // Tool groups for visual separation
  const toolGroups: ToolName[][] = [
    ['freehand', 'eraser'],
    ['rectangle', 'filledRectangle'],
    ['line'],
    ['text'],
    ['table', 'tree'],
    ['fill', 'picker'],
    ['select'],
  ];

  return (
    <aside className="w-14 flex flex-col items-center py-2 gap-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shrink-0">
      {toolGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col gap-1">
          {group.map((toolName) => (
            <ToolButton
              key={toolName}
              tool={toolName}
              isActive={activeTool === toolName}
              onClick={() => setActiveTool(toolName)}
            />
          ))}
          {groupIndex < toolGroups.length - 1 && (
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-700 my-1" />
          )}
        </div>
      ))}
    </aside>
  );
}
