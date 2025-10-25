interface TitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isSaving: boolean;
}

const TitleModal = ({ isOpen, onClose, onSave, title, setTitle, isSaving }: TitleModalProps) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Save Diagram</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Diagram Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter diagram title"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleModal;
