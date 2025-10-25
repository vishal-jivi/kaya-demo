import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { DiagramDocument } from '@/Domain/interfaces/diagram.interface';
import { db } from './firebase';

export const saveDiagram = async (
  diagramData: Omit<DiagramDocument, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  try {
    const diagramRef = doc(collection(db, 'diagrams'));
    const diagram: DiagramDocument = {
      id: diagramRef.id,
      ...diagramData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setDoc(diagramRef, diagram);
    return diagramRef.id;
  } catch (error) {
    console.error('Error saving diagram:', error);
    throw new Error(
      `Failed to save diagram: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const updateDiagram = async (
  diagramId: string,
  updates: Partial<
    Pick<DiagramDocument, 'title' | 'nodes' | 'edges' | 'sharedWith'>
  >,
): Promise<void> => {
  try {
    const diagramRef = doc(db, 'diagrams', diagramId);
    await updateDoc(diagramRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating diagram:', error);
    throw new Error(
      `Failed to update diagram: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const getDiagram = async (
  diagramId: string,
): Promise<DiagramDocument | null> => {
  try {
    const diagramDoc = await getDoc(doc(db, 'diagrams', diagramId));
    if (diagramDoc.exists()) {
      return diagramDoc.data() as DiagramDocument;
    } else {
      console.log('No such diagram document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching diagram:', error);
    throw new Error(
      `Failed to fetch diagram: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const getUserDiagrams = async (
  userId: string,
): Promise<DiagramDocument[]> => {
  try {
    const q = query(collection(db, 'diagrams'), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    const diagrams: DiagramDocument[] = [];
    querySnapshot.forEach((doc) => {
      diagrams.push(doc.data() as DiagramDocument);
    });
    return diagrams;
  } catch (error) {
    console.error('Error fetching user diagrams:', error);
    throw new Error(
      `Failed to fetch diagrams: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const getSharedDiagrams = async (
  userId: string,
): Promise<DiagramDocument[]> => {
  try {
    const q = query(
      collection(db, 'diagrams'),
      where('sharedWith', 'array-contains', userId),
    );
    const querySnapshot = await getDocs(q);
    const diagrams: DiagramDocument[] = [];
    querySnapshot.forEach((doc) => {
      diagrams.push(doc.data() as DiagramDocument);
    });
    return diagrams;
  } catch (error) {
    console.error('Error fetching shared diagrams:', error);
    throw new Error(
      `Failed to fetch shared diagrams: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const getAllAccessibleDiagrams = async (
  userId: string,
): Promise<DiagramDocument[]> => {
  try {
    const [ownedDiagrams, sharedDiagrams] = await Promise.all([
      getUserDiagrams(userId),
      getSharedDiagrams(userId),
    ]);

    // Combine and deduplicate by ID
    const allDiagrams = [...ownedDiagrams, ...sharedDiagrams];
    const uniqueDiagrams = Array.from(
      new Map(allDiagrams.map((diagram) => [diagram.id, diagram])).values(),
    );

    return uniqueDiagrams;
  } catch (error) {
    console.error('Error fetching all accessible diagrams:', error);
    throw new Error(
      `Failed to fetch diagrams: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
