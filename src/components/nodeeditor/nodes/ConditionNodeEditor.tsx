import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../../VariableEditor';
import { useLanguage } from '../../../contexts/LanguageContext';
import NodeBaseInfo from '../common/NodeBaseInfo';
import NoteEditor from '../common/NoteEditor';
import ActionButtons from '../common/ActionButtons';
import VariableSelector from '../VariableSelector';
import { ConditionType, conditionTypeToTransKey, variableTypeToConditionTypes } from '../constants/conditionTypes';
import { zhCN, enUS } from '../../../locales';

interface ConditionNodeEditorProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
  showInfo: string;
  setShowInfo: (value: string) => void;
  conditions: {variable: string, type: ConditionType, value: string, label: string}[];
  setConditions: (conditions: {variable: string, type: ConditionType, value: string, label: string}[]) => void;
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
  const { t } = useLanguage();
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [showConditionVariableSelector, setShowConditionVariableSelector] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<CustomVariable | null>(null);
  const [newCondition, setNewCondition] = useState<{variable: string, type: ConditionType, value: string, label: string}>(
    {variable: '', type: ConditionType.EQUALS, value: '', label: ''}
  );

  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, []);

  const handleSave = () => {
    updateNode(node.id, {
      ...node.data,
      mname,
      note: showInfo,
      conditions
    });
    onClose();
  };

  const addCondition = () => {
    if (newCondition.variable && newCondition.value) {
      if (editingConditionIndex !== null) {
        const updatedConditions = [...conditions];
        updatedConditions[editingConditionIndex] = { ...newCondition };
        setConditions(updatedConditions);
        setEditingConditionIndex(null);
      } else {
        setConditions([...conditions, { ...newCondition }]);
      }
      setNewCondition({variable: '', type: ConditionType.EQUALS, value: '', label: ''});
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
    
    const variable = variables.find(v => v.name === condition.variable);
    if (variable) {
      setSelectedVariable(variable);
    }
  };
  
  const getDefaultConditionType = (variableType: string): ConditionType => {
    return variableTypeToConditionTypes[variableType]?.[0] || ConditionType.EQUALS;
  };
  
  const getConditionTypeOptions = (variableType: string) => {
    const availableTypes = variableTypeToConditionTypes[variableType] || [ConditionType.EQUALS];
    return availableTypes.map(type => (
      <option key={type} value={type}>{t[conditionTypeToTransKey[type] as keyof typeof t]}</option>
    ));
  };

  // 定义一个映射函数，将 ConditionType 枚举值转换为当前语言下的字符串
  const conditionTypeToString = (type: ConditionType): string => {
    switch (type) {
      case ConditionType.EQUALS:
        return t.equals;
      case ConditionType.NOT_EQUALS:
        return t.notEquals;
      case ConditionType.GREATER_THAN:
        return t.greaterThan;
      case ConditionType.LESS_THAN:
        return t.lessThan;
      case ConditionType.GREATER_THAN_OR_EQUALS:
        return t.greaterThanOrEquals;
      case ConditionType.LESS_THAN_OR_EQUALS:
        return t.lessThanOrEquals;
      case ConditionType.CONTAINS:
        return t.contains;
      default:
        return t.equals;
    }
  }
  // 定义一个映射函数，将字符串安全转换为 ConditionType 枚举值
  const stringToConditionType = (key: string): ConditionType => {
    if(key == zhCN.equals || key == enUS.equals){
      return ConditionType.EQUALS;
    } else if(key == zhCN.notEquals || key == enUS.notEquals){
      return ConditionType.NOT_EQUALS; 
    } else if(key == zhCN.greaterThan || key == enUS.greaterThan){
      return ConditionType.GREATER_THAN; 
    } else if(key == zhCN.lessThan || key == enUS.lessThan){
      return ConditionType.LESS_THAN; 
    } else if(key == zhCN.greaterThanOrEquals || key == enUS.greaterThanOrEquals){
      return ConditionType.GREATER_THAN_OR_EQUALS; 
    } else if(key == zhCN.lessThanOrEquals|| key == enUS.lessThanOrEquals){
      return ConditionType.LESS_THAN_OR_EQUALS;
    } else if(key == zhCN.contains || key == enUS.contains){
      return ConditionType.CONTAINS; 
    }
    return ConditionType.EQUALS;
  }

  return (
    <>
      <NodeBaseInfo node={node} mname={mname} setMname={setMname} />
      
      <NoteEditor 
        note={showInfo} 
        setNote={setShowInfo} 
      />
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label style={{ display: 'block' }}>{t.conditionList}:</label>
          <button 
            onClick={() => {
              setShowAddCondition(!showAddCondition);
              setEditingConditionIndex(null);
              setNewCondition({variable: '', type: ConditionType.EQUALS, value: '', label: ''});
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
            {t.insertCondition}
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
            <strong>{t.defaultBranchNote}:</strong> {t.defaultBranchDesc}
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
              <strong>{t.variableLabel}:</strong> {condition.variable}, 
              <strong>{t.conditionType}:</strong> {conditionTypeToString(condition.type)}, 
              <strong>{t.conditionValue}:</strong> {condition.value}
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
                {t.edit}
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
                {t.delete}
              </button>
            </div>
          </div>
        ))}

        {showAddCondition && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h4>{editingConditionIndex !== null ? t.editCondition : t.addNewCondition}</h4>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{t.variableLabel}:</label>
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
                {t.selectVariableBtn}
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
              <h4>{t.selectVariable}</h4>
              {variables.length > 0 ? (
                <VariableSelector 
                  variables={variables} 
                  onSelect={(variable) => selectVariable(variable)}
                />
              ) : (
                <p>{t.noVariables}</p>
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
                {t.close}
              </button>
            </div>
          )}
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{t.conditionType}:</label>
            <select
              value={newCondition.type}
              onChange={(e) => {
                const selectedOption = e.target.selectedOptions[0]; // 获取选中的第一个选项
                if (selectedOption) {
                  console.log('Selected option text:', selectedOption.textContent); // 安全访问文本内容
                  const selectedValue = selectedOption.textContent || '';
                  if (stringToConditionType(selectedValue) !== undefined) {
                    setNewCondition({ ...newCondition, type: stringToConditionType(selectedValue) });
                  }
                }
              }}
              style={{ width: '100%', padding: '5px' }}
              disabled={!selectedVariable}
            >
              {selectedVariable ? getConditionTypeOptions(selectedVariable.type) : <option value="">{t.pleaseSelectVariable}</option>}
            </select>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{t.conditionValue}:</label>
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
                setNewCondition({variable: '', type: ConditionType.EQUALS, value: '', label: ''});
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
              {t.cancel}
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
              {editingConditionIndex !== null ? t.save : t.addNewCondition}
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