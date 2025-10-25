import type { Edge, Node } from '@xyflow/react';

export interface DiagramDocument {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  ownerId: string;
  ownerEmail: string;
  sharedWith: string[]; // Array of user IDs who have access
  createdAt: number;
  updatedAt: number;
}
