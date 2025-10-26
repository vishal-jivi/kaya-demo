import { useState, useEffect, useCallback } from "react";
import type { Edge, Node } from "@xyflow/react";
import { useFirebase } from "@/Application/contexts";
import {
  deleteDiagram,
  getDiagram,
  getUserIdsByEmails,
  saveDiagram,
  updateDiagram,
  shareDiagramWithUsers,
} from "@/Infra";
import type { SharedUser } from "@/Domain/interfaces/diagram.interface";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    data: { label: "Start Node" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "custom",
    data: { label: "Process Node" },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "End Node" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

export const useDiagram = (diagramId?: string) => {
  const { user } = useFirebase();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDiagramId, setSavedDiagramId] = useState<string | null>(null);
  const [diagramTitle, setDiagramTitle] = useState("My Diagram");
  const [role, setRole] = useState<"owner" | "edit" | "view">("owner");
  const [loading, setLoading] = useState(false);

  // Load diagram if ID is present
  useEffect(() => {
    const loadDiagram = async () => {      
      if (diagramId && user) {
        setLoading(true);
        try {
          const diagram = await getDiagram(diagramId);
          if (diagram) {
            setNodes(diagram.nodes);
            setEdges(diagram.edges);
            setDiagramTitle(diagram.title);
            setSavedDiagramId(diagram.id);
            if (diagram.ownerId === user.uid) {
              setRole("owner");
            } else {
              const sharedUser = diagram.sharedWith.find(
                (su) => su.userId === user.uid
              );
              setRole(sharedUser ? sharedUser.permission : "view");
            }
          } else {
            alert("Diagram not found");
          }
        } catch (error) {
          console.error("Error loading diagram:", error);
          alert("Failed to load diagram");
        } finally {
          setLoading(false);
        }
      }
    };

    loadDiagram();
  }, [diagramId, user]);

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save diagrams");
      return;
    }

    if (!savedDiagramId) {
      return false; // Indicate that title modal should be shown
    }

    setIsSaving(true);
    try {
      await updateDiagram(savedDiagramId, {
        title: diagramTitle,
        nodes,
        edges,
      });
      alert("Diagram updated successfully!");
      return true;
    } catch (error) {
      console.error("Error saving diagram:", error);
      alert("Failed to save diagram");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNew = async (title: string) => {
    if (!user) {
      alert("Please log in to save diagrams");
      return false;
    }

    setIsSaving(true);
    try {
      const diagramId = await saveDiagram({
        title,
        nodes,
        edges,
        ownerId: user.uid,
        ownerEmail: user.email || "",
        sharedWith: [],
      });
      setSavedDiagramId(diagramId);
      setDiagramTitle(title);
      alert("Diagram saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving diagram:", error);
      alert("Failed to save diagram");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (sharedUsers: SharedUser[]) => {
    if (!user || !savedDiagramId) {
      alert("Please save the diagram first before sharing");
      return false;
    }

    try {
      // Extract emails from sharedUsers (we need to get userIds from emails)
      const emails = sharedUsers
        .map((user) => user.email || "")
        .filter((email) => email);

      if (emails.length === 0) {
        alert("Please provide at least one valid email address.");
        return false;
      }

      console.log("Looking up user IDs for emails:", emails);
      const emailToUserIdMap = await getUserIdsByEmails(emails);

      if (emailToUserIdMap.size === 0) {
        alert(
          "No users found with the provided email addresses. Please make sure the users have registered accounts."
        );
        return false;
      }

      // Check which emails were not found
      const notFoundEmails = emails.filter(
        (email) => !emailToUserIdMap.has(email)
      );
      if (notFoundEmails.length > 0) {
        console.warn("Some emails were not found:", notFoundEmails);
      }

      // Create SharedUser objects with actual userIds
      const sharedUsersWithIds: SharedUser[] = sharedUsers
        .filter(
          (sharedUser) =>
            sharedUser.email && emailToUserIdMap.has(sharedUser.email)
        )
        .map((sharedUser) => ({
          userId: emailToUserIdMap.get(sharedUser.email!)!,
          permission: sharedUser.permission,
        }));

      if (sharedUsersWithIds.length === 0) {
        alert("No valid users found to share with.");
        return false;
      }

      console.log("Sharing diagram with users:", sharedUsersWithIds);
      await shareDiagramWithUsers(savedDiagramId, sharedUsersWithIds);

      const successMessage =
        notFoundEmails.length > 0
          ? `Diagram shared successfully with ${sharedUsersWithIds.length} user(s)! Note: ${notFoundEmails.length} email(s) were not found.`
          : `Diagram shared successfully with ${sharedUsersWithIds.length} user(s)!`;

      alert(successMessage);
      return true;
    } catch (error) {
      console.error("Error sharing diagram:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to share diagram: ${errorMessage}`);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!user || !savedDiagramId) {
      alert("No diagram to delete");
      return false;
    }

    if (role !== "owner") {
      alert("Only the diagram owner can delete this diagram");
      return false;
    }

    try {
      await deleteDiagram(savedDiagramId);
      alert("Diagram deleted successfully!");
      // Reset the diagram state
      setNodes(initialNodes);
      setEdges(initialEdges);
      setSavedDiagramId(null);
      setDiagramTitle("My Diagram");
      return true;
    } catch (error) {
      console.error("Error deleting diagram:", error);
      alert("Failed to delete diagram");
      return false;
    }
  };

  const addNode = useCallback(() => {
    if (role === "view") return;
    console.log("triggering addNode");

    // Generate a unique ID based on timestamp to avoid conflicts
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: "custom",
      data: { label: "New Node" },
      position: {
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
      },
    };
    console.log("Adding new node:", newNode);

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes, newNode];
      console.log("Updated nodes:", newNodes);
      return newNodes;
    });
  }, [role, setNodes]);

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (role === "view") return;

      // Remove the node
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

      // Remove all edges connected to this node
      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );
    },
    [role, setNodes, setEdges]
  );

  return {
    // State
    nodes,
    edges,
    isSaving,
    savedDiagramId,
    diagramTitle,
    setDiagramTitle,
    role,
    loading,

    // Handlers
    handleNodesChange,
    handleEdgesChange,
    handleSave,
    handleSaveNew,
    handleShare,
    handleDelete,
    addNode,
    deleteNode,
  };
};
