import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

interface EditableNodeProps {
  data: { label: string };
  selected: boolean;
  id: string;
  onUpdateLabel: (nodeId: string, newLabel: string) => void;
}

const EditableNode = ({ data, selected, id, onUpdateLabel }: EditableNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
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

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none outline-none text-center"
          autoFocus
        />
      ) : (
        <div className="text-center">{label}</div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default EditableNode;
