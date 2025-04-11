import { Node, Edge } from 'reactflow';
import { NODE_LABELS, NODE_TYPES } from '../nodeeditor/constants';

export const handleNew = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void, setVariables?: (variables: any[]) => void) => {
  setNodes([{
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: NODE_LABELS[NODE_TYPES.START],
      mname: '开始',
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
          
          // 确保边的sourceHandle属性被正确保留
          const processedEdges = data.edges.map((edge: Edge) => {
            // 如果边的数据中有btnname属性，说明是按钮跳转，需要确保sourceHandle属性正确
            if (edge.data && edge.data.ntype === 'btnsto') {
              // 查找对应的按钮索引
              const sourceNode = data.nodes.find((node: Node) => node.id === edge.source);
              if (sourceNode && sourceNode.data && sourceNode.data.buttons) {
                const buttonIndex = sourceNode.data.buttons.findIndex(
                  (btn: any) => btn.title === edge.data.btnname
                );
                if (buttonIndex !== -1) {
                  // 设置正确的sourceHandle
                  return {
                    ...edge,
                    sourceHandle: `button-${buttonIndex}`
                  };
                }
              }
            }
            return edge;
          });
          
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
      
      // 确保边的sourceHandle属性被正确保留
      const processedEdges = savedEdges.map((edge: Edge) => {
        // 如果边的数据中有btnname属性，说明是按钮跳转，需要确保sourceHandle属性正确
        if (edge.data && edge.data.ntype === 'btnsto') {
          // 查找对应的按钮索引
          const sourceNode = savedNodes.find((node: Node) => node.id === edge.source);
          if (sourceNode && sourceNode.data && sourceNode.data.buttons) {
            const buttonIndex = sourceNode.data.buttons.findIndex(
              (btn: any) => btn.title === edge.data.btnname
            );
            if (buttonIndex !== -1) {
              // 设置正确的sourceHandle
              return {
                ...edge,
                sourceHandle: `button-${buttonIndex}`
              };
            }
          }
        }
        return edge;
      });
      
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