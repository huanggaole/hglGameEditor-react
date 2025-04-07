import React, { useState } from 'react';
import { Node, Edge } from 'reactflow';

// 定义预览界面类型
type PreviewType = 'start' | 'plot' | 'end';

// 定义按钮类型，用于表示跳转按钮
interface ButtonInfo {
  id: string;
  label: string;
  targetNodeId: string;
}

interface PreviewComponentProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ nodes, edges, onClose }) => {
  // 当前显示的节点ID
  const [currentNodeId, setCurrentNodeId] = useState<string>(() => {
    // 默认显示开始节点
    const startNode = nodes.find(node => node.type === 'start');
    return startNode ? startNode.id : '';
  });

  // 获取当前节点
  const currentNode = nodes.find(node => node.id === currentNodeId);
  
  // 获取当前节点类型
  const currentType: PreviewType = currentNode?.type as PreviewType || 'start';

  // 获取从当前节点出发的所有边
  const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);

  // 构建按钮信息
  const buttons: ButtonInfo[] = outgoingEdges.map(edge => {
    const targetNode = nodes.find(node => node.id === edge.target);
    // 如果是按钮跳转类型(btnsto)，则使用btnname作为按钮标签，否则使用默认的'下一步'
    const buttonLabel = edge.data?.ntype === 'btnsto' ? edge.data?.btnname || '下一步' : '下一步';
    return {
      id: edge.id,
      label: buttonLabel,
      targetNodeId: edge.target
    };
  });

  // 处理按钮点击事件
  const handleButtonClick = (targetNodeId: string) => {
    setCurrentNodeId(targetNodeId);
  };

  // 处理重新开始游戏
  const handleRestart = () => {
    const startNode = nodes.find(node => node.type === 'start');
    if (startNode) {
      setCurrentNodeId(startNode.id);
    }
  };

  return (
    <div className="preview-container" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '600px',
      height: '80%',
      maxHeight: '500px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      zIndex: 1000
    }}>
      <div className="preview-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>
          {currentType === 'start' ? '游戏开始' : 
           currentType === 'plot' ? '剧情页面' : 
           '游戏结局'}
        </h2>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          关闭
        </button>
      </div>

      <div className="preview-content" style={{
        flex: 1,
        overflow: 'auto',
        border: '1px solid #eee',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
        whiteSpace: 'pre-wrap' // 添加此样式以保留换行符
      }}>
        {currentNode?.data?.showInfo || '无内容显示'}
      </div>

      <div className="preview-actions" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {currentType === 'end' ? (
          <button 
            onClick={handleRestart}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            重新开始游戏
          </button>
        ) : (
          buttons.map(button => (
            <button 
              key={button.id}
              onClick={() => handleButtonClick(button.targetNodeId)}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {button.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviewComponent;