import { Node, Edge, Connection } from 'reactflow';
import { NODE_TYPES, NODE_LABELS } from '../components/nodeeditor/constants';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: NODE_LABELS[NODE_TYPES.START],
      mname: '开始',
      showInfo: '',
      parentId: null // 设置parentId为null，确保在根目录显示
    },
    type: NODE_TYPES.START
  }
];

const initialEdges: Edge[] = [];

// 全局节点ID计数器
let nodeIdCounter = 1;

// 全局边ID计数器
let edgeIdCounter = 1;

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

const createNode = (type: string, position: {x: number, y: number}, existingNodes: Node[] = [], parentId: string | null = null, createEntryNode: boolean = true) => {
  // 确保nodeIdCounter大于现有节点中的最大ID
  if (existingNodes.length > 0 && nodeIdCounter <= getMaxNodeId(existingNodes)) {
    nodeIdCounter = getMaxNodeId(existingNodes) + 1;
  }
  
  const id = `${nodeIdCounter++}`;
  const label = NODE_LABELS[type as keyof typeof NODE_LABELS] || type;
  
  // 根据节点类型创建不同的数据结构
  const nodeData: any = { 
    label,
    mname: `模块${id}`,
    parentId // 添加父节点ID，用于层级结构
  };
  
  // 对于收纳节点，添加note字段，不添加showInfo字段
  if (type === NODE_TYPES.CONTAINER) {
    nodeData.note = '';
    nodeData.childNodes = []; // 存储子节点
    nodeData.childEdges = []; // 存储子边
  } else {
    nodeData.showInfo = '';
  }
  
  const node: Node = {
    id,
    position,
    data: nodeData,
    type
  };
  
  // 如果创建的是收纳节点，并且createEntryNode为true，自动创建一个入口节点作为其子节点
  if (type === NODE_TYPES.CONTAINER && createEntryNode) {
    // 创建入口节点，位置在收纳节点内部偏上的位置
    const entryPosition = { x: position.x + 50, y: position.y + 80 };
    const entryNode = {
      id: `${nodeIdCounter++}`,
      position: entryPosition,
      data: {
        label: NODE_LABELS[NODE_TYPES.ENTRY],
        mname: '入口',
        parentId: id // 设置父节点ID为当前创建的收纳节点ID
      },
      type: NODE_TYPES.ENTRY
    };
    
    // 将入口节点添加到existingNodes中
    if (existingNodes) {
      existingNodes.push(entryNode);
    }
  }
  
  return node;
};

// 创建边的函数
const createEdge = (params: Connection, existingEdges: Edge[] = [], data: any = {}) => {
  // 确保edgeIdCounter大于现有边中的最大ID
  if (existingEdges.length > 0) {
    const maxId = Math.max(...existingEdges.map(edge => {
      const edgeId = parseInt(edge.id.replace('e', ''));
      return !isNaN(edgeId) ? edgeId : 0;
    }));
    
    if (edgeIdCounter <= maxId) {
      edgeIdCounter = maxId + 1;
    }
  }
  
  // 使用累加器生成边ID
  const id = `e${edgeIdCounter++}`;
  
  // 创建新边，只保留updateVariables数据
  const newEdge: Edge = {
    ...params,
    id,
    data: {
      updateVariables: data.updateVariables || {}
    }
  };
  
  return newEdge;
};

// 重置节点和边的ID计数器函数
const resetCounters = () => {
  nodeIdCounter = 1;
  edgeIdCounter = 1;
};

export { initialNodes, initialEdges, createNode, createEdge, resetCounters };