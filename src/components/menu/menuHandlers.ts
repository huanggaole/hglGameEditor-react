import { Node, Edge } from 'reactflow';
import { NODE_LABELS, NODE_TYPES } from '../nodeeditor/constants';
import { resetCounters } from '../../app/initialState';

export const handleNew = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void, setVariables?: (variables: any[]) => void, setCurrentPath?: (path: {id: string, name: string}[]) => void, setCurrentContainerId?: (id: string | null) => void, t?:any) => {
  
  // 重置节点和边的ID计数器
  resetCounters();
  
  // 如果提供了setCurrentPath函数，重置当前路径到root根目录
  if (setCurrentPath) {
    setCurrentPath([{id: 'root', name: 'root'}]);
  }
  
  // 重置当前容器ID为null，确保显示根目录内容
  if (setCurrentContainerId) {
    setCurrentContainerId(null);
  }

  setNodes([{
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: NODE_LABELS[NODE_TYPES.START],
      mname: t?.startNodeName || 'Start', 
      showInfo: '',
      parentId: null // 设置parentId为null，确保在根目录显示
    },
    type: NODE_TYPES.START
  }]);
  setEdges([]);
  
  // 如果提供了setVariables函数，则重置变量列表
  if (setVariables) {
    setVariables([]);
  }
};

export const handleSave = (nodes: Node[], edges: Edge[], variables: any[] = []) => {
  // 处理节点数据，确保收纳节点的数据结构正确
  const processedNodes = nodes.map(node => {
    // 如果是收纳节点，移除showInfo字段
    if (node.type === 'container') {
      const { showInfo, ...restData } = node.data;
      return {
        ...node,
        data: restData
      };
    }
    return node;
  });
  
  const data = JSON.stringify({ nodes: processedNodes, edges, variables }, null, 2);
  localStorage.setItem('flowData', data);
  
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flow-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleLoad = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void, setVariables?: (variables: any[]) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          
          // 直接使用加载的边数据，不再处理ntype和btnname
          const processedEdges = data.edges;
          
          setEdges(processedEdges);
          
          // 如果存在变量数据且提供了setVariables函数，则更新变量
          if (data.variables && setVariables) {
            setVariables(data.variables);
          }
        } else {
          alert('所读取的文件无法解析');
        }
      } catch {
        alert('所读取的文件无法解析');
      }
    };
    reader.readAsText(file);
  };
  input.click();

  const savedData = localStorage.getItem('flowData');
  if (savedData) {
    try {
      const { nodes: savedNodes, edges: savedEdges, variables: savedVariables } = JSON.parse(savedData);
      setNodes(savedNodes);
      
      // 直接使用加载的边数据，不再处理ntype和btnname
      const processedEdges = savedEdges;
      
      setEdges(processedEdges);
      
      // 如果存在变量数据且提供了setVariables函数，则更新变量
      if (savedVariables && setVariables) {
        setVariables(savedVariables);
      }
    } catch (error) {
      console.error('加载本地存储数据失败:', error);
    }
  }
};