import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../../VariableEditor';
import NodeBaseInfo from '../common/NodeBaseInfo';
import NoteEditor from '../common/NoteEditor';
import ActionButtons from '../common/ActionButtons';
import VariableSelector from '../VariableSelector';

interface ConditionNodeEditorProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
  showInfo: string;
  setShowInfo: (value: string) => void;
  conditions: {variable: string, type: string, value: string, label: string}[];
  setConditions: (conditions: {variable: string, type: string, value: string, label: string}[]) => void;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const ConditionNodeEditor: React.FC<ConditionNodeEditorProps> = ({
  node,
  mname,
  setMname,
  showInfo,
  setShowInfo,
  conditions,
  setConditions,
  onClose,
  updateNode
}) => {
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [showConditionVariableSelector, setShowConditionVariableSelector] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<CustomVariable | null>(null);
  const [newCondition, setNewCondition] = useState<{variable: string, type: string, value: string, label: string}>(
    {variable: '', type: '等于', value: '', label: ''}
  );

  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, []);

  const handleSave = () => {
    updateNode(node.id, {
      ...node.data,
      mname,
      note: showInfo, // 使用showInfo作为备注
      conditions
    });
    onClose();
  };

  const addCondition = () => {
    if (newCondition.variable && newCondition.value) {
      if (editingConditionIndex !== null) {
        // 编辑现有条件
        const updatedConditions = [...conditions];
        updatedConditions[editingConditionIndex] = { ...newCondition };
        setConditions(updatedConditions);
        setEditingConditionIndex(null);
      } else {
        // 添加新条件
        setConditions([...conditions, { ...newCondition }]);
      }
      setNewCondition({variable: '', type: '等于', value: '', label: ''});
      setShowAddCondition(false);
    }
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const selectVariable = (variable: CustomVariable) => {
    setSelectedVariable(variable);
    setNewCondition({...newCondition, variable: variable.name, type: getDefaultConditionType(variable.type)});
    setShowConditionVariableSelector(false);
  };
  
  const editCondition = (index: number) => {
    const condition = conditions[index];
    setNewCondition({...condition});
    setEditingConditionIndex(index);
    setShowAddCondition(true);
    
    // 尝试找到对应的变量以获取正确的类型选项
    const variable = variables.find(v => v.name === condition.variable);
    if (variable) {
      setSelectedVariable(variable);
    }
  };
  
  // 根据变量类型获取默认条件类型
  const getDefaultConditionType = (variableType: string): string => {
    switch(variableType) {
      case 'number': return '等于';
      case 'string': return '等于';
      case 'boolean': return '等于';
      default: return '等于';
    }
  };
  
  // 根据变量类型获取条件类型选项
  const getConditionTypeOptions = (variableType: string) => {
    switch(variableType) {
      case 'number':
        return [
          <option key="eq" value="等于">等于</option>,
          <option key="neq" value="不等于">不等于</option>,
          <option key="gt" value="大于">大于</option>,
          <option key="lt" value="小于">小于</option>,
          <option key="gte" value="大于等于">大于等于</option>,
          <option key="lte" value="小于等于">小于等于</option>
        ];
      case 'string':
        return [
          <option key="eq" value="等于">等于</option>,
          <option key="contains" value="包含">包含</option>
        ];
      case 'boolean':
        return [
          <option key="eq" value="等于">等于</option>,
          <option key="neq" value="不等于">不等于</option>
        ];
      default:
        return [
          <option key="eq" value="等于">等于</option>
        ];
    }
  };

  return (
    <>
      <NodeBaseInfo node={node} mname={mname} setMname={setMname} />
      
      <NoteEditor 
        note={showInfo} 
        setNote={setShowInfo} 
      />
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label style={{ display: 'block' }}>条件列表:</label>
          <button 
            onClick={() => {
              setShowAddCondition(!showAddCondition);
              setEditingConditionIndex(null);
              setNewCondition({variable: '', type: '等于', value: '', label: ''});
            }}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
            }}
          >
            插入条件
          </button>
        </div>
        
        <div style={{ 
          marginBottom: '10px', 
          padding: '8px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '4px',
          border: '1px dashed #ccc'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            <strong>默认分支说明：</strong>当不满足任何一个条件列表中的条件时，将执行默认分支。
          </p>
        </div>
        
        {conditions.map((condition, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            marginBottom: '5px',
            padding: '5px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <div style={{ flex: 1 }}>
              <strong>变量:</strong> {condition.variable}, 
              <strong>条件:</strong> {condition.type}, 
              <strong>值:</strong> {condition.value}
            </div>
            <div>
              <button 
                onClick={() => editCondition(index)}
                style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 8px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
              >
                编辑
              </button>
              <button 
                onClick={() => removeCondition(index)}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 8px',
                  cursor: 'pointer',
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))}

        {showAddCondition && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h4>{editingConditionIndex !== null ? '编辑条件' : '添加新条件'}</h4>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>变量:</label>
            <div style={{ display: 'flex' }}>
              <input 
                type="text" 
                value={newCondition.variable} 
                readOnly
                style={{ flex: 1, marginRight: '5px', padding: '5px' }} 
              />
              <button 
                onClick={() => setShowConditionVariableSelector(!showConditionVariableSelector)}
                style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 8px',
                  cursor: 'pointer',
                }}
              >
                选择
              </button>
            </div>
          </div>

          {showConditionVariableSelector && (
            <div style={{ 
              marginTop: '10px', 
              border: '1px solid #ccc', 
              padding: '10px',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <h4>选择变量</h4>
              {variables.length > 0 ? (
                <VariableSelector 
                  variables={variables} 
                  onSelect={(variable) => selectVariable(variable)}
                />
              ) : (
                <p>没有可用变量</p>
              )}
              <button 
                onClick={() => setShowConditionVariableSelector(false)}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </div>
          )}
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>条件类型:</label>
            <select
              value={newCondition.type}
              onChange={(e) => setNewCondition({...newCondition, type: e.target.value})}
              style={{ width: '100%', padding: '5px' }}
              disabled={!selectedVariable}
            >
              {selectedVariable ? getConditionTypeOptions(selectedVariable.type) : <option value="">请先选择变量</option>}
            </select>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>值:</label>
            <input 
              type="text" 
              value={newCondition.value} 
              onChange={(e) => setNewCondition({...newCondition, value: e.target.value})}
              style={{ width: '100%', padding: '5px' }} 
            />
          </div>
          

          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => {
                setShowAddCondition(false);
                setEditingConditionIndex(null);
                setNewCondition({variable: '', type: '等于', value: '', label: ''});
              }}
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              取消
            </button>
            <button 
              onClick={addCondition}
              style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
              disabled={!newCondition.variable || !newCondition.value}
            >
              {editingConditionIndex !== null ? '保存修改' : '添加条件'}
            </button>
          </div>
        </div>
        )}
      </div>

      <ActionButtons onClose={onClose} onSave={handleSave} />
    </>
  );
};

export default ConditionNodeEditor;