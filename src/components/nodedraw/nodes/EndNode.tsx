import { Handle, Position, NodeProps } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { nodeStyles } from '../common/nodeStyles';
import { ShowInfoDisplay } from '../common/ShowInfoDisplay';

export const EndNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.end,
      border: selected ? '3px solid #00cc00' : '2px solid #00cc00',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <ShowInfoDisplay showInfo={data.showInfo} label={data.label} mname={data.mname} />
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'end', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};