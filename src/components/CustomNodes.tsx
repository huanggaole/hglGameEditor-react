import { Handle, Position, NodeProps } from 'reactflow';
import { NodeControls } from './NodeEdgeControls';

// 文本截断辅助函数
const truncateText = (text: string): string => {
  if (text.length > 5) {
    return text.substring(0, 5) + '...';
  }
  return text;
};

// 自定义节点样式
const nodeStyles = {
  start: {
    border: '2px solid #ff0000',  // 红色边框
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    minWidth: '150px'
  },
  plot: {
    border: '2px solid #888888',  // 灰色边框
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    minWidth: '150px'
  },
  end: {
    border: '2px solid #00cc00',  // 绿色边框
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    minWidth: '150px'
  },
  container: {
    border: '2px dashed #666666',  // 虚线边框
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    minWidth: '150px'
  }
};

// 开始节点
export const StartNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.start,
      border: selected ? '3px solid #ff0000' : '2px solid #ff0000',
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Bottom} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.showInfo && <div>显示信息: {truncateText(data.showInfo)}</div>}
      </div>
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'start', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
        />
      )}
    </div>
  );
};

// 情节节点
export const PlotNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.plot,
      border: selected ? '3px solid #888888' : '2px solid #888888',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.showInfo && <div>显示信息: {truncateText(data.showInfo)}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'plot', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
        />
      )}
    </div>
  );
};

// 结局节点
export const EndNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.end,
      border: selected ? '3px solid #00cc00' : '2px solid #00cc00',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.showInfo && <div>显示信息: {truncateText(data.showInfo)}</div>}
      </div>
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'end', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
        />
      )}
    </div>
  );
};

// 收纳节点
export const ContainerNode = ({ data, id, selected }: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.container,
      border: selected ? '3px dashed #666666' : '2px dashed #666666',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.note && <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>备注: {data.note}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} />
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'container', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
        />
      )}
    </div>
  );
};