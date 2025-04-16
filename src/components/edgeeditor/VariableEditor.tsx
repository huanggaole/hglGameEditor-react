import React, { useState } from 'react';
import { CustomVariable } from '../VariableEditor';
import VariableSelector from './VariableSelector';
import { VariableUpdate } from './types';

interface VariableEditorProps {
  updateVariables: VariableUpdate;
  onUpdateVariables: (updates: VariableUpdate) => void;
  getVariableType: (variablePath: string) => string;
}

const VariableEditor: React.FC<VariableEditorProps> = ({
  updateVariables,
  onUpdateVariables,
  getVariableType
}) => {
  const [showVariableEditor, setShowVariableEditor] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [variableValue, setVariableValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 获取所有可用变量
  const getAvailableVariables = () => {
    return window.appVariables || [];
  };

  // 添加或更新变量
  const addVariableUpdate = () => {
    if (selectedVariable && variableValue) {
      const processedValue = variableValue;
      
      onUpdateVariables({
        ...updateVariables,
        [selectedVariable]: processedValue
      });
      
      // 重置表单状态
      setSelectedVariable('');
      setVariableValue('');
      setShowVariableEditor(false);
      setIsEditing(false);
    }
  };

  // 删除变量更新
  const removeVariableUpdate = (varPath: string) => {
    const updated = { ...updateVariables };
    delete updated[varPath];
    onUpdateVariables(updated);
  };

  // 编辑变量更新
  const editVariableUpdate = (varPath: string, value: any) => {
    setIsEditing(true);
    setSelectedVariable(varPath);
    
    const variableType = getVariableType(varPath);
    if (variableType === 'boolean') {
      setVariableValue(value ? 'true' : 'false');
    } else {
      setVariableValue(String(value));
    }
    
    setShowVariableEditor(true);
  };

  // 处理变量选择
  const handleVariableSelect = (_variable: CustomVariable, path: string) => {
    setSelectedVariable(path);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <label>变量更新:</label>
        <button 
          onClick={() => setShowVariableEditor(!showVariableEditor)}
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
          选择变量
        </button>
      </div>

      {/* 已添加的变量更新列表 */}
      {Object.keys(updateVariables).length > 0 && (
        <div style={{ 
          marginBottom: '10px', 
          border: '1px solid #eee', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>当前变量更新:</div>
          {Object.entries(updateVariables).map(([varPath, value]) => (
            <div key={varPath} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '5px',
              backgroundColor: '#f9f9f9',
              marginBottom: '5px',
              borderRadius: '4px'
            }}>
              <div>
                <span style={{ fontWeight: 'bold' }}>{varPath}</span> = <span>{String(value)}</span>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => editVariableUpdate(varPath, value)}
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
                  编辑
                </button>
                <button 
                  onClick={() => removeVariableUpdate(varPath)}
                  style={{
                    backgroundColor: '#e24a4a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 变量选择器 */}
      {showVariableEditor && (
        <div style={{
          marginTop: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择要更新的变量:</div>
          {getAvailableVariables().length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              暂无变量，请先在"变量设置"中添加变量
            </div>
          ) : (
            <VariableSelector
              variables={getAvailableVariables()}
              onSelect={handleVariableSelect}
            />
          )}
        </div>
      )}

      {/* 变量值输入 */}
      {selectedVariable && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>变量值:</label>
            <input
              // type={getVariableType(selectedVariable) === 'number' ? 'number' : 'text'}
              value={variableValue}
              onChange={(e) => setVariableValue(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              placeholder="输入变量值"
            />
          </div>
          <button
            onClick={addVariableUpdate}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {isEditing ? '更新' : '添加'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VariableEditor;