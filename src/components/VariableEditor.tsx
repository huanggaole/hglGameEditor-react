import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// 变量类型枚举
export type VariableType = 'string' | 'number' | 'boolean' | 'object';

// 自定义变量接口
export interface CustomVariable {
  name: string;
  description: string;
  type: VariableType;
  defaultValue: any;
  children?: CustomVariable[];
}

interface VariableEditorProps {
  variables: CustomVariable[];
  onClose: () => void;
  onSave: (variables: CustomVariable[]) => void;
}

// 单个变量编辑组件
const VariableItem: React.FC<{
  variable: CustomVariable;
  onUpdate: (updated: CustomVariable) => void;
  onDelete: () => void;
  level: number;
}> = ({ variable, onUpdate, onDelete, level }) => {
  const [name, setName] = useState(variable.name);
  const [description, setDescription] = useState(variable.description);
  const [type, setType] = useState<VariableType>(variable.type);
  const [defaultValue, setDefaultValue] = useState<any>(variable.defaultValue);
  const [children, setChildren] = useState<CustomVariable[]>(variable.children || []);
  const [nameError, setNameError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  // 验证变量名（只允许英文和数字）
  const validateName = (value: string) => {
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setNameError(t.variableNameError);
      return false;
    }
    setNameError('');
    return true;
  };

  // 处理名称变更
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  // 处理类型变更
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as VariableType;
    setType(newType);
    
    // 根据类型重置默认值
    if (newType === 'string') setDefaultValue('');
    else if (newType === 'number') setDefaultValue(0);
    else if (newType === 'boolean') setDefaultValue(false);
    else if (newType === 'object') {
      setDefaultValue({});
      if (!children.length) {
        setChildren([]);
      }
    }
  };

  // 处理默认值变更
  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    if (type === 'number') {
      setDefaultValue(Number(value));
    } else if (type === 'string') {
      setDefaultValue(value);
    } else if (type === 'boolean') {
      setDefaultValue(e.target.value === 'true');
    }
  };

  // 添加子变量
  const addChildVariable = () => {
    const newChild: CustomVariable = {
      name: `child${children.length + 1}`,
      description: '',
      type: 'string',
      defaultValue: ''
    };
    setChildren([...children, newChild]);
  };

  // 更新子变量
  const updateChildVariable = (index: number, updatedChild: CustomVariable) => {
    const updatedChildren = [...children];
    updatedChildren[index] = updatedChild;
    setChildren(updatedChildren);
  };

  // 删除子变量
  const deleteChildVariable = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  // 当任何值变更时，更新父组件
  useEffect(() => {
    if (name && !nameError) {
      onUpdate({
        name,
        description,
        type,
        defaultValue,
        children: type === 'object' ? children : undefined
      });
    }
  }, [name, description, type, defaultValue, children, nameError]);

  return (
    <div style={{ 
      marginLeft: `${level * 20}px`, 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t.variableName}:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{ 
              width: '100%', 
              padding: '5px',
              borderColor: nameError ? 'red' : '#ccc' 
            }}
          />
          {nameError && <div style={{ color: 'red', fontSize: '12px' }}>{nameError}</div>}
        </div>
        
        <div style={{ flex: 1, marginRight: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>{t.variableType}:</label>
          <select
            value={type}
            onChange={handleTypeChange}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="string">{t.stringType}</option>
            <option value="number">{t.numberType}</option>
            <option value="boolean">{t.booleanType}</option>
            <option value="object">{t.objectType}</option>
          </select>
        </div>
        
        {type !== 'object' && (
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{t.defaultValue}:</label>
            {type === 'boolean' ? (
              <select
                value={String(defaultValue)}
                onChange={handleDefaultValueChange}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="true">{t.booleanTrue}</option>
                <option value="false">{t.booleanFalse}</option>
              </select>
            ) : (
              <input
                type={type === 'number' ? 'number' : 'text'}
                value={defaultValue}
                onChange={handleDefaultValueChange}
                style={{ width: '100%', padding: '5px' }}
              />
            )}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>{t.description}:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      
      {type === 'object' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button 
              onClick={() => setExpanded(!expanded)}
              style={{ 
                backgroundColor: '#f0f0f0', 
                border: '1px solid #ccc',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {expanded ? t.collapseChildren : t.expandChildren}
            </button>
            <button 
              onClick={addChildVariable}
              style={{ 
                backgroundColor: '#4CAF50', 
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {t.addChildVariable}
            </button>
          </div>
          
          {expanded && children.map((child, index) => (
            <VariableItem
              key={index}
              variable={child}
              onUpdate={(updated) => updateChildVariable(index, updated)}
              onDelete={() => deleteChildVariable(index)}
              level={level + 1}
            />
          ))}
        </div>
      )}
      
      <button 
        onClick={onDelete}
        style={{ 
          backgroundColor: '#f44336', 
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          marginTop: '10px'
        }}
      >
        {t.delete}
      </button>
    </div>
  );
};

// 主变量编辑器组件
const VariableEditor: React.FC<VariableEditorProps> = ({ variables, onClose, onSave }) => {
  const { t } = useLanguage();
  const [variableList, setVariableList] = useState<CustomVariable[]>(variables);

  // 添加新变量
  const addVariable = () => {
    const newVariable: CustomVariable = {
      name: `var${variableList.length + 1}`,
      description: '',
      type: 'string',
      defaultValue: ''
    };
    setVariableList([...variableList, newVariable]);
  };

  // 更新变量
  const updateVariable = (index: number, updatedVariable: CustomVariable) => {
    const updatedList = [...variableList];
    updatedList[index] = updatedVariable;
    setVariableList(updatedList);
  };

  // 删除变量
  const deleteVariable = (index: number) => {
    setVariableList(variableList.filter((_, i) => i !== index));
  };

  // 保存所有变量
  const handleSave = () => {
    onSave(variableList);
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0 }}>{t.variableTitle}</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={addVariable}
            style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {t.addVariable}
          </button>
        </div>
        
        {variableList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {t.noVariablesPrompt}
          </div>
        ) : (
          variableList.map((variable, index) => (
            <VariableItem
              key={index}
              variable={variable}
              onUpdate={(updated) => updateVariable(index, updated)}
              onDelete={() => deleteVariable(index)}
              level={0}
            />
          ))
        )}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{ 
              backgroundColor: '#f0f0f0', 
              border: '1px solid #ccc',
              padding: '8px 15px',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSave}
            style={{ 
              backgroundColor: '#2196F3', 
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariableEditor;