import React from 'react';
import { Node } from 'reactflow';
import { getNodeLabels, NODE_LABELS } from '../constants';
import { useLanguage } from '../../../contexts/LanguageContext';

interface NodeBaseInfoProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
}

const NodeBaseInfo: React.FC<NodeBaseInfoProps> = ({ node, mname, setMname }) => {
  const { t } = useLanguage();
  return (
    <>
      <h3>{t.edit} {getNodeLabels()[node.type as keyof typeof NODE_LABELS] || node.type}</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>{t.nodeId}:</label>
        <input 
          type="text" 
          value={node.id} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>{t.moduleName}:</label>
        <input 
          type="text" 
          value={mname} 
          onChange={(e) => setMname(e.target.value)} 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>
    </>
  );
};

export default NodeBaseInfo;