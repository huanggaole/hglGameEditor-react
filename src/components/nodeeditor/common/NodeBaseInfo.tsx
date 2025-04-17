import React from 'react';
import { Node } from 'reactflow';
import { NODE_LABELS } from '../constants';

interface NodeBaseInfoProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
}

const NodeBaseInfo: React.FC<NodeBaseInfoProps> = ({ node, mname, setMname }) => {
  return (
    <>
      <h3>编辑 {NODE_LABELS[node.type as keyof typeof NODE_LABELS] || node.type} 节点</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>节点编号:</label>
        <input 
          type="text" 
          value={node.id} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>模块名称 (mname):</label>
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