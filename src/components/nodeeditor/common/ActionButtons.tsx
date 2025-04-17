import React from 'react';

interface ActionButtonsProps {
  onClose: () => void;
  onSave: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onClose, onSave }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
      <button onClick={onClose}>取消</button>
      <button onClick={onSave}>保存</button>
    </div>
  );
};

export default ActionButtons;