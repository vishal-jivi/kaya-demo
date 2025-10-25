import type { Edge, Node } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { useFirebase } from '@/Application/contexts';
import {
  getDiagram,
  getUserIdsByEmails,
  saveDiagram,
  updateDiagram,
} from '@/Infra';
import {
  DiagramContainer,
  DiagramInstructions,
  Header,
} from '@/Presentation/components';
import { useParams } from 'react-router';

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
  onShare: (emails: string[]) => void;
}

const ShareModal = ({ isOpen, onClose, onShare }: ShareModalProps) => {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    if (trimmedEmail && !emails.includes(trimmedEmail)) {
      setEmails([...emails, trimmedEmail]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleShare = () => {
    onShare(emails);
    setEmails([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Share Diagram</h2>
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
              placeholder="Enter email address"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={handleAddEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <span
                  key={email}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-2"
                >
                  {email}
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
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

  useEffect(() => {
    console.log('Nodes updated:', nodes);
    console.log('Edges updated:', edges);
  }, [nodes, edges]);

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

  const handleShare = async (emails: string[]) => {
    if (!user || !savedDiagramId) {
      alert('Please save the diagram first before sharing');
      return;
    }

    try {
      const userIds = await getUserIdsByEmails(emails);

      if (userIds.length === 0) {
        alert('No users found with the provided email addresses.');
        return;
      }

      // Get current diagram data
      const currentDiagram = await getDiagram(savedDiagramId);

      if (currentDiagram) {
        // Merge new user IDs with existing shared users
        const updatedSharedWith = Array.from(
          new Set([...currentDiagram.sharedWith, ...userIds]),
        );

        await updateDiagram(savedDiagramId, {
          sharedWith: updatedSharedWith,
        });

        alert(`Diagram shared successfully with ${userIds.length} user(s)!`);
      }
    } catch (error) {
      console.error('Error sharing diagram:', error);
      alert('Failed to share diagram');
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
            <button
              onClick={() =>
                savedDiagramId ? handleSave() : setShowTitleModal(true)
              }
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : savedDiagramId ? 'Update' : 'Save'}
            </button>
            {savedDiagramId && (
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
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
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
