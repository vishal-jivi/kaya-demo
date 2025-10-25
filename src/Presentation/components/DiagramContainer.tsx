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
  role: 'owner' | 'edit' | 'view';
}

const DiagramContainer = ({ 
  initialNodes, 
  initialEdges, 
  onNodesChange, 
  onEdgesChange,
  role,
}: DiagramContainerProps) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      if (role === 'view') return;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, role]
  );

  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    if (role === 'view') return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  }, [setNodes, role]);

  const nodeTypes: NodeTypes = useMemo(() => ({
    custom: (props: any) => <EditableNode {...props} onUpdateLabel={updateNodeLabel} role={role} />,
  }), [updateNodeLabel, role]);

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
        onNodesChange={role === 'view' ? undefined : onNodesChangeInternal}
        onEdgesChange={role === 'view' ? undefined : onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        nodesDraggable={role !== 'view'}
        nodesConnectable={role !== 'view'}
        elementsSelectable={role !== 'view'}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default DiagramContainer;
