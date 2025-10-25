import type { Edge, Node } from '@xyflow/react';

export type PermissionLevel = 'view' | 'edit';

export interface SharedUser {
  userId: string;
  permission: PermissionLevel;
  email?: string; // Optional email field for sharing process
}

export interface DiagramDocument {
  id: string;
  title: string;
  nodes: Node[];
  edges: Edge[];
  ownerId: string;
  ownerEmail: string;
  sharedWith: SharedUser[]; // Array of shared users with their permissions
  createdAt: number;
  updatedAt: number;
}
