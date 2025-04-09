import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from './VariableEditor';

// 为window对象添加appVariables属性的类型声明
declare global {
  interface Window {
    appVariables?: CustomVariable[];
  }
}

// 从AppSidebar导入的常量
const NODE_TYPES = {
  START: 'start',
  PLOT: 'plot',
  END: 'end',
  CONTAINER: 'container'
} as const;

const NODE_LABELS = {
  [NODE_TYPES.START]: '开始节点',
  [NODE_TYPES.PLOT]: '情节节点',
  [NODE_TYPES.END]: '结局节点',
  [NODE_TYPES.CONTAINER]: '收纳节点'
};

interface NodeEditorProps {
  node: Node;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onClose, updateNode }) => {
  const [mname, setMname] = useState(node.data.mname || '');
  const [showInfo, setShowInfo] = useState(node.data.showInfo || '');
  const [note, setNote] = useState(node.data.note || '');
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>([]);

  // 获取当前应用中的变量
  useEffect(() => {
    // 从App组件中获取变量列表
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, [showVariableSelector]);

  const handleSave = () => {
    // 更新节点数据
    updateNode(node.id, {
      mname,
      showInfo: node.type === 'container' ? '' : showInfo,
      note: node.type === 'container' ? note : ''
    });
    onClose();
  };

  // 添加变量引用到显示信息
  const addVariableReference = (variable: CustomVariable) => {
    if (variable.type === 'boolean') {
      setShowInfo(showInfo + `{{${variable.name}}?"true显示内容":"false显示内容"}}`);
    } else {
      setShowInfo(showInfo + `{{${variable.name}}}`);
    }
    setShowVariableSelector(false);
  };
  
  // 递归渲染变量选择列表
  const renderVariableOptions = (vars: CustomVariable[], path: string = '') => {
    return vars.map((variable) => {
      const currentPath = path ? `${path}.${variable.name}` : variable.name;
      
      if (variable.type === 'object' && variable.children && variable.children.length > 0) {
        return (
          <div key={currentPath} style={{ marginLeft: '15px' }}>
            <div style={{ fontWeight: 'bold' }}>{variable.name} (对象):</div>
            {renderVariableOptions(variable.children, currentPath)}
          </div>
        );
      } else {
        return (
          <div key={currentPath} style={{ 
            padding: '5px', 
            margin: '5px 0', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} onClick={() => addVariableReference({ ...variable, name: currentPath })}>
            <span>{currentPath} ({variable.type})</span>
            <button style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>选择</button>
          </div>
        );
      }
    });
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      padding: '20px', 
      zIndex: 1000, 
      minWidth: '300px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <h3>编辑 {NODE_LABELS[node.type as keyof typeof NODE_LABELS] || node.type} 节点</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>节点编号:</label>
        <input 
          type="text" 
          value={node.id} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>模块名称 (mname):</label>
        <input 
          type="text" 
          value={mname} 
          onChange={(e) => setMname(e.target.value)} 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      {node.type === 'container' ? (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>备注信息 (note):</label>
          <textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={{ width: '100%', padding: '5px', minHeight: '100px' }} 
            placeholder="请输入备注信息..."
          />
        </div>
      ) : (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label>显示信息 (showInfo):</label>
            <button 
              onClick={() => setShowVariableSelector(!showVariableSelector)}
              style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              显示变量
            </button>
          </div>
          <textarea 
            value={showInfo} 
            onChange={(e) => setShowInfo(e.target.value)} 
            style={{ width: '100%', padding: '5px', minHeight: '100px' }} 
          />
          {showVariableSelector && (
          <div style={{
            marginTop: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择要显示的变量:</div>
            {variables.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                暂无变量，请先在"变量设置"中添加变量
              </div>
            ) : (
              <div>{renderVariableOptions(variables)}</div>
            )}
          </div>
        )}
      </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={onClose}>取消</button>
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  )
}

export default NodeEditor;