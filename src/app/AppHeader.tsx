import React from 'react';
import { Node, Edge } from 'reactflow';

export const AppHeader = ({
  onNew,
  onSave,
  onLoad,
  onPreview,
  onVariableEdit
}: {
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onPreview: () => void;
  onVariableEdit: () => void;
}) => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px' }}>
      <button onClick={onNew}>新建</button>
      <button onClick={onSave}>存档</button>
      <button onClick={onLoad}>读取</button>
      <button 
        onClick={onPreview}
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
        onClick={onVariableEdit}
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