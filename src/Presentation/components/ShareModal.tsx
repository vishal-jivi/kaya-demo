import { useState } from 'react';
import type { PermissionLevel, SharedUser } from '@/Domain/interfaces/diagram.interface';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (sharedUsers: SharedUser[]) => void;
}

interface EmailWithPermission {
  email: string;
  permission: PermissionLevel;
}

const ShareModal = ({ isOpen, onClose, onShare }: ShareModalProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailsWithPermissions, setEmailsWithPermissions] = useState<EmailWithPermission[]>([]);
  const [defaultPermission, setDefaultPermission] = useState<PermissionLevel>('view');

  if (!isOpen) return null;

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (trimmedEmail && !emailsWithPermissions.some(item => item.email === trimmedEmail)) {
      setEmailsWithPermissions([...emailsWithPermissions, { email: trimmedEmail, permission: defaultPermission }]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailsWithPermissions(emailsWithPermissions.filter((item) => item.email !== emailToRemove));
  };

  const handlePermissionChange = (email: string, permission: PermissionLevel) => {
    setEmailsWithPermissions(emailsWithPermissions.map(item => 
      item.email === email ? { ...item, permission } : item
    ));
  };

  const handleShare = () => {
    // Pass emails and permissions to the parent component
    onShare(emailsWithPermissions.map(item => ({ 
      userId: '', 
      permission: item.permission,
      email: item.email 
    })));
    setEmailsWithPermissions([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Share Diagram</h2>
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
              placeholder="Enter email address"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <select
              value={defaultPermission}
              onChange={(e) => setDefaultPermission(e.target.value as PermissionLevel)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <button
              onClick={handleAddEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {emailsWithPermissions.length > 0 && (
            <div className="space-y-2">
              {emailsWithPermissions.map((item) => (
                <div
                  key={item.email}
                  className="bg-blue-50 border border-blue-200 rounded px-3 py-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-800 font-medium">{item.email}</span>
                    <select
                      value={item.permission}
                      onChange={(e) => handlePermissionChange(item.email, e.target.value as PermissionLevel)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveEmail(item.email)}
                    className="text-red-600 hover:text-red-800 text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
