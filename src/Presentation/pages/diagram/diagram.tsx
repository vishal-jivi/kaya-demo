import { Header, DiagramContainer, DiagramInstructions } from '@/Presentation/components';
import { useState, useEffect } from 'react';
import { type Edge, type Node } from '@xyflow/react';


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

const Diagram = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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

  return (
    <div className="diagram">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-lg mb-6">Create and edit your flow diagrams</p>        
        <DiagramContainer
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
        />
        <DiagramInstructions />
      </div>
    </div>
  );
};

export default Diagram;
