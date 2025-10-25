import type { Edge, Node } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/Application/contexts';
import {
  getDiagram,
  getUserIdsByEmails,
  saveDiagram,
  updateDiagram,
  shareDiagramWithUsers,
} from '@/Infra';
import {
  DiagramContainer,
  DiagramInstructions,
  Header,
} from '@/Presentation/components';
import { useParams } from 'react-router';
import type { PermissionLevel, SharedUser } from '@/Domain/interfaces/diagram.interface';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Start Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Process Node' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'End Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

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

const Diagram = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDiagramId, setSavedDiagramId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState('My Diagram');
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [role, setRole] = useState<'owner' | 'edit' | 'view'>('owner');
  const [loading, setLoading] = useState(false);
  const { user } = useFirebase();

  // Load diagram if ID is present in URL
  useEffect(() => {
    const loadDiagram = async () => {
      if (id && user) {
        setLoading(true);
        try {
          const diagram = await getDiagram(id);
          if (diagram) {
            setNodes(diagram.nodes);
            setEdges(diagram.edges);
            setDiagramTitle(diagram.title);
            setSavedDiagramId(diagram.id);
            if (diagram.ownerId === user.uid) {
              setRole('owner');
            } else {
              const sharedUser = diagram.sharedWith.find(
                (su) => su.userId === user.uid
              );
              setRole(sharedUser ? sharedUser.permission : 'view');
            }
          } else {
            alert('Diagram not found');
          }
        } catch (error) {
          console.error('Error loading diagram:', error);
          alert('Failed to load diagram');
        } finally {
          setLoading(false);
        }
      }
    };

    loadDiagram();
  }, [id, user]);

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save diagrams');
      return;
    }

    if (!savedDiagramId) {
      setShowTitleModal(true);
      return;
    }

    setIsSaving(true);
    try {
      await updateDiagram(savedDiagramId, {
        title: diagramTitle,
        nodes,
        edges,
      });
      alert('Diagram updated successfully!');
    } catch (error) {
      console.error('Error saving diagram:', error);
      alert('Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNew = async () => {
    if (!user) {
      alert('Please log in to save diagrams');
      return;
    }

    setIsSaving(true);
    try {
      const diagramId = await saveDiagram({
        title: diagramTitle,
        nodes,
        edges,
        ownerId: user.uid,
        ownerEmail: user.email || '',
        sharedWith: [],
      });
      setSavedDiagramId(diagramId);
      alert('Diagram saved successfully!');
      setShowTitleModal(false);
    } catch (error) {
      console.error('Error saving diagram:', error);
      alert('Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (sharedUsers: SharedUser[]) => {
    if (!user || !savedDiagramId) {
      alert('Please save the diagram first before sharing');
      return;
    }

    try {
      // Extract emails from sharedUsers (we need to get userIds from emails)
      const emails = sharedUsers.map(user => user.email || '').filter(email => email);
      
      if (emails.length === 0) {
        alert('Please provide at least one valid email address.');
        return;
      }

      console.log('Looking up user IDs for emails:', emails);
      const emailToUserIdMap = await getUserIdsByEmails(emails);

      if (emailToUserIdMap.size === 0) {
        alert('No users found with the provided email addresses. Please make sure the users have registered accounts.');
        return;
      }

      // Check which emails were not found
      const notFoundEmails = emails.filter(email => !emailToUserIdMap.has(email));
      if (notFoundEmails.length > 0) {
        console.warn('Some emails were not found:', notFoundEmails);
      }

      // Create SharedUser objects with actual userIds
      const sharedUsersWithIds: SharedUser[] = sharedUsers
        .filter(sharedUser => sharedUser.email && emailToUserIdMap.has(sharedUser.email))
        .map(sharedUser => ({
          userId: emailToUserIdMap.get(sharedUser.email!)!,
          permission: sharedUser.permission,
        }));

      if (sharedUsersWithIds.length === 0) {
        alert('No valid users found to share with.');
        return;
      }

      console.log('Sharing diagram with users:', sharedUsersWithIds);
      await shareDiagramWithUsers(savedDiagramId, sharedUsersWithIds);
      
      const successMessage = notFoundEmails.length > 0 
        ? `Diagram shared successfully with ${sharedUsersWithIds.length} user(s)! Note: ${notFoundEmails.length} email(s) were not found.`
        : `Diagram shared successfully with ${sharedUsersWithIds.length} user(s)!`;
      
      alert(successMessage);
    } catch (error) {
      console.error('Error sharing diagram:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to share diagram: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="diagram">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-lg">Loading diagram...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagram">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg">{diagramTitle}</p>
          <div className="flex gap-2">
            {role !== 'view' && <button
              onClick={() =>
                savedDiagramId ? handleSave() : setShowTitleModal(true)
              }
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : savedDiagramId ? 'Update' : 'Save'}
            </button>}
            {savedDiagramId && role === 'owner' && (
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Share
              </button>
            )}
          </div>
        </div>

        <DiagramContainer
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          role={role}
        />
        <DiagramInstructions />
      </div>

      {/* Title Modal */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Save Diagram</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Diagram Title
              </label>
              <input
                type="text"
                value={diagramTitle}
                onChange={(e) => setDiagramTitle(e.target.value)}
                placeholder="Enter diagram title"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTitleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default Diagram;
