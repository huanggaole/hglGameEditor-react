import { useState, useCallback } from 'react'
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { handleNew, handleSave, handleLoad } from './utils/menuHandlers'

const NODE_TYPES = {
    INPUT: 'input',
    PLOT: 'plot',
    END: 'end'
  } as const
  
  const NODE_LABELS = {
    [NODE_TYPES.INPUT]: '开始节点',
    [NODE_TYPES.PLOT]: '情节节点',
    [NODE_TYPES.END]: '结局节点'
  }

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: NODE_LABELS[NODE_TYPES.INPUT] },
    type: NODE_TYPES.INPUT
  }
]

const createNode = (type: string, position: {x: number, y: number}) => {
  const id = `${Date.now()}`
  const label = NODE_LABELS[type as keyof typeof NODE_LABELS] || type
  return {
    id,
    position,
    data: { label },
    type
  }
}

const NodeEditor = ({ node, onClose }: { node: Node, onClose: () => void }) => {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000 }}>
      <h3>编辑 {NODE_LABELS[node.type as keyof typeof NODE_LABELS] || node.type} 节点</h3>
      <button onClick={onClose}>关闭</button>
    </div>
  )
}

const initialEdges: Edge[] = []

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [editingNode, setEditingNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px' }}>
        <button onClick={() => handleNew(setNodes, setEdges)}>新建</button>
        <button onClick={() => handleSave(nodes, edges)}>存档</button>
        <button onClick={() => handleLoad(setNodes, setEdges)}>读取</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '200px', backgroundColor: '#e0e0e0', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => {
            const newNode = createNode(NODE_TYPES.PLOT, { x: Math.random() * 500, y: Math.random() * 500 })
            setNodes((nds) => nds.concat(newNode))
          }}>{NODE_LABELS[NODE_TYPES.PLOT]}</button>
          <button onClick={() => {
            const newNode = createNode(NODE_TYPES.END, { x: Math.random() * 500, y: Math.random() * 500 })
            setNodes((nds) => nds.concat(newNode))
          }}>{NODE_LABELS[NODE_TYPES.END]}</button>
        </div>
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(event, node) => setEditingNode(node)}
          >
            <Controls />
            <Background />
            {editingNode && (
              <NodeEditor 
                node={editingNode} 
                onClose={() => setEditingNode(null)} 
              />
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default App
