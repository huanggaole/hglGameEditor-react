import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../../VariableEditor';
import { useLanguage } from '../../../contexts/LanguageContext';
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
  const { t } = useLanguage();
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [showConditionVariableSelector, setShowConditionVariableSelector] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [selectedVariable, setSelectedVariable] = useState<CustomVariable | null>(null);
  const [newCondition, setNewCondition] = useState<{variable: string, type: string, value: string, label: string}>(
    {variable: '', type: t.equals, value: '', label: ''}
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
      setNewCondition({variable: '', type: t.equals, value: '', label: ''});
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
  
  const getDefaultConditionType = (variableType: string): string => {
    switch(variableType) {
      case 'number': return t.equals;
      case 'string': return t.equals;
      case 'boolean': return t.equals;
      default: return t.equals;
    }
  };
  
  const getConditionTypeOptions = (variableType: string) => {
    switch(variableType) {
      case 'number':
        return [
          <option key="eq" value={t.equals}>{t.equals}</option>,
          <option key="neq" value={t.notEquals}>{t.notEquals}</option>,
          <option key="gt" value={t.greaterThan}>{t.greaterThan}</option>,
          <option key="lt" value={t.lessThan}>{t.lessThan}</option>,
          <option key="gte" value={t.greaterThanOrEquals}>{t.greaterThanOrEquals}</option>,
          <option key="lte" value={t.lessThanOrEquals}>{t.lessThanOrEquals}</option>
        ];
      case 'string':
        return [
          <option key="eq" value={t.equals}>{t.equals}</option>,
          <option key="contains" value={t.contains}>{t.contains}</option>
        ];
      case 'boolean':
        return [
          <option key="eq" value={t.equals}>{t.equals}</option>,
          <option key="neq" value={t.notEquals}>{t.notEquals}</option>
        ];
      default:
        return [
          <option key="eq" value={t.equals}>{t.equals}</option>
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
          <label style={{ display: 'block' }}>{t.conditionList}:</label>
          <button 
            onClick={() => {
              setShowAddCondition(!showAddCondition);
              setEditingConditionIndex(null);
              setNewCondition({variable: '', type: t.equals, value: '', label: ''});
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
              <strong>{t.conditionType}:</strong> {condition.type}, 
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
              onChange={(e) => setNewCondition({...newCondition, type: e.target.value})}
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
                setNewCondition({variable: '', type: t.equals, value: '', label: ''});
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