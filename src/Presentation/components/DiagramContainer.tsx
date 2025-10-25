import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EditableNode from './EditableNode';

interface DiagramContainerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const DiagramContainer = ({ 
  initialNodes, 
  initialEdges, 
  onNodesChange, 
  onEdgesChange 
}: DiagramContainerProps) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  }, [setNodes]);

  const nodeTypes: NodeTypes = useMemo(() => ({
    custom: (props: any) => <EditableNode {...props} onUpdateLabel={updateNodeLabel} />,
  }), [updateNodeLabel]);

  // Notify parent components of changes
  useMemo(() => {
    onNodesChange(nodes);
  }, [nodes, onNodesChange]);

  useMemo(() => {
    onEdgesChange(edges);
  }, [edges, onEdgesChange]);

  return (
    <div className="h-[600px] w-full border border-gray-300 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default DiagramContainer;
