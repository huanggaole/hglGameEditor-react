import { useState, useCallback, useEffect } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'
import MenuBar from './components/menu/MenuBar'
import { StartNode, PlotNode, EndNode, ContainerNode, EntryNode, ExitNode } from './components/CustomNodes'
import { EdgeControls } from './components/NodeEdgeControls'
import EdgeEditor from './components/edgeeditor'
import NodeEditor from './components/nodeeditor'
import { CustomEdge } from './components/CustomEdges'
import { PreviewComponent } from './components/previewer';
import VariableEditor, { CustomVariable } from './components/VariableEditor'
import OperPanel from './components/operpanel'

import { NODE_TYPES } from './components/nodeeditor/constants'

// 定义自定义节点类型映射
const nodeTypes = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.PLOT]: PlotNode,
  [NODE_TYPES.END]: EndNode,
  [NODE_TYPES.CONTAINER]: ContainerNode,
  [NODE_TYPES.ENTRY]: EntryNode,
  [NODE_TYPES.EXIT]: ExitNode
}

// 定义自定义边类型映射
const edgeTypes = {
  default: CustomEdge
}

import { initialNodes, initialEdges, createNode } from './app/initialState'


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [edgeControlsPosition, setEdgeControlsPosition] = useState({ x: 0, y: 0 })
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showVariableEditor, setShowVariableEditor] = useState(false)
  const [variables, setVariables] = useState<CustomVariable[]>([])
  const [currentContainerId, setCurrentContainerId] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([{id: 'root', name: 'root'}])

  // 将变量列表添加到window对象，使其可以在NodeEditor中访问
  useEffect(() => {
    // @ts-ignore
    window.appVariables = variables;
  }, [variables]);

  // 更新节点数据的函数
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === nodeId) {
          // 创建一个新的节点对象，更新data属性
          return {
            ...node,
            data: {
              ...node.data,
              ...data
            }
          };
        }
        return node;
      })
    );
  }, [setNodes])

  // 更新边数据的函数
  const updateEdgeData = useCallback((edgeId: string, data: any) => {
    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === edgeId) {
          // 创建新的边数据对象，确保所有属性都被正确保存
          const newData = {
            ...edge.data,
            ...data
          };
          
          return {
            ...edge,
            data: newData,
            // 只有当data中包含label时才更新边的标签
            ...(data.label ? { label: data.label } : {})
          };
        }
        return edge;
      })
    );
  }, [setEdges])

  // 删除节点及其连接的边
  const deleteNode = useCallback((nodeId: string) => {
    // 获取要删除的节点
    const nodeToDelete = nodes.find(node => node.id === nodeId);
    
    // 如果是收纳节点，需要同时删除其子节点和子边
    if (nodeToDelete && nodeToDelete.type === NODE_TYPES.CONTAINER) {
      // 找出所有子节点
      const childNodeIds = nodes
        .filter(node => node.data.parentId === nodeId)
        .map(node => node.id);
      
      // 递归删除子节点（如果子节点中有收纳节点）
      childNodeIds.forEach(childId => {
        deleteNode(childId);
      });
    }
    
    // 找出与该节点相连的所有边
    const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges);
    const edgeIdsToRemove = connectedEdges.map(edge => edge.id);
    
    // 删除边
    setEdges(eds => eds.filter(edge => !edgeIdsToRemove.includes(edge.id)));
    
    // 删除节点
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    
    // 清除选中状态
    setSelectedNode(null);
  }, [nodes, edges, setEdges, setNodes])

  // 删除边
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      // 根据源节点的Handle ID确定跳转方式
      let ntype = 'goto'; // 默认为直接跳转
      let btnname = '';
      
      // 检查是否是按钮跳转
      if (params.sourceHandle && params.sourceHandle.startsWith('button-')) {
        ntype = 'btnsto';
        // 尝试从源节点获取按钮名称
        const sourceNode = nodes.find(node => node.id === params.source);
        if (sourceNode?.data?.buttons) {
          const buttonIndex = parseInt(params.sourceHandle.replace('button-', ''));
          if (!isNaN(buttonIndex) && sourceNode.data.buttons[buttonIndex]) {
            btnname = sourceNode.data.buttons[buttonIndex].title || `按钮${buttonIndex+1}`;
          }
        }
      }
      
      // 创建带有跳转方式的边
      const edgeWithType = {
        ...params,
        data: { ntype, btnname, updateVariables: {} }
      };
      
      // 添加边
      const newEdge = addEdge(edgeWithType, edges)[edges.length];
      
      // 设置新添加的边为编辑状态，自动弹出编辑框
      setTimeout(() => {
        setEditingEdge(newEdge);
      }, 100);
      
      return setEdges((eds) => addEdge(edgeWithType, eds));
    },
    [edges, setEdges, nodes]
  )

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
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge]);

  // 处理节点点击事件
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // 设置选中节点
    setSelectedNode(node);
    // 清除选中的边，实现边失焦后隐藏控制按钮
    setSelectedEdge(null);
  }, []);

  // 处理边点击事件
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    // 设置选中边
    setSelectedEdge(edge);
    setSelectedNode(null);
    
    // 获取边的路径元素
    const edgeElement = document.getElementById(edge.id);
    if (edgeElement && edgeElement instanceof SVGPathElement) {
      // 获取边的中点位置
      const pathLength = edgeElement.getTotalLength();
      const midPoint = edgeElement.getPointAtLength(pathLength / 2);
      
      // 设置边控制按钮的位置为边的中点
      setEdgeControlsPosition({
        x: midPoint.x,
        y: midPoint.y
      });
    }
  }, []);

  // 处理画布点击事件，清除选中状态
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MenuBar
        nodes={nodes}
        edges={edges}
        variables={variables}
        setNodes={setNodes}
        setEdges={setEdges}
        setVariables={setVariables}
        setSelectedEdge={setSelectedEdge}
        setShowPreview={setShowPreview}
        setShowVariableEditor={setShowVariableEditor}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <OperPanel 
          nodes={nodes}
          setNodes={setNodes}
          setSelectedEdge={setSelectedEdge}
          createNode={createNode}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          currentContainerId={currentContainerId}
          setCurrentContainerId={setCurrentContainerId}
          setEdges={setEdges}
        />
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                onEdit: (node: Node) => setEditingNode(node),
                onDelete: deleteNode,
                onEnter: (nodeId: string) => {
                  // 处理进入收纳节点的逻辑
                  setCurrentContainerId(nodeId);
                  // 获取节点名称
                  const node = nodes.find(n => n.id === nodeId);
                  const nodeName = node?.data?.mname || nodeId;
                  // 更新路径
                  setCurrentPath(prev => [...prev, {id: nodeId, name: nodeName}]);
                  console.log(`进入收纳节点: ${nodeId}`);
                  // 这里可以添加更多的逻辑，比如显示子节点等
                }
              },
              // 根据当前容器ID过滤节点，只显示当前容器下的节点
              hidden: node.data.parentId !== currentContainerId
            }))}
            edges={edges.filter(edge => {
              // 过滤边，只显示当前容器下的边
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              return sourceNode?.data.parentId === currentContainerId && 
                     targetNode?.data.parentId === currentContainerId;
            })}
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
            {editingNode && (
              <NodeEditor 
                node={editingNode} 
                onClose={() => setEditingNode(null)}
                updateNode={updateNodeData}
              />
            )}
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
    </div>
  )
}

export default App