import React from 'react';

interface TransitionTypeSelectorProps {
  transitionType: string;
  setTransitionType: (value: string) => void;
}

const TransitionTypeSelector: React.FC<TransitionTypeSelectorProps> = ({
  transitionType,
  setTransitionType
}) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>跳转方式:</label>
      <select
        value={transitionType}
        onChange={(e) => setTransitionType(e.target.value)}
        style={{ width: '100%', padding: '5px' }}
      >
        <option value="goto">直接跳转</option>
        <option value="btnsto">按钮选择</option>
      </select>
    </div>
  );
};

export default TransitionTypeSelector;