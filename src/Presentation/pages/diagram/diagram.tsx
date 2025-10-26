import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDiagram } from '@/Application/hooks';
import {
  DiagramContainer,
  DiagramInstructions,
  Header,
  ShareModal,
  TitleModal,
  DeleteModal,
} from '@/Presentation/components';
import type { SharedUser } from '@/Domain/interfaces/diagram.interface';


const Diagram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const {
    nodes,
    edges,
    isSaving,
    savedDiagramId,
    diagramTitle,
    setDiagramTitle,
    role,
    loading,
    handleNodesChange,
    handleEdgesChange,
    handleSave,
    handleSaveNew,
    handleShare,
    handleDelete,
    addNode,
    deleteNode,
  } = useDiagram(id);

  const handleSaveClick = async () => {
    const result = await handleSave();
    if (result === false) {
      setShowTitleModal(true);
    }
  };

  const handleSaveNewClick = async (title: string) => {
    const result = await handleSaveNew(title);
    if (result) {
      setShowTitleModal(false);
    }
  };

  const handleShareClick = async (sharedUsers: SharedUser[]) => {
    await handleShare(sharedUsers);
  };

  const handleDeleteClick = async () => {
    const result = await handleDelete();
    if (result) {
      setShowDeleteModal(false);
      navigate('/dashboard');
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
            {role !== 'view' && (
              <button
                onClick={addNode}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                title="Add new node"
              >
                + Add Node
              </button>
            )}
            {role !== 'view' && <button
              onClick={handleSaveClick}
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
            {savedDiagramId && role === 'owner' && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                title="Delete diagram"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <DiagramContainer
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onDeleteNode={deleteNode}
          role={role}
        />
        <DiagramInstructions />
      </div>

      {/* Title Modal */}
      <TitleModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onSave={handleSaveNewClick}
        title={diagramTitle}
        setTitle={setDiagramTitle}
        isSaving={isSaving}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareClick}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteClick}
        diagramTitle={diagramTitle}
      />
    </div>
  );
};

export default Diagram;
