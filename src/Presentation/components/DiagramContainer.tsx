import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EditableNode from './EditableNode';
import { useTheme } from '@/Application/hooks';

interface DiagramContainerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onDeleteNode: (nodeId: string) => void;
  role: 'owner' | 'edit' | 'view';
}

const DiagramContainer = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange,
  onDeleteNode,
  role,
}: DiagramContainerProps) => {
  const { theme } = useTheme();

  // Theme-aware styling
  const containerBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const flowBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';

  const onConnect = useCallback(
    (params: Connection) => {
      if (role === 'view') return;
      const newEdge = addEdge(params, edges);
      onEdgesChange(newEdge);
    },
    [edges, onEdgesChange, role]
  );

  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    if (role === 'view') return;
    const updatedNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
    );
    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange, role]);

  const nodeTypes: NodeTypes = useMemo(() => ({
    custom: (props: any) => <EditableNode {...props} onUpdateLabel={updateNodeLabel} onDeleteNode={onDeleteNode} role={role} />,
  }), [updateNodeLabel, onDeleteNode, role]);

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    if (role === 'view') return;
    const newNodes = applyNodeChanges(changes, nodes);
    onNodesChange(newNodes);
  }, [nodes, onNodesChange, role]);

  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    if (role === 'view') return;
    const newEdges = applyEdgeChanges(changes, edges);
    onEdgesChange(newEdges);
  }, [edges, onEdgesChange, role]);


  return (
    <div className={`h-[600px] w-full border ${containerBorder} rounded-lg transition-colors`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={role === 'view' ? undefined : handleNodesChange}
        onEdgesChange={role === 'view' ? undefined : handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className={flowBg}
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
