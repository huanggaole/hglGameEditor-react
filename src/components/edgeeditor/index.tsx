import React, { useState, useEffect } from 'react';
import { useNodes, Node } from 'reactflow';
import { EdgeEditorProps, NodeData } from './types';
import VariableEditor from './VariableEditor';

interface UpdatedData {
  updateVariables: {[key: string]: any};
  conditionVariable?: string;
  conditionType?: string;
  conditionValue?: string;
  label?: string;
}

const EdgeEditor: React.FC<EdgeEditorProps> = ({ edge, onClose, updateEdge }) => {
  // 初始化边的数据，如果没有data则创建空对象
  const initialData = edge.data || {};
  const [updateVariables, setUpdateVariables] = useState<{[key: string]: any}>(initialData.updateVariables || {}); // 变量更新
  
  // 条件跳转相关状态
  const [conditionVariable, setConditionVariable] = useState(initialData.conditionVariable || ''); // 条件变量
  const [conditionType, setConditionType] = useState(initialData.conditionType || '等于'); // 条件类型
  const [conditionValue, setConditionValue] = useState(initialData.conditionValue || ''); // 条件值
  const [enableCondition, setEnableCondition] = useState(!!initialData.conditionVariable); // 是否启用条件跳转
  const [variables, setVariables] = useState<any[]>([]); // 存储可用变量列表
  
  // 获取所有节点，用于显示源节点和目标节点的名称
  const nodes = useNodes();
  
  // 获取源节点和目标节点
  const sourceNode = nodes.find(node => node.id === edge.source) as Node<NodeData> | undefined;
  const targetNode = nodes.find(node => node.id === edge.target) as Node<NodeData> | undefined;
  
  // 获取源节点和目标节点的名称
  const sourceNodeName = sourceNode?.data?.mname || sourceNode?.id || '未知节点';
  const targetNodeName = targetNode?.data?.mname || targetNode?.id || '未知节点';
  
  // 加载变量列表
  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, []);

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

  // 处理条件变量变更
  const handleConditionVariableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConditionVariable(e.target.value);
  };

  // 处理条件类型变更
  const handleConditionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConditionType(e.target.value);
  };

  // 处理条件值变更
  const handleConditionValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConditionValue(e.target.value);
  };
  
  // 渲染变量选择器
  const renderVariableOptions = (vars: any[], path: string = '') => {
    return vars.map((variable) => {
      const currentPath = path ? `${path}.${variable.name}` : variable.name;
      
      if (variable.type === 'object' && variable.children && variable.children.length > 0) {
        return [
          <option key={currentPath} value="" disabled style={{ fontWeight: 'bold' }}>
            {variable.name} (对象)
          </option>,
          ...renderVariableOptions(variable.children, currentPath)
        ];
      } else {
        return (
          <option key={currentPath} value={currentPath}>
            {currentPath} ({variable.type})
          </option>
        );
      }
    });
  };
  
  const handleSave = () => {
    // 准备更新的数据
    const updatedData: UpdatedData = {
      // 确保使用最新的updateVariables状态
      updateVariables: {...updateVariables}
    };

    // 如果启用了条件跳转，则添加条件相关数据
    if (enableCondition) {
      updatedData.conditionVariable = conditionVariable;
      updatedData.conditionType = conditionType;
      updatedData.conditionValue = conditionValue;
      
      // 添加边的标签，显示条件信息
      updatedData.label = `${conditionVariable} ${conditionType} ${conditionValue}`;
    } else {
      // 如果禁用了条件跳转，清除条件相关数据
      updatedData.conditionVariable = undefined;
      updatedData.conditionType = undefined;
      updatedData.conditionValue = undefined;
      updatedData.label = undefined;
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
      
      {/* 条件跳转设置 */}
      <div style={{ marginBottom: '15px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={enableCondition}
            onChange={(e) => setEnableCondition(e.target.checked)}
            id="enableCondition"
            style={{ marginRight: '5px' }}
          />
          <label htmlFor="enableCondition" style={{ fontWeight: 'bold' }}>启用条件跳转</label>
        </div>
        
        {enableCondition && (
          <div style={{ marginLeft: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>条件变量:</label>
              <select
                value={conditionVariable}
                onChange={handleConditionVariableChange}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="">-- 选择变量 --</option>
                {renderVariableOptions(variables)}
              </select>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>条件类型:</label>
              <select
                value={conditionType}
                onChange={handleConditionTypeChange}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="等于">等于</option>
                <option value="不等于">不等于</option>
                <option value="大于">大于</option>
                <option value="小于">小于</option>
                <option value="大于等于">大于等于</option>
                <option value="小于等于">小于等于</option>
                <option value="包含">包含</option>
                <option value="不包含">不包含</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>条件值:</label>
              <input
                type="text"
                value={conditionValue}
                onChange={handleConditionValueChange}
                style={{ width: '100%', padding: '5px' }}
                placeholder="输入条件值"
              />
            </div>
          </div>
        )}
      </div>
      
      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>变量更新设置</h4>
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