import { useTheme } from '@/Application/hooks';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  diagramTitle: string;
}

const DeleteModal = ({ isOpen, onClose, onDelete, diagramTitle }: DeleteModalProps) => {
  const { theme } = useTheme();

  // Theme-aware styling
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const buttonSecondary = theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-600 bg-gray-200 hover:bg-gray-300';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBg} rounded-lg p-6 max-w-md w-full mx-4`}>
        <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
          Delete Diagram
        </h3>
        <p className={`${secondaryTextColor} mb-6`}>
          Are you sure you want to delete "{diagramTitle}"? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${buttonSecondary} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
