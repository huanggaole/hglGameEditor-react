import React from 'react';
import { CustomVariable } from '../VariableEditor';

interface VariableSelectorProps {
  variables: CustomVariable[];
  onSelect: (variable: CustomVariable, path: string) => void;
  path?: string;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({ variables, onSelect, path = '' }) => {
  return (
    <div>
      {variables.map((variable) => {
        const currentPath = path ? `${path}.${variable.name}` : variable.name;
        
        if (variable.type === 'object' && variable.children && variable.children.length > 0) {
          return (
            <div key={currentPath} style={{ marginLeft: '15px' }}>
              <div style={{ fontWeight: 'bold' }}>{variable.name} (对象):</div>
              <VariableSelector
                variables={variable.children}
                onSelect={onSelect}
                path={currentPath}
              />
            </div>
          );
        } else {
          return (
            <div key={currentPath} style={{ 
              padding: '5px', 
              margin: '5px 0', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }} onClick={() => onSelect({ ...variable, name: currentPath }, currentPath)}>
              <span>{currentPath} ({variable.type})</span>
              <button style={{
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>选择</button>
            </div>
          );
        }
      })}
    </div>
  );
};

export default VariableSelector;