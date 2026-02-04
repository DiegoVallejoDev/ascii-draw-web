import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';

export function Header() {
  const { fileName, isSaved, undo, redo, canUndo, canRedo, newCanvas, copyToClipboard } = useCanvasStore();
  const { isDarkMode, toggleDarkMode, zoom, zoomIn, zoomOut, resetZoom, toggleSidebar } = useUIStore();

  const handleNew = () => {
    if (!isSaved) {
      if (confirm('You have unsaved changes. Create a new canvas anyway?')) {
        newCanvas();
      }
    } else {
      newCanvas();
    }
  };

  const handleExport = () => {
    const text = useCanvasStore.getState().exportAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
      {/* Left: Logo and file info */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ASCII Draw
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {fileName || 'Untitled'}
          {!isSaved && <span className="text-orange-500 ml-1">•</span>}
        </span>
      </div>

      {/* Center: Main actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleNew}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="New Canvas (Ctrl+N)"
        >
          New
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Export as Text"
        >
          Export
        </button>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Copy to Clipboard (Ctrl+C)"
        >
          Copy
        </button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
        
        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
      </div>

      {/* Right: View controls */}
      <div className="flex items-center gap-2">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
          <button
            onClick={zoomOut}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={resetZoom}
            className="px-2 text-sm font-mono"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Zoom In"
          >
            +
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle Sidebar"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
