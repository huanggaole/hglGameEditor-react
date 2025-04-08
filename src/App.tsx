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
import { handleNew, handleSave, handleLoad } from './utils/menuHandlers'
import { StartNode, PlotNode, EndNode } from './components/CustomNodes'
import { EdgeControls } from './components/NodeEdgeControls'
import EdgeEditor from './components/EdgeEditor'
import { CustomEdge } from './components/CustomEdges'
import PreviewComponent from './components/PreviewComponent'
import VariableEditor, { CustomVariable } from './components/VariableEditor'

const NODE_TYPES = {
    START: 'start',
    PLOT: 'plot',
    END: 'end'
  } as const
  
  const NODE_LABELS = {
    [NODE_TYPES.START]: '开始节点',
    [NODE_TYPES.PLOT]: '情节节点',
    [NODE_TYPES.END]: '结局节点'
  }

// 定义自定义节点类型映射
const nodeTypes = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.PLOT]: PlotNode,
  [NODE_TYPES.END]: EndNode
}

// 定义自定义边类型映射
const edgeTypes = {
  default: CustomEdge
}

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: NODE_LABELS[NODE_TYPES.START],
      mname: '开始', // 节点模块的名称
      showInfo: '' // 游戏中显示的信息
    },
    type: NODE_TYPES.START
  }
]

// 全局节点ID计数器
let nodeIdCounter = 1;

// 获取当前节点中的最大ID值
const getMaxNodeId = (nodes: Node[]) => {
  let maxId = 0;
  nodes.forEach(node => {
    const nodeId = parseInt(node.id);
    if (!isNaN(nodeId) && nodeId > maxId) {
      maxId = nodeId;
    }
  });
  return maxId;
};

const createNode = (type: string, position: {x: number, y: number}, existingNodes: Node[] = []) => {
  // 确保nodeIdCounter大于现有节点中的最大ID
  if (existingNodes.length > 0 && nodeIdCounter <= getMaxNodeId(existingNodes)) {
    nodeIdCounter = getMaxNodeId(existingNodes) + 1;
  }
  
  const id = `${nodeIdCounter++}`;
  const label = NODE_LABELS[type as keyof typeof NODE_LABELS] || type;
  return {
    id,
    position,
    data: { 
      label,
      mname: `模块${id}`, // 节点模块的名称
      showInfo: '' // 游戏中显示的信息
    },
    type
  }
}

