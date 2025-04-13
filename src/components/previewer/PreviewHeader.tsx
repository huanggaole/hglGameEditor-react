import React from 'react';
import { PreviewHeaderProps } from './types';

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ currentType, onClose }) => {
  return (
    <div className="preview-header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ margin: 0 }}>
        {currentType === 'start' ? '游戏开始' : 
         currentType === 'plot' ? '剧情页面' : 
         currentType === 'end' ? '游戏结局' : ''}
      </h2>
      <button 
        onClick={onClose}
        style={{
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        关闭
      </button>
    </div>
  );
};

export default PreviewHeader;