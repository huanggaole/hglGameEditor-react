import { useState, useEffect, useCallback } from 'react';
import { Node, Edge, Connection } from 'reactflow';
import { CustomVariable } from '../components/VariableEditor';

export const useAppState = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [containerNodes, setContainerNodes] = useState<{[key: string]: {nodes: Node[], edges: Edge[]}}>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showVariableEditor, setShowVariableEditor] = useState(false);
  const [edgeControlsPosition, setEdgeControlsPosition] = useState({ x: 0, y: 0 });

  // 将变量列表添加到window对象
  useEffect(() => {
    // @ts-ignore
    window.appVariables = variables;
  }, [variables]);

  // 进入收纳节点
  const enterContainer = useCallback((nodeId: string) => {
    setContainerNodes(prev => ({
      ...prev,
      [currentPath.join('/')]: {
        nodes: nodes.filter(n => n.id !== nodeId),
        edges
      }
    }));
    setCurrentPath(prev => [...prev, nodeId]);
    setNodes([]);
    setEdges([]);
  }, [currentPath, nodes, edges]);

  // 返回上级路径
  const goBack = useCallback(() => {
    if (currentPath.length <= 1) return;
    
    const parentPath = currentPath.slice(0, -1).join('/');
    const parentContent = containerNodes[parentPath] || { nodes: [], edges: [] };
    
    setNodes(parentContent.nodes);
    setEdges(parentContent.edges);
    setCurrentPath(prev => prev.slice(0, -1));
  }, [currentPath, containerNodes]);

  // 更新节点数据
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes(nds => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...data
          }
        };
      }
      return node;
    }));
  }, []);

  // 更新边数据
  const updateEdgeData = useCallback((edgeId: string, data: any) => {
    setEdges(eds => eds.map(edge => {
      if (edge.id === edgeId) {
        const newData = {
          ...edge.data,
          ...data
        };
        return {
          ...edge,
          data: newData,
          ...(data.label ? { label: data.label } : {})
        };
      }
      return edge;
    }));
  }, []);

  // 删除节点
  const deleteNode = useCallback((nodeId: string) => {
    setEdges(eds => eds.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  }, []);

  // 删除边
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    setSelectedEdge(null);
  }, []);

  // 处理连接
  const onConnect = useCallback((params: Connection) => {
    const newEdge = addEdge(params, edges)[edges.length];
    setTimeout(() => {
      setEditingEdge(newEdge);
    }, 100);
    return setEdges(eds => addEdge(params, eds));
  }, [edges]);

  // 处理节点点击
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  // 处理边点击
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

  // 处理画布点击
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  return {
    nodes,
    edges,
    variables,
    currentPath,
    containerNodes,
    selectedNode,
    selectedEdge,
    editingNode,
    editingEdge,
    showPreview,
    showVariableEditor,
    edgeControlsPosition,
    setNodes,
    setEdges,
    setVariables,
    setCurrentPath,
    setContainerNodes,
    setSelectedNode,
    setSelectedEdge,
    setEditingNode,
    setEditingEdge,
    setShowPreview,
    setShowVariableEditor,
    setEdgeControlsPosition,
    enterContainer,
    goBack,
    updateNodeData,
    updateEdgeData,
    deleteNode,
    deleteEdge,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick
  };
};