const NodeEditor = ({ node, onClose, updateNode }: { node: Node, onClose: () => void, updateNode: (nodeId: string, data: any) => void }) => {
  const [mname, setMname] = useState(node.data.mname || '');
  const [showInfo, setShowInfo] = useState(node.data.showInfo || '');
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>([]);

  // 获取当前应用中的变量
  useEffect(() => {
    // 从App组件中获取变量列表
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, [showVariableSelector]);

  const handleSave = () => {
    // 更新节点数据
    updateNode(node.id, {
      mname,
      showInfo
    });
    onClose();
  };

  // 添加变量引用到显示信息
  const addVariableReference = (variable: CustomVariable) => {
    if (variable.type === 'boolean') {
      setShowInfo(showInfo + `{{${variable.name}}?"true显示内容":"false显示内容"}`); 
    } else {
      setShowInfo(showInfo + `{{${variable.name}}}`); 
    }
    setShowVariableSelector(false);
  };
  
  // 递归渲染变量选择列表
  const renderVariableOptions = (vars: CustomVariable[], path: string = '') => {
    return vars.map((variable) => {
      const currentPath = path ? `${path}.${variable.name}` : variable.name;
      
      if (variable.type === 'object' && variable.children && variable.children.length > 0) {
        return (
          <div key={currentPath} style={{ marginLeft: '15px' }}>
            <div style={{ fontWeight: 'bold' }}>{variable.name} (对象):</div>
            {renderVariableOptions(variable.children, currentPath)}
          </div>
        );
      } else {
        return (
          <div key={currentPath} style={{ 
            padding: '5px', 
            margin: '5px 0', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} onClick={() => addVariableReference({ ...variable, name: currentPath })}>
            <span>{currentPath} ({variable.type})</span>
            <button style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>选择</button>
          </div>
        );
      }
    });
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      padding: '20px', 
      zIndex: 1000, 
      minWidth: '300px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <h3>编辑 {NODE_LABELS[node.type as keyof typeof NODE_LABELS] || node.type} 节点</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>节点编号:</label>
        <input 
          type="text" 
          value={node.id} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>模块名称 (mname):</label>
        <input 
          type="text" 
          value={mname} 
          onChange={(e) => setMname(e.target.value)} 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label>显示信息 (showInfo):</label>
          <button 
            onClick={() => setShowVariableSelector(!showVariableSelector)}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            显示变量
          </button>
        </div>
        <textarea 
          value={showInfo} 
          onChange={(e) => setShowInfo(e.target.value)} 
          style={{ width: '100%', padding: '5px', minHeight: '100px' }} 
        />
        {showVariableSelector && (
          <div style={{
            marginTop: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择要显示的变量:</div>
            {variables.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                暂无变量，请先在"变量设置"中添加变量
              </div>
            ) : (
              <div>{renderVariableOptions(variables)}</div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={onClose}>取消</button>
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  )
}

const initialEdges: Edge[] = []

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
    // 找出与该节点相连的所有边
    const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges);
    const edgeIdsToRemove = connectedEdges.map(edge => edge.id);
    
    // 删除边
    setEdges(eds => eds.filter(edge => !edgeIdsToRemove.includes(edge.id)));
    
    // 删除节点
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    
    // 清除选中状态
    setSelectedNode(null);
  }, [edges, setEdges, setNodes])

  // 删除边
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      // 先添加边
      const newEdge = addEdge(params, edges)[edges.length];
      // 设置新添加的边为编辑状态，自动弹出编辑框
      setTimeout(() => {
        setEditingEdge(newEdge);
      }, 100);
      return setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
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
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px' }}>
        <button onClick={() => {
          handleNew(setNodes, setEdges, setVariables);
          setSelectedEdge(null); // 清除选中的边
        }}>新建</button>
        <button onClick={() => handleSave(nodes, edges, variables)}>存档</button>
        <button onClick={() => {
          handleLoad(setNodes, setEdges, setVariables);
          setSelectedEdge(null); // 清除选中的边
        }}>读取</button>
        <button 
          onClick={() => setShowPreview(true)}
          style={{ 
            backgroundColor: '#4CAF50', 
            color: 'white',
            padding: '5px 15px',
            borderRadius: '4px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          预览游戏
        </button>
        <button 
          onClick={() => setShowVariableEditor(true)}
          style={{ 
            backgroundColor: '#2196F3', 
            color: 'white',
            padding: '5px 15px',
            borderRadius: '4px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          变量设置
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '200px', backgroundColor: '#e0e0e0', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => {
              const newNode = createNode(NODE_TYPES.PLOT, { x: Math.random() * 500, y: Math.random() * 500 }, nodes)
              setNodes((nds) => nds.concat(newNode))
              setSelectedEdge(null) // 清除选中的边
            }}
            style={{ border: '2px solid #888888', borderRadius: '4px', padding: '8px' }}
          >
            {NODE_LABELS[NODE_TYPES.PLOT]}
          </button>
          <button 
            onClick={() => {
              const newNode = createNode(NODE_TYPES.END, { x: Math.random() * 500, y: Math.random() * 500 }, nodes)
              setNodes((nds) => nds.concat(newNode))
              setSelectedEdge(null) // 清除选中的边
            }}
            style={{ border: '2px solid #00cc00', borderRadius: '4px', padding: '8px' }}
          >
            {NODE_LABELS[NODE_TYPES.END]}
          </button>
        </div>
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