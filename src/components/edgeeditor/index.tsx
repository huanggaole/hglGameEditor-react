import React, { useState } from 'react';
import { useNodes, Node } from 'reactflow';
import { EdgeEditorProps, NodeData } from './types';
import VariableEditor from './VariableEditor';

interface UpdatedData {
  updateVariables: {[key: string]: any};
  conditionVariable?: string;
  conditionType?: string;
  conditionValue?: string;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({ edge, onClose, updateEdge }) => {
  // 初始化边的数据，如果没有data则创建空对象
  const initialData = edge.data || {};
  const [updateVariables, setUpdateVariables] = useState<{[key: string]: any}>(initialData.updateVariables || {}); // 变量更新
  
  // 条件跳转相关状态（保留但不使用）
  const [conditionVariable, _setConditionVariable] = useState(initialData.conditionVariable || ''); // 条件变量
  const [conditionType, _setConditionType] = useState(initialData.conditionType || 'equal'); // 条件类型
  const [conditionValue, _setConditionValue] = useState(initialData.conditionValue || ''); // 条件值
  
  // 获取所有节点，用于显示源节点和目标节点的名称
  const nodes = useNodes();
  
  // 获取源节点和目标节点
  const sourceNode = nodes.find(node => node.id === edge.source) as Node<NodeData> | undefined;
  const targetNode = nodes.find(node => node.id === edge.target) as Node<NodeData> | undefined;
  
  // 获取源节点和目标节点的名称
  const sourceNodeName = sourceNode?.data?.mname || sourceNode?.id || '未知节点';
  const targetNodeName = targetNode?.data?.mname || targetNode?.id || '未知节点';
  
  // 移除了根据源节点的Handle ID确定跳转方式的代码

  // 获取变量的类型
  const getVariableType = (variablePath: string): string => {
    const vars = window.appVariables || [];
    const pathParts = variablePath.split('.');
    
    let currentVars = vars;
    let currentVar = null;
    
    for (let i = 0; i < pathParts.length; i++) {
      currentVar = currentVars.find(v => v.name === pathParts[i]);
      if (!currentVar) return 'string'; // 默认为字符串类型
      
      if (i < pathParts.length - 1) {
        if (currentVar.type === 'object' && currentVar.children) {
          currentVars = currentVar.children;
        } else {
          return 'string'; // 如果路径中间有非对象类型，返回默认类型
        }
      }
    }
    
    return currentVar ? currentVar.type : 'string';
  };

  // 移除未使用的handleConditionChange函数
  // 如果将来需要使用条件编辑功能，可以重新添加此函数
  
  const handleSave = () => {
    // 准备更新的数据，只保留updateVariables
    const updatedData: UpdatedData = {
      // 确保使用最新的updateVariables状态
      updateVariables: {...updateVariables}
    };

    // 如果是条件跳转，则添加条件相关数据
    if (edge.sourceHandle === 'condition') {
      updatedData.conditionVariable = conditionVariable;
      updatedData.conditionType = conditionType;
      updatedData.conditionValue = conditionValue;
    }
    
    // 更新边数据
    updateEdge(edge.id, updatedData);
    onClose();
  };

  const handleCancel = () => {
    // 恢复边的原始变量数据
    updateEdge(edge.id, {
      ...edge.data,
      updateVariables: initialData.updateVariables
    });
    onClose();
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
      <h3>编辑跳转</h3>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>跳转前节点:</label>
        <input 
          type="text" 
          value={sourceNodeName} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>跳转后节点:</label>
        <input 
          type="text" 
          value={targetNodeName} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>
      
      <VariableEditor
        updateVariables={updateVariables}
        onUpdateVariables={setUpdateVariables}
        getVariableType={getVariableType}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={handleCancel}>取消</button>
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  );
};

export default EdgeEditor;