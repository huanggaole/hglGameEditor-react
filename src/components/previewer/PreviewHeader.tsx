import React from 'react';
import { PreviewHeaderProps } from './types';
import { useLanguage } from '../../contexts/LanguageContext';

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ currentType, onClose }) => {
  const { t } = useLanguage();
  return (
    <div className="preview-header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ margin: 0 }}>
        {currentType === 'start' ? t.gameStartTitle : 
         currentType === 'plot' ? t.plotPageTitle : 
         currentType === 'end' ? t.gameEndTitle : ''}
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
        {t.close}
      </button>
    </div>
  );
};

export default PreviewHeader;