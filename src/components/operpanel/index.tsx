import React from 'react';
import { Node, Edge } from 'reactflow';
import { NODE_TYPES, getNodeLabels } from '../nodeeditor/constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface OperPanelProps {
  nodes: Node[];
  setNodes: (nodes: React.SetStateAction<Node[]>) => void;
  setSelectedEdge: (edge: any | null) => void;
  createNode: (type: string, position: { x: number; y: number }, nodes: Node[], currentContainerId: string | null) => Node;
  currentPath: {id: string, name: string}[];
  setCurrentPath: React.Dispatch<React.SetStateAction<{id: string, name: string}[]>>;
  currentContainerId: string | null;
  setCurrentContainerId: React.Dispatch<React.SetStateAction<string | null>>;
  setEdges: (edges: React.SetStateAction<Edge[]>) => void;
}

// 移除未使用的setEdges参数
const OperPanel: React.FC<OperPanelProps> = ({ nodes, setNodes, setSelectedEdge, createNode, currentPath, setCurrentPath, currentContainerId, setCurrentContainerId }) => {
  // 使用语言上下文
  const { t } = useLanguage();
  
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <button 
          onClick={handleGoBack}
          disabled={currentPath.length <= 1}
          style={{ 
            padding: '4px 8px', 
            marginLeft: '8px', // 修改为 marginLeft
            backgroundColor: currentPath.length > 1 ? '#4a90e2' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPath.length > 1 ? 'pointer' : 'not-allowed'
          }}
        >
          {t.backButton}
        </button>
        <div style={{ 
          flex: 1,
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

      {/* 在容器内时显示出口节点按钮 */}
      {currentContainerId && (
        <button 
          onClick={() => {
            const newNode = createNode(NODE_TYPES.EXIT, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
            setNodes((nds) => nds.concat(newNode))
            setSelectedEdge(null) // 清除选中的边
          }}
          style={{ 
            border: '2px solid #00cc00', 
            borderRadius: '50%', 
            width: '80px',
            height: '80px',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{t.exitNode}</div>
        </button>
      )}

      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.PLOT, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px solid #888888', borderRadius: '4px', padding: '8px' }}
      >
        {getNodeLabels()[NODE_TYPES.PLOT]}
      </button>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.END, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px solid #00cc00', borderRadius: '4px', padding: '8px' }}
      >
        {getNodeLabels()[NODE_TYPES.END]}
      </button>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.CONTAINER, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId);
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px dashed #666666', borderRadius: '4px', padding: '8px' }}
      >
        {getNodeLabels()[NODE_TYPES.CONTAINER]}
      </button>
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.CONDITION, { x: Math.random() * 500, y: Math.random() * 500 }, nodes, currentContainerId)
          setNodes((nds) => nds.concat(newNode))
          setSelectedEdge(null) // 清除选中的边
        }}
        style={{ border: '2px solid #ff9800', borderRadius: '4px', padding: '8px' }}
      >
        {getNodeLabels()[NODE_TYPES.CONDITION]}
      </button>
    </div>
  );
};

export default OperPanel;