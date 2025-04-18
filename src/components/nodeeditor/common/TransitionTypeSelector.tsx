import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TransitionTypeSelectorProps {
  transitionType: string;
  setTransitionType: (value: string) => void;
}

const TransitionTypeSelector: React.FC<TransitionTypeSelectorProps> = ({
  transitionType,
  setTransitionType
}) => {
  const { t } = useLanguage();
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{t.transitionMethod}:</label>
      <select
        value={transitionType}
        onChange={(e) => setTransitionType(e.target.value)}
        style={{ width: '100%', padding: '5px' }}
      >
        <option value="goto">{t.directTransition}</option>
        <option value="btnsto">{t.buttonSelection}</option>
      </select>
    </div>
  );
};

export default TransitionTypeSelector;