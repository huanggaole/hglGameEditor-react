import React from 'react';

interface EditorContainerProps {
  children: React.ReactNode;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ children }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      padding: '20px', 
      zIndex: 1000, 
      minWidth: '300px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      {children}
    </div>
  );
};

export default EditorContainer;