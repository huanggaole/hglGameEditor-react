import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ButtonListEditorProps {
  buttons: {title: string}[];
  setButtons: (buttons: {title: string}[]) => void;
}

const ButtonListEditor: React.FC<ButtonListEditorProps> = ({
  buttons,
  setButtons
}) => {
  const { t } = useLanguage();
  // 添加按钮
  const addButton = () => {
    setButtons([...buttons, { title: '' }]);
  };

  // 更新按钮标题
  const updateButtonTitle = (index: number, title: string) => {
    const newButtons = [...buttons];
    newButtons[index].title = title;
    setButtons(newButtons);
  };

  // 删除按钮
  const removeButton = (index: number) => {
    const newButtons = [...buttons];
    newButtons.splice(index, 1);
    setButtons(newButtons);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{t.buttonList}:</label>
      {buttons.map((button, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
          <input
            type="text"
            value={button.title}
            onChange={(e) => updateButtonTitle(index, e.target.value)}
            placeholder={t.buttonTitle}
            style={{ flex: 1, marginRight: '5px', padding: '5px' }}
          />
          <button 
            onClick={() => removeButton(index)}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0 8px',
              cursor: 'pointer',
            }}
          >
            {t.removeButton}
          </button>
        </div>
      ))}
      <button 
        onClick={addButton}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
          marginTop: '5px'
        }}
      >
        {t.addButton}
      </button>
    </div>
  );
};

export default ButtonListEditor;