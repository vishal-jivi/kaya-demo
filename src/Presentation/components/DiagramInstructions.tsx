const DiagramInstructions = () => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
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
