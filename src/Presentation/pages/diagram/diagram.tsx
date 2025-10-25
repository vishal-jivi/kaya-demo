import { useState } from 'react';
import { useParams } from 'react-router';
import { useDiagram } from '@/Application/hooks';
import {
  DiagramContainer,
  DiagramInstructions,
  Header,
  ShareModal,
  TitleModal,
} from '@/Presentation/components';
import type { SharedUser } from '@/Domain/interfaces/diagram.interface';


const Diagram = () => {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  
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
    </div>
  );
};

export default Diagram;
