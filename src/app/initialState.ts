import { Node, Edge } from 'reactflow';
import { NODE_TYPES, NODE_LABELS } from '../components/nodeeditor/constants';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: NODE_LABELS[NODE_TYPES.START],
      mname: '开始',
      showInfo: ''
    },
    type: NODE_TYPES.START
  }
];

const initialEdges: Edge[] = [];

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
      mname: `模块${id}`,
      showInfo: ''
    },
    type
  }
};

export { initialNodes, initialEdges, createNode };