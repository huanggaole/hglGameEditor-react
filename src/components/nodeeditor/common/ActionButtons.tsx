import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ActionButtonsProps {
  onClose: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onClose, onSave }) => {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
      <button onClick={onClose}>{t.cancel}</button>
      <button onClick={onSave}>{t.save}</button>
    </div>
  );
};

export default ActionButtons;