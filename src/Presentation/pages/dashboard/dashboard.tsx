import { useNavigate } from 'react-router';
import { Header } from '@/Presentation/components';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/Application/contexts';
import { getAllAccessibleDiagrams } from '@/Infra';
import type { DiagramDocument } from '@/Domain/interfaces';

const Dashboard = () => {
  const navigate = useNavigate();
  const [diagrams, setDiagrams] = useState<DiagramDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();

  useEffect(() => {
    if (user) {
      loadDiagrams();
    }
  }, [user]);

  const loadDiagrams = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const accessibleDiagrams = await getAllAccessibleDiagrams(user.uid);
      console.log('Accessible Diagrams:', accessibleDiagrams);
      setDiagrams(accessibleDiagrams);
    } catch (error) {
      console.error('Error loading diagrams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDiagram = (diagramId: string) => {
    navigate(`/diagram/${diagramId}`);
  };

  const handleCreateDiagram = () => {
    navigate('/diagram');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Diagrams</h1>
          <button
            type="button"
            onClick={handleCreateDiagram}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Diagram
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading diagrams...</div>
        ) : diagrams.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">No diagrams yet</p>
            <button
              type="button"
              onClick={handleCreateDiagram}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Your First Diagram
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                onClick={() => handleOpenDiagram(diagram.id)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2 truncate">{diagram.title}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Owner: {diagram.ownerEmail}</div>
                  <div>Modified: {formatDate(diagram.updatedAt)}</div>
                  {diagram.sharedWith.length > 0 && (
                    <div className="text-blue-600">
                      Shared with {diagram.sharedWith.length} user(s)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
