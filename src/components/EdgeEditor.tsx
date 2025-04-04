import { useState } from 'react';
import { Edge, useNodes } from 'reactflow';

interface EdgeEditorProps {
  edge: Edge;
  onClose: () => void;
  updateEdge: (edgeId: string, data: any) => void;
}

const EdgeEditor = ({ edge, onClose, updateEdge }: EdgeEditorProps) => {
  // 初始化边的数据，如果没有data则创建空对象
  const initialData = edge.data || {};
  // const [label, setLabel] = useState(initialData.label || '');
  const [ntype, setNtype] = useState(initialData.ntype || 'goto'); // 默认为直接跳转
  const [btnname, setBtnname] = useState(initialData.btnname || ''); // 按钮名称
  
  // 获取所有节点，用于显示源节点和目标节点的名称
  const nodes = useNodes();
  
  // 获取源节点和目标节点
  const sourceNode = nodes.find(node => node.id === edge.source);
  const targetNode = nodes.find(node => node.id === edge.target);
  
  // 获取源节点和目标节点的名称
  const sourceNodeName = sourceNode?.data?.mname || sourceNode?.id || '未知节点';
  const targetNodeName = targetNode?.data?.mname || targetNode?.id || '未知节点';

  const handleSave = () => {
    // 准备更新的数据
    const updatedData = {
      ntype
    };
    
    // 如果是按钮跳转，则添加按钮名称
    if (ntype === 'btnsto') {
      updatedData.btnname = btnname;
    }
    
    // 更新边数据
    updateEdge(edge.id, updatedData);
    onClose();
  };

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
      <h3>编辑跳转</h3>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>跳转前节点:</label>
        <input 
          type="text" 
          value={sourceNodeName} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>跳转后节点:</label>
        <input 
          type="text" 
          value={targetNodeName} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>跳转方式:</label>
        <select
          value={ntype}
          onChange={(e) => setNtype(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="goto">直接跳转</option>
          <option value="btnsto">按钮跳转</option>
        </select>
      </div>

      {ntype === 'btnsto' && (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>按钮名称:</label>
          <input 
            type="text" 
            value={btnname} 
            onChange={(e) => setBtnname(e.target.value)} 
            style={{ width: '100%', padding: '5px' }} 
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={onClose}>取消</button>
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  );
};

export default EdgeEditor;