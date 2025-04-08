import React, { useState } from 'react';
import { CustomVariable } from '../VariableEditor';
import VariableSelector from './VariableSelector';

interface ConditionEditorProps {
  conditionVariable: string;
  conditionType: string;
  conditionValue: string;
  getVariableType: (variablePath: string) => string;
  onConditionChange: (updates: {
    conditionVariable?: string;
    conditionType?: string;
    conditionValue?: string;
  }) => void;
}

const ConditionEditor: React.FC<ConditionEditorProps> = ({
  conditionVariable,
  conditionType,
  conditionValue,
  getVariableType,
  onConditionChange
}) => {
  const [showConditionVariableSelector, setShowConditionVariableSelector] = useState(false);

  // 获取条件类型选项
  const getConditionTypeOptions = (variableType: string) => {
    switch (variableType) {
      case 'string':
        return [
          { value: '等于', label: '等于' },
          { value: '包含', label: '包含' }
        ];
      case 'number':
        return [
          { value: '等于', label: '等于' },
          { value: '大于', label: '大于' },
          { value: '小于', label: '小于' },
          { value: '大于等于', label: '大于等于' },
          { value: '小于等于', label: '小于等于' },
          { value: '不等于', label: '不等于' }
        ];
      case 'boolean':
        return [
          { value: '为真', label: '为真' },
          { value: '为假', label: '为假' }
        ];
      default:
        return [{ value: '等于', label: '等于' }];
    }
  };

  // 判断是否需要显示条件值输入框
  const needsConditionValue = (variableType: string, conditionType: string): boolean => {
    // 布尔类型且条件为'true'或'false'时不需要输入值
    if (variableType === 'boolean' && (conditionType === 'true' || conditionType === 'false')) {
      return false;
    }
    // 其他情况都需要输入条件值
    return true;
  };

  // 处理变量选择
  const handleVariableSelect = (variable: CustomVariable, path: string) => {
    onConditionChange({ conditionVariable: path });
    setShowConditionVariableSelector(false);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <label>条件变量:</label>
        <button 
          onClick={() => setShowConditionVariableSelector(!showConditionVariableSelector)}
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

      {/* 显示已选择的条件变量 */}
      {conditionVariable && (
        <div style={{ 
          padding: '5px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold' }}>{conditionVariable}</span>
          <button 
            onClick={() => onConditionChange({ conditionVariable: '' })}
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
            清除
          </button>
        </div>
      )}

      {/* 条件变量选择器 */}
      {showConditionVariableSelector && (
        <div style={{
          marginTop: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择条件变量:</div>
          {(window.appVariables || []).length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              暂无变量，请先在"变量设置"中添加变量
            </div>
          ) : (
            <VariableSelector
              variables={window.appVariables || []}
              onSelect={handleVariableSelect}
            />
          )}
        </div>
      )}

      {/* 条件类型和值设置 */}
      {conditionVariable && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>条件类型:</label>
            <select
              value={conditionType}
              onChange={(e) => onConditionChange({ conditionType: e.target.value })}
              style={{ width: '100%', padding: '5px' }}
            >
              {getConditionTypeOptions(getVariableType(conditionVariable)).map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {needsConditionValue(getVariableType(conditionVariable), conditionType) && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>条件值:</label>
              <input
                type={getVariableType(conditionVariable) === 'number' ? 'number' : 'text'}
                value={conditionValue}
                onChange={(e) => onConditionChange({ conditionValue: e.target.value })}
                style={{ width: '100%', padding: '5px' }}
                placeholder="输入条件值"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConditionEditor;