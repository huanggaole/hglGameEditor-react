import React, { useState } from 'react';
import { CustomVariable } from '../../VariableEditor';
import VariableSelector from '../VariableSelector';

interface ShowInfoEditorProps {
  showInfo: string;
  setShowInfo: (value: string) => void;
  variables: CustomVariable[];
}

const ShowInfoEditor: React.FC<ShowInfoEditorProps> = ({ showInfo, setShowInfo, variables }) => {
  const [showVariableSelector, setShowVariableSelector] = useState(false);

  const addVariableReference = (variable: CustomVariable) => {
    if (variable.type === 'boolean') {
      setShowInfo(showInfo + `{{${variable.name}}?"true显示内容":"false显示内容"}}`); 
    } else {
      setShowInfo(showInfo + `{{${variable.name}}}`); 
    }
    setShowVariableSelector(false);
  };

  return (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>显示信息:</label>
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
          插入变量
        </button>
    </div>
    {showVariableSelector && (
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
              onSelect={(variable) => addVariableReference(variable)}
            />
          ) : (
            <p>没有可用变量</p>
          )}
          <button 
            onClick={() => setShowVariableSelector(false)}
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
    <div style={{ position: 'relative' }}>
      <textarea
        value={showInfo}
        onChange={(e) => setShowInfo(e.target.value)}
        style={{ width: '100%', padding: '5px', minHeight: '100px' }}
      />
    </div>
    </>
  );
};

export default ShowInfoEditor;