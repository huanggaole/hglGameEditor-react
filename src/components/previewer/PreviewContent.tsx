import React from 'react';
import { PreviewContentProps } from './types';

const PreviewContent: React.FC<PreviewContentProps> = ({ currentNode, parseVariables }) => {
  return (
    <div className="preview-content" style={{
      flex: 1,
      overflow: 'auto',
      border: '1px solid #eee',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
      whiteSpace: 'pre-wrap' // 保留换行符
    }}>
      {currentNode?.type !== 'container' && parseVariables(currentNode?.data?.showInfo || '无内容显示')}
    </div>
  );
};

export default PreviewContent;