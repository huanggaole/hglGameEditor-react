import React from 'react';
import { PreviewActionsProps } from './types';

const PreviewActions: React.FC<PreviewActionsProps> = ({ 
  currentType, 
  buttons, 
  onButtonClick, 
  onRestart 
}) => {
  return (
    <div className="preview-actions" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {currentType === 'end' ? (
        <button 
          onClick={onRestart}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          重新开始游戏
        </button>
      ) : (
        buttons.map(button => (
          <button 
            key={button.id}
            onClick={() => onButtonClick(button.targetNodeId, button.id)}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            {button.label}
          </button>
        ))
      )}
    </div>
  );
};

export default PreviewActions;