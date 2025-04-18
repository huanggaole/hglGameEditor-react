import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { nodeStyles } from '../common/nodeStyles';
import { useLanguage } from '../../../contexts/LanguageContext';

// 入口节点 - 收纳节点内部的入口点
export const EntryNode = ({}: NodeProps) => {
  const { t } = useLanguage();
  return (
    <div style={{
      ...nodeStyles.entry,
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Bottom} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold' }}>{t.entryNodeName}</div>
      </div>
    </div>
  );
};

// 出口节点 - 收纳节点内部的出口点
export const ExitNode = ({ data, id, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();

  return (
    <div
      style={{
        ...nodeStyles.exit,
        border: selected ? '3px solid #00cc00' : '2px solid #00cc00',
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: 'white'
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
      {data.note && <div style={{ fontSize: '12px', color: '#666' }}>{data.note}</div>}
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'exit', position: { x: 0, y: 0 } }}
          onEdit={data.onEdit}
          onDelete={data.onDelete}
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};