import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  getConnectedEdges,
  XYPosition,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import MenuBar from './components/menu/MenuBar'
import { StartNode, PlotNode, EndNode, ContainerNode, EntryNode, ExitNode } from './components/CustomNodes'
import EdgeEditor from './components/edgeeditor'
import NodeEditor from './components/nodeeditor'
import { CustomEdge } from './components/CustomEdges'
import { PreviewComponent } from './components/previewer';
import CustomControls from './components/CustomControls';
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

import { initialNodes, initialEdges, createNode, createEdge } from './app/initialState'


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showVariableEditor, setShowVariableEditor] = useState(false)
  const [variables, setVariables] = useState<CustomVariable[]>([])
  const [currentContainerId, setCurrentContainerId] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([{id: 'root', name: 'root'}])
  const [copiedNode, setCopiedNode] = useState<Node | null>(null)

  // 将变量列表添加到window对象，使其可以在NodeEditor中访问
  useEffect(() => {
    // @ts-ignore
    window.appVariables = variables;
  }, [variables]);

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

  // 更新节点数据的函数
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    // 先更新节点数据
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
    
    // 如果更新了transitionType或buttons字段，同步更新相关的边的sourceHandle
    if (data.transitionType !== undefined || data.buttons !== undefined) {
      // 找出从该节点出发的所有边
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      
      // 更新每条出边的sourceHandle
      outgoingEdges.forEach(edge => {
        // 获取源节点的最新数据
        const sourceNode = nodes.find(node => node.id === nodeId);
        if (!sourceNode) return;
        
        // 修复：当transitionType从goto变为btnsto时，需要更新边的sourceHandle
        if (data.transitionType === 'btnsto' && (!edge.sourceHandle || !edge.sourceHandle.startsWith('button-'))) {
          // 如果有按钮数据，使用第一个按钮作为sourceHandle
          if (data.buttons && data.buttons.length > 0) {
            // 更新边的sourceHandle为第一个按钮
            setEdges(eds => eds.map(e => {
              if (e.id === edge.id) {
                return {
                  ...e,
                  sourceHandle: 'button-0'
                };
              }
              return e;
            }));
            
            // 同时更新当前边对象的sourceHandle，以便后续处理
            edge.sourceHandle = 'button-0';
          }
        }
      });
    }
  }, [setNodes, edges, nodes, setEdges])

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
        // 获取子节点
        const childNode = nodes.find(node => node.id === childId);
        // 如果子节点也是收纳节点，递归删除
        if (childNode && childNode.type === NODE_TYPES.CONTAINER) {
          deleteNode(childId);
        }
      });
      
      // 找出所有子节点之间的边（完全在容器内部的边）
      const internalEdges = edges.filter(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        return sourceNode?.data.parentId === nodeId && targetNode?.data.parentId === nodeId;
      });
      
      // 删除内部边
      const internalEdgeIds = internalEdges.map(edge => edge.id);
      setEdges(eds => eds.filter(edge => !internalEdgeIds.includes(edge.id)));
      
      // 删除所有子节点
      setNodes(nds => nds.filter(node => node.data.parentId !== nodeId));
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
      // 边的数据，只保留updateVariables字段
      const edgeData = { updateVariables: {} };
      
      // 使用createEdge函数创建新边
      const newEdge = createEdge(params, edges, edgeData);
      
      // 设置新添加的边为编辑状态，自动弹出编辑框
      setTimeout(() => {
        setEditingEdge(newEdge);
      }, 100);
      
      // 添加新边到边集合
      return setEdges((eds) => [...eds, newEdge]);
    },
    [edges, setEdges]
  )

  // 复制节点函数
  const copyNode = useCallback((node: Node) => {
    // 只复制非开始节点和非入口节点
    if (node.type !== 'start' && node.type !== 'entry') {
      setCopiedNode(node);
      console.log('节点已复制:', node.id);
    }
  }, []);

  // 粘贴节点函数
  const pasteNode = useCallback(() => {
    if (!copiedNode || !copiedNode.type) return;
    
    // 计算新节点位置，在原节点位置基础上偏移一点
    const newPosition: XYPosition = {
      x: copiedNode.position.x + 50,
      y: copiedNode.position.y + 50
    };
    
    // 使用createNode函数创建新节点，它会使用累加器生成ID
    // 如果是收纳节点，设置createEntryNode为false，避免自动创建入口节点
    const newNode = createNode(
      copiedNode.type,
      newPosition,
      nodes,
      currentContainerId,
      copiedNode.type !== NODE_TYPES.CONTAINER // 只有非收纳节点才自动创建入口节点
    );
    
    // 复制原节点的数据到新节点
    newNode.data = {
      ...newNode.data,
      ...copiedNode.data,
      parentId: currentContainerId, // 确保在当前容器中创建
      // 保留原始的回调函数
      onEdit: copiedNode.data.onEdit,
      onDelete: copiedNode.data.onDelete,
      onCopy: copiedNode.data.onCopy
    };
    
    // 创建一个ID映射表，用于更新边的引用
    const idMapping: {[key: string]: string} = {
      [copiedNode.id]: newNode.id
    };
    
    // 要添加的新节点和边
    const newNodes: Node[] = [newNode];
    const newEdges: Edge[] = [];
    
    // 如果是收纳节点，需要复制其所有子节点和子边
    if (copiedNode.type === NODE_TYPES.CONTAINER) {
      // 找出所有子节点
      const childNodes = nodes.filter(node => node.data.parentId === copiedNode.id);
      
      // 复制每个子节点
      childNodes.forEach(childNode => {
        if (!childNode || !childNode.type) {
          console.warn(`跳过无效子节点: ${childNode?.id}`);
          return;
        }
        // 计算子节点的新位置，保持相对位置不变
        const childOffset = {
          x: childNode.position.x - copiedNode.position.x,
          y: childNode.position.y - copiedNode.position.y
        };
        
        const newChildPosition = {
          x: newNode.position.x + childOffset.x,
          y: newNode.position.y + childOffset.y
        };
        
        // 创建新的子节点，使用createNode函数确保ID使用累加器生成
        const newChildNode = createNode(
          childNode.type,
          newChildPosition,
          [...nodes, ...newNodes],
          newNode.id // 设置父节点为新创建的收纳节点
        );
        
        // 复制子节点的数据
        newChildNode.data = {
          ...newChildNode.data,
          ...childNode.data,
          parentId: newNode.id, // 确保父节点ID正确
          // 保留原始的回调函数
          onEdit: childNode.data.onEdit,
          onDelete: childNode.data.onDelete,
          onCopy: childNode.data.onCopy
        };
        
        // 添加到ID映射表
        idMapping[childNode.id] = newChildNode.id;
        
        // 添加到新节点列表
        newNodes.push(newChildNode);
        
        // 如果子节点也是收纳节点，递归复制其子节点
        if (childNode.type === NODE_TYPES.CONTAINER) {
          // 这里可以实现递归复制，但为了简化，我们只处理一层子节点
          // 在实际应用中，可以使用递归函数处理多层嵌套
        }
      });
      
      // 找出所有在收纳节点内部的边
      const internalEdges = edges.filter(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        return sourceNode?.data.parentId === copiedNode.id && 
               targetNode?.data.parentId === copiedNode.id;
      });
      
      // 复制每条内部边，更新源节点和目标节点的引用
      internalEdges.forEach(edge => {
        // 创建新边，更新源节点和目标节点的ID
        const newEdge: Edge = {
          ...edge,
          id: `e${nodes.length + newNodes.length + newEdges.length + 1}`, // 使用简短的累加ID
          source: idMapping[edge.source], // 使用ID映射表更新源节点引用
          target: idMapping[edge.target], // 使用ID映射表更新目标节点引用
          // 复制边的数据
          data: { ...edge.data }
        };
        
        // 添加到新边列表
        newEdges.push(newEdge);
      });
    }
    
    // 添加所有新节点和新边
    setNodes(nds => [...nds, ...newNodes]);
    setEdges(eds => [...eds, ...newEdges]);
    
    console.log(`节点已粘贴: ${newNode.id}，共复制了 ${newNodes.length} 个节点和 ${newEdges.length} 条边`);
  }, [copiedNode, setNodes, setEdges, currentContainerId, nodes, edges]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 如果正在编辑节点或边，则不处理键盘事件，避免冲突
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
      } else if (event.key === 'c' && event.ctrlKey) { // Ctrl+C 复制节点
        if (selectedNode && selectedNode.type !== 'start' && selectedNode.type !== 'entry') {
          copyNode(selectedNode);
        }
      } else if (event.key === 'v' && event.ctrlKey) { // Ctrl+V 粘贴节点
        pasteNode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge, copyNode, pasteNode]);

  // 处理节点点击事件
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // 设置选中节点
    setSelectedNode(node);
    // 清除选中的边，实现边失焦后隐藏控制按钮
    setSelectedEdge(null);
  }, []);

  // 处理边点击事件 - 简化版本，只用于更新状态
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    // 设置选中边
    setSelectedEdge(edge);
    setSelectedNode(null);
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
        setCurrentPath={setCurrentPath}
        setCurrentContainerId={setCurrentContainerId}
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
                onCopy: copyNode,
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
            }).map(edge => ({
              ...edge,
              data: {
                ...edge.data,
                onEdit: (edge: Edge) => setEditingEdge(edge),
                onDelete: deleteEdge
              }
            }))}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
          >
            <CustomControls 
              copiedNode={copiedNode} 
              onPaste={pasteNode} 
            />
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
            {/* EdgeControls已移至CustomEdges.tsx中 */}
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