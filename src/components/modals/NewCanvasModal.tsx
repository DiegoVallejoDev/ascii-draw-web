import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { Modal } from '@/components/common/Modal';

/**
 * New Canvas Modal
 * Confirms creation of new canvas when unsaved changes exist
 */
export function NewCanvasModal() {
  const { newCanvas, isSaved } = useCanvasStore();
  const { showNewCanvasModal, closeNewCanvasModal } = useUIStore();

  const handleCreate = () => {
    newCanvas();
    closeNewCanvasModal();
  };

  return (
    <Modal
      isOpen={showNewCanvasModal}
      onClose={closeNewCanvasModal}
      title="Create New Canvas"
      size="sm"
    >
      <div className="space-y-4">
        {!isSaved && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ You have unsaved changes that will be lost
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400">
          This will create a new blank canvas. Your current work will be cleared.
        </p>

        <div className="flex gap-3 pt-2 justify-end">
          <button
            onClick={closeNewCanvasModal}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Create New
          </button>
        </div>
      </div>
    </Modal>
  );
}
