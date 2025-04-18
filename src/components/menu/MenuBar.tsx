import React from 'react';
import { Node, Edge } from 'reactflow';
import { handleNew, handleSave, handleLoad } from './menuHandlers';
import { CustomVariable } from '../VariableEditor';
import { useLanguage } from '../../contexts/LanguageContext';

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
  // 使用语言上下文
  const { currentLanguage, setLanguage, t } = useLanguage();
  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => {
          // 直接在handleNew函数中传入setCurrentContainerId参数，确保同时重置路径和容器ID
          handleNew(setNodes, setEdges, setVariables, setCurrentPath, setCurrentContainerId, t);
          setSelectedEdge(null); // 清除选中的边
        }}>{t.newProject}</button>
        <button onClick={() => handleSave(nodes, edges, variables)}>{t.saveProject}</button>
        <button onClick={() => {
          handleLoad(setNodes, setEdges, setVariables);
          setSelectedEdge(null); // 清除选中的边
        }}>{t.loadProject}</button>
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
          {t.previewGame}
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
          {t.variableSettings}
        </button>
      </div>
      
      {/* 语言选择器 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{t.languageSelector}:</span>
        <select 
          value={currentLanguage} 
          onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
          data-language-selector="true"
          style={{ 
            padding: '5px', 
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default MenuBar;