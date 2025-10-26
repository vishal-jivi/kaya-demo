import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useTheme } from '@/Application/hooks';

interface EditableNodeProps {
  data: { label: string };
  selected: boolean;
  id: string;
  onUpdateLabel: (nodeId: string, newLabel: string) => void;
  onDeleteNode: (nodeId: string) => void;
  role: 'owner' | 'edit' | 'view';
}

const EditableNode = ({ data, selected, id, onUpdateLabel, onDeleteNode, role }: EditableNodeProps) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Theme-aware styling
  const nodeBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const nodeBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const selectedBorder = theme === 'dark' ? 'border-blue-400' : 'border-blue-500';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-900';

  const handleDoubleClick = () => {
    if (role === 'view') return;
    console.log('Double clicked to edit node:', id);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onUpdateLabel(id, label);
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    onUpdateLabel(id, label);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role === 'view') return;
    if (window.confirm('Are you sure you want to delete this node?')) {
      onDeleteNode(id);
    }
  };

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md ${nodeBg} border-2 ${
        selected ? selectedBorder : nodeBorder
      } ${role === 'view' ? 'cursor-default' : 'cursor-pointer'} relative transition-colors`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      {/* {selected && role !== 'view' && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 z-10 align-middle"
          title="Delete node"
        >
          ×
        </button>
      )} */}
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`w-full border-none outline-none text-center ${inputBg}`}
          autoFocus
        />
      ) : (
        <div className={`text-center ${textColor}`}>{label}</div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default EditableNode;
