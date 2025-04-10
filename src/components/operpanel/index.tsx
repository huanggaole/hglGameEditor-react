import React from 'react';
import { Node } from 'reactflow';
import { NODE_TYPES, NODE_LABELS } from '../nodeeditor/constants';

interface OperPanelProps {
  nodes: Node[];
  setNodes: (nodes: React.SetStateAction<Node[]>) => void;
  setSelectedEdge: (edge: any | null) => void;
  createNode: (type: string, position: { x: number; y: number }, nodes: Node[], currentContainerId: string | null) => Node;
  currentPath: {id: string, name: string}[];
  setCurrentPath: React.Dispatch<React.SetStateAction<{id: string, name: string}[]>>;
  currentContainerId: string | null;
  setCurrentContainerId: React.Dispatch<React.SetStateAction<string | null>>;
}

const OperPanel: React.FC<OperPanelProps> = ({ nodes, setNodes, setSelectedEdge, createNode, currentPath, setCurrentPath, currentContainerId, setCurrentContainerId }) => {
  // 处理返回上一级
  const handleGoBack = () => {
    if (currentPath.length > 1) {
      // 移除当前路径的最后一项
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      
      // 设置当前容器ID为新路径的最后一项
      // 如果只剩下root，则设置为null
      const newContainerId = newPath.length > 1 ? newPath[newPath.length - 1].id : null;
      setCurrentContainerId(newContainerId);
    }
  };

  return (
    <div style={{ width: '200px', backgroundColor: '#e0e0e0', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 地址栏和返回按钮 */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <button 
            onClick={handleGoBack}
            disabled={currentPath.length <= 1}
            style={{ 
              padding: '4px 8px', 
              marginRight: '8px',
              backgroundColor: currentPath.length > 1 ? '#4a90e2' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPath.length > 1 ? 'pointer' : 'not-allowed'
            }}
          >
            ↑ 
          </button>
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '6px', 
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {currentPath.map((item, index) => (
            <span key={item.id}>
              {index > 0 && <span style={{ margin: '0 4px' }}>/</span>}
              <span style={{ fontWeight: index === currentPath.length - 1 ? 'bold' : 'normal' }}>
                {item.name}
              </span>
            </span>
          ))}
        </div>
      </div>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.PLOT, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px solid #888888', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.PLOT]}
      </button>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.END, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px solid #00cc00', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.END]}
      </button>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.CONTAINER, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId);
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px dashed #666666', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.CONTAINER]}
      </button>
    </div>
  );
};

export default OperPanel;