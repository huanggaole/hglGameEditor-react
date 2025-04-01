import { Node, Edge } from 'reactflow';

export const handleNew = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) => {
  setNodes([{
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '开始节点' },
    type: 'input'
  }]);
  setEdges([]);
};

export const handleSave = (nodes: Node[], edges: Edge[]) => {
  const data = JSON.stringify({ nodes, edges }, null, 2);
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

export const handleLoad = (setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) => {
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
    const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
    setNodes(savedNodes);
    setEdges(savedEdges);
  }
};