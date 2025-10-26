import { useTheme } from '@/Application/hooks';

const DiagramInstructions = () => {
  const { theme } = useTheme();

  // Theme-aware styling
  const containerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`mt-6 p-4 ${containerBg} rounded-lg`}>
      <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Getting Started</h3>
      <ul className={`list-disc list-inside space-y-1 text-sm ${secondaryTextColor}`}>
        <li>Drag nodes to move them around</li>
        <li>Double-click on any node to edit its label</li>
        <li>Click and drag from a node's edge to create connections</li>
        <li>Use the controls in the bottom-left to zoom and fit the view</li>
        <li>Use the minimap in the bottom-right to navigate large diagrams</li>
      </ul>
    </div>
  );
};

export default DiagramInstructions;
