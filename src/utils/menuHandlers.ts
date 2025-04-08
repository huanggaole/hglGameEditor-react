import { Node, Edge } from 'reactflow';

export const handleNew = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void, setVariables?: (variables: any[]) => void) => {
  setNodes([{
    id: '1',
    position: { x: 0, y: 0 },
    data: { 
      label: '开始节点',
      mname: '开始', // 节点模块的名称
      showInfo: '' // 游戏中显示的信息
    },
    type: 'start'
  }]);
  setEdges([]);
  
  // 如果提供了setVariables函数，则重置变量列表
  if (setVariables) {
    setVariables([]);
  }
};

export const handleSave = (nodes: Node[], edges: Edge[], variables: any[] = []) => {
  const data = JSON.stringify({ nodes, edges, variables }, null, 2);
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
          setEdges(data.edges);
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
    const { nodes: savedNodes, edges: savedEdges, variables: savedVariables } = JSON.parse(savedData);
    setNodes(savedNodes);
    setEdges(savedEdges);
    // 如果存在变量数据且提供了setVariables函数，则更新变量
    if (savedVariables && setVariables) {
      setVariables(savedVariables);
    }
  }
};