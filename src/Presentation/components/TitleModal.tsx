import { useTheme } from '@/Application/hooks';

interface TitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isSaving: boolean;
}

const TitleModal = ({ isOpen, onClose, onSave, title, setTitle, isSaving }: TitleModalProps) => {
  const { theme } = useTheme();

  // Theme-aware styling
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const buttonSecondary = theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100';

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${modalBg} rounded-lg p-6 max-w-md w-full`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Save Diagram</h2>
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>
            Diagram Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter diagram title"
            className={`w-full border rounded px-3 py-2 ${inputBg}`}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded ${buttonSecondary} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleModal;
