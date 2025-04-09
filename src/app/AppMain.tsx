import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { StartNode, PlotNode, EndNode, ContainerNode } from '../components/CustomNodes';
import { EdgeControls } from '../components/NodeEdgeControls';
import EdgeEditor from '../components/edgeeditor';
import { CustomEdge } from '../components/CustomEdges';

export const useFlowState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = React.useState<Edge | null>(null);
  const [edgeControlsPosition, setEdgeControlsPosition] = React.useState({ x: 0, y: 0 });
  const [editingEdge, setEditingEdge] = React.useState<Edge | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges)[edges.length];
      setTimeout(() => {
        setEditingEdge(newEdge);
      }, 100);
      return setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    
    const edgeElement = document.getElementById(edge.id);
    if (edgeElement && edgeElement instanceof SVGPathElement) {
      const pathLength = edgeElement.getTotalLength();
      const midPoint = edgeElement.getPointAtLength(pathLength / 2);
      
      setEdgeControlsPosition({
        x: midPoint.x,
        y: midPoint.y
      });
    }
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    selectedNode,
    selectedEdge,
    edgeControlsPosition,
    editingEdge,
    setEditingEdge,
    setNodes,
    setEdges
  };
};

export const AppMain = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  selectedNode,
  selectedEdge,
  edgeControlsPosition,
  editingEdge,
  setEditingEdge,
  updateNodeData,
  deleteNode,
  deleteEdge,
  updateEdgeData,
  editingNode,
  nodeTypes,
  edgeTypes
}: {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (params: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  edgeControlsPosition: { x: number; y: number };
  editingEdge: Edge | null;
  setEditingEdge: (edge: Edge | null) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdgeData: (edgeId: string, data: any) => void;
  editingNode: Node | null;
  nodeTypes: any;
  edgeTypes: any;
}) => {
  return (
    <div style={{ flex: 1 }}>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onEdit: (node: Node) => setEditingNode(node),
            onDelete: deleteNode
          }
        }))}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
      >
        <Controls />
        <Background />
        {editingEdge && (
          <EdgeEditor 
            edge={editingEdge} 
            onClose={() => setEditingEdge(null)}
            updateEdge={updateEdgeData}
          />
        )}
        {selectedEdge && (
          <div style={{
            position: 'absolute',
            left: `${edgeControlsPosition.x}px`,
            top: `${edgeControlsPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            zIndex: 999
          }}>
            <EdgeControls 
              edge={selectedEdge}
              onEdit={(edge) => setEditingEdge(edge)}
              onDelete={deleteEdge}
            />
          </div>
        )}
      </ReactFlow>
    </div>
  );
};