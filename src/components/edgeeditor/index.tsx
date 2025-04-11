import React, { useState, useEffect } from 'react';
import { useNodes, Node } from 'reactflow';
import { EdgeEditorProps, NodeData } from './types';
import VariableEditor from './VariableEditor';
import ConditionEditor from './ConditionEditor';

interface UpdatedData {
  ntype: string;
  btnname: string;
  updateVariables: {[key: string]: any};
  conditionVariable?: string;
  conditionType?: string;
  conditionValue?: string;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({ edge, onClose, updateEdge }) => {
  // 初始化边的数据，如果没有data则创建空对象
  const initialData = edge.data || {};
  // 不再由用户选择跳转方式，而是根据源节点的Handle类型自动确定
  const [ntype, setNtype] = useState(initialData.ntype || 'goto'); // 默认为直接跳转
  const [btnname, setBtnname] = useState(initialData.btnname || ''); // 按钮名称
  const [updateVariables, setUpdateVariables] = useState<{[key: string]: any}>(initialData.updateVariables || {}); // 变量更新
  
  // 条件跳转相关状态
  const [conditionVariable, setConditionVariable] = useState(initialData.conditionVariable || ''); // 条件变量
  const [conditionType, setConditionType] = useState(initialData.conditionType || 'equal'); // 条件类型
  const [conditionValue, setConditionValue] = useState(initialData.conditionValue || ''); // 条件值
  
  // 获取所有节点，用于显示源节点和目标节点的名称
  const nodes = useNodes();
  
  // 获取源节点和目标节点
  const sourceNode = nodes.find(node => node.id === edge.source) as Node<NodeData> | undefined;
  const targetNode = nodes.find(node => node.id === edge.target) as Node<NodeData> | undefined;
  
  // 获取源节点和目标节点的名称
  const sourceNodeName = sourceNode?.data?.mname || sourceNode?.id || '未知节点';
  const targetNodeName = targetNode?.data?.mname || targetNode?.id || '未知节点';
  
  // 根据源节点的Handle ID确定跳转方式
  useEffect(() => {
    if (edge.sourceHandle && edge.sourceHandle.startsWith('button-')) {
      // 如果源Handle ID以'button-'开头，说明是按钮跳转
      setNtype('btnsto');
      // 尝试从源节点的按钮数据中获取按钮名称
      if (sourceNode?.data?.buttons) {
        const buttonIndex = parseInt(edge.sourceHandle.replace('button-', ''));
        if (!isNaN(buttonIndex) && sourceNode.data.buttons[buttonIndex]) {
          setBtnname(sourceNode.data.buttons[buttonIndex].title || `按钮${buttonIndex+1}`);
        }
      }
    } else {
      // 否则是直接跳转
      setNtype('goto');
    }
  }, [edge.sourceHandle, sourceNode]);

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

  // 处理条件变更
  const handleConditionChange = (updates: {
    conditionVariable?: string;
    conditionType?: string;
    conditionValue?: string;
  }) => {
    if (updates.conditionVariable !== undefined) setConditionVariable(updates.conditionVariable);
    if (updates.conditionType !== undefined) setConditionType(updates.conditionType);
    if (updates.conditionValue !== undefined) setConditionValue(updates.conditionValue);
  };
  
  const handleSave = () => {
    // 准备更新的数据
    const updatedData: UpdatedData = {
      ntype,
      btnname,
      // 确保使用最新的updateVariables状态
      updateVariables: {...updateVariables}
    };

    // 如果是按钮跳转，则添加按钮名称
    if (ntype === 'btnsto') {
      updatedData.btnname = btnname;
    }

    // 如果是条件跳转，则添加条件相关数据
    if (ntype === 'condition') {
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