import { useEffect } from 'react';
import { Header } from './Header/Header';
import { Toolbar } from './Toolbar/Toolbar';
import { Canvas } from './Canvas/Canvas';
import { Sidebar } from './Sidebar/Sidebar';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function App() {
  const initializeManagers = useCanvasStore((state) => state.initializeManagers);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  
  // Initialize canvas managers on mount
  useEffect(() => {
    initializeManagers();
  }, [initializeManagers]);

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <Toolbar />

        {/* Canvas area */}
        <main className="flex-1 flex items-center justify-center p-4 overflow-auto bg-gray-200 dark:bg-gray-800">
          <Canvas />
        </main>

        {/* Right sidebar */}
        {isSidebarOpen && <Sidebar />}
      </div>
    </div>
  );
}
