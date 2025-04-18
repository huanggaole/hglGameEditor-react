import { Handle, Position } from 'reactflow';
import { useLanguage } from '../../../contexts/LanguageContext';

interface DirectTransitionHandlerProps {
  position?: Position;
}

export const DirectTransitionHandler = ({ position = Position.Bottom }: DirectTransitionHandlerProps) => {
  return (
    <div style={{ position: 'relative' }}>
      <Handle 
        type="source" 
        position={position} 
        style={{ 
          background: '#000000',
          bottom: '-15px',
        }} 
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-30px',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: '#000000',
          textAlign: 'center',
          width: '100px',
          wordBreak: 'break-word'
        }}
      >
        {useLanguage().t.directTransition}
      </div>
    </div>
  );
};