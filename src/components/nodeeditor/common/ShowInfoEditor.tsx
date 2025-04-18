import React, { useState } from 'react';
import { CustomVariable } from '../../VariableEditor';
import VariableSelector from '../VariableSelector';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ShowInfoEditorProps {
  showInfo: string;
  setShowInfo: (value: string) => void;
  variables: CustomVariable[];
}

const ShowInfoEditor: React.FC<ShowInfoEditorProps> = ({ showInfo, setShowInfo, variables }) => {
  const { t } = useLanguage();
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
      <label style={{ display: 'block', marginBottom: '5px' }}>{t.showInfo}:</label>
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
          {t.insertVariable}
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
          <h4>{t.selectVariable}</h4>
          {variables.length > 0 ? (
            <VariableSelector 
              variables={variables} 
              onSelect={(variable) => addVariableReference(variable)}
            />
          ) : (
            <p>{t.noAvailableVariables}</p>
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
            {t.close}
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