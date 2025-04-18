import { Handle, Position } from 'reactflow';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Button {
  title?: string;
}

interface ButtonGroupHandlerProps {
  buttons: Button[];
  position?: Position;
}

export const ButtonGroupHandler = ({ buttons, position = Position.Bottom }: ButtonGroupHandlerProps) => {
    if (buttons.length === 0) {
    return (
      <div style={{ position: 'relative' }}>
        <Handle 
          type="source" 
          position={position} 
          style={{
            background: '#4a90e2', 
            bottom: '-15px'
          }} 
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-30px',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#4a90e2',
            textAlign: 'center',
            width: '100px',
            wordBreak: 'break-word'
          }}
        >
          {useLanguage().t.noButtonSet}
        </div>
      </div>
    );
  }

  return (
    <div>
      {buttons.map((button, index) => {
        const totalButtons = buttons.length;
        const position = index / (totalButtons - 1 || 1);
        const x = ((buttons.length > 1) ? (position * 100) : 50);
        
        return (
          <div key={index} style={{ position: 'relative' }}>
            <Handle
              type="source"
              position={Position.Bottom}
              id={`button-${index}`}
              style={{
                left: `${x}%`,
                bottom: '-15px',
                transform: 'translateX(-50%)',
                background: '#4a90e2'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${x}%`,
                bottom: '-30px',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: '#4a90e2',
                textAlign: 'center',
                width: `${100 / totalButtons}%`,
                wordBreak: 'break-word'
              }}
            >
              {button.title || useLanguage().t.button + `${index+1}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};