import { useState, useEffect, useCallback } from 'react'
import { Node, Edge, Connection, addEdge, getConnectedEdges } from 'reactflow'
import { AppMain, useFlowState } from './app/AppMain'
import { AppHeader } from './app/AppHeader'
import { AppSidebar } from './app/AppSidebar'
import PreviewComponent from './components/PreviewComponent'
import VariableEditor, { CustomVariable } from './components/VariableEditor'
import NodeEditor from './components/NodeEditor'
import { StartNode, PlotNode, EndNode, ContainerNode } from './components/CustomNodes'
import { CustomEdge } from './components/CustomEdges'
import { handleNew, handleSave, handleLoad } from './utils/menuHandlers'
import EdgeEditor from './components/edgeeditor'
import { EdgeControls } from './components/NodeEdgeControls'
import { Controls, Background } from 'reactflow'

// 定义自定义节点类型映射
const nodeTypes = {
  start: StartNode,
  plot: PlotNode,
  end: EndNode,
  container: ContainerNode
}

// 定义自定义边类型映射
const edgeTypes = {
  default: CustomEdge
}

// 初始化边数组
const initialEdges: Edge[] = []

function App() {
  // 使用自定义Hook管理流程图状态
  const {
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
    setEdges,
    setSelectedNode,
    setSelectedEdge,
    updateNodeData,
    updateEdgeData,
    deleteNode,
    deleteEdge
  } = useFlowState();
  
  // 本地状态管理
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showVariableEditor, setShowVariableEditor] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [containerNodes, setContainerNodes] = useState<{[key: string]: {nodes: Node[], edges: Edge[]}>({});

  // 进入收纳节点
  const enterContainer = useCallback((nodeId: string) => {
    // 保存当前层级的节点和边到containerNodes
    setContainerNodes(prev => ({
      ...prev,
      [currentPath.join('/')]: {
        nodes: nodes.filter(n => n.id !== nodeId), // 排除当前收纳节点
        edges
      }
    }));

    // 更新当前路径
    setCurrentPath(prev => [...prev, nodeId]);

    // 清空当前画布，准备显示子节点
    setNodes([]);
    setEdges([]);
  }, [currentPath, nodes, edges, setNodes, setEdges]);

  // 返回上级路径
  const goBack = useCallback(() => {
    if (currentPath.length <= 1) return; // 已经在根路径

    // 获取上一级路径的节点和边
    const parentPath = currentPath.slice(0, -1).join('/');
    const parentContent = containerNodes[parentPath] || { nodes: [], edges: [] };

    // 更新画布
    setNodes(parentContent.nodes);
    setEdges(parentContent.edges);

    // 更新当前路径
    setCurrentPath(prev => prev.slice(0, -1));
  }, [currentPath, containerNodes, setNodes, setEdges]);
  
  // 将变量列表添加到window对象，使其可以在NodeEditor中访问
  useEffect(() => {
    // @ts-ignore
    window.appVariables = variables;
  }, [variables]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 如果正在编辑节点或边，则不处理Delete键，避免误删节点或边
      if (editingNode || editingEdge) {
        return;
      }
      
      if (event.key === 'Delete') {
        if (selectedNode) {
          deleteNode(selectedNode.id);
        } else if (selectedEdge) {
          deleteEdge(selectedEdge.id);
        }
      } else if (event.key === ' ') { // 空格键触发编辑功能
        if (selectedNode) {
          setEditingNode(selectedNode);
        } else if (selectedEdge) {
          setEditingEdge(selectedEdge);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge, editingNode, editingEdge, setEditingEdge]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader 
        onNew={() => {
          handleNew(setNodes, setEdges, setVariables);
          setSelectedEdge(null);
        }}
        onSave={() => handleSave(nodes, edges, variables)}
        onLoad={() => {
          handleLoad(setNodes, setEdges, setVariables);
          setSelectedEdge(null);
        }}
        onPreview={() => setShowPreview(true)}
        onVariableEdit={() => setShowVariableEditor(true)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <AppSidebar 
          nodes={nodes}
          setNodes={setNodes}
          currentPath={currentPath}
          goBack={goBack}
          enterContainer={enterContainer}
        />
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
      </div>
      {showPreview && (
        <PreviewComponent 
          nodes={nodes}
          edges={edges}
          onClose={() => setShowPreview(false)}
        />
      )}
      {showVariableEditor && (
        <VariableEditor
          variables={variables}
          onClose={() => setShowVariableEditor(false)}
          onSave={setVariables}
        />
      )}
      {editingNode && (
        <NodeEditor 
          node={editingNode} 
          onClose={() => setEditingNode(null)}
          updateNode={updateNodeData}
        />
      )}
    </div>
  )
}

export default App