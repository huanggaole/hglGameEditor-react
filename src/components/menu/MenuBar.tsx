import React from 'react';
import { Node, Edge } from 'reactflow';
import { handleNew, handleSave, handleLoad } from './menuHandlers';
import { CustomVariable } from '../VariableEditor';

interface MenuBarProps {
  nodes: Node[];
  edges: Edge[];
  variables: CustomVariable[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setVariables: (variables: CustomVariable[]) => void;
  setSelectedEdge: (edge: Edge | null) => void;
  setShowPreview: (show: boolean) => void;
  setShowVariableEditor: (show: boolean) => void;
  setCurrentPath?: (path: {id: string, name: string}[]) => void;
  setCurrentContainerId?: (id: string | null) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  nodes,
  edges,
  variables,
  setNodes,
  setEdges,
  setVariables,
  setSelectedEdge,
  setShowPreview,
  setShowVariableEditor,
  setCurrentPath,
  setCurrentContainerId
}) => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px' }}>
      <button onClick={() => {
        // 直接在handleNew函数中传入setCurrentContainerId参数，确保同时重置路径和容器ID
        handleNew(setNodes, setEdges, setVariables, setCurrentPath, setCurrentContainerId);
        setSelectedEdge(null); // 清除选中的边
      }}>新建</button>
      <button onClick={() => handleSave(nodes, edges, variables)}>存档</button>
      <button onClick={() => {
        handleLoad(setNodes, setEdges, setVariables);
        setSelectedEdge(null); // 清除选中的边
      }}>读取</button>
      <button 
        onClick={() => setShowPreview(true)}
        style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white',
          padding: '5px 15px',
          borderRadius: '4px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        预览游戏
      </button>
      <button 
        onClick={() => setShowVariableEditor(true)}
        style={{ 
          backgroundColor: '#2196F3', 
          color: 'white',
          padding: '5px 15px',
          borderRadius: '4px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        变量设置
      </button>
    </div>
  );
};

export default MenuBar;