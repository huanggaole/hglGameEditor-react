import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { nodeStyles } from '../common/nodeStyles';

export const ContainerNode = ({ data, id, selected }: NodeProps) => {
  const { getNodes } = useReactFlow();
  // 获取该收纳节点下的所有出口节点
  const exitNodes = getNodes().filter(node => node.data.parentId === id && node.type === 'exit');
  
  return (
    <div style={{
      ...nodeStyles.container,
      border: selected ? '3px dashed #666666' : '2px dashed #666666',
      position: 'relative',
      minWidth: '200px' // 增加最小宽度以容纳多个出口
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.note && <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>备注: {data.note}</div>}
      </div>
      
      {/* 动态生成出口节点的Handle */}
      {exitNodes.map((exitNode: any, index: number) => {
        // 计算每个Handle的位置，均匀分布在底部
        const totalExits = exitNodes.length;
        const position = index / (totalExits - 1 || 1); // 0到1之间的值
        const x = ((exitNode.length > 1) ? (position * 100) : 50); // 转换为百分比
        
        return (
          <div key={exitNode.id} style={{ position: 'relative' }}>
            <Handle
              type="source"
              position={Position.Bottom}
              id={`exit-${exitNode.id}`}
              style={{
                left: `${x}%`,
                bottom: '-15px',
                transform: 'translateX(-50%)',
                background: '#000000' // 使用与其他节点相同的灰色
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${x}%`,
                bottom: '-30px', // 将标签移到脚注下方
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: '#000000',
                textAlign: 'center',
                width: `${100 / totalExits}%`, // 每个标签宽度等于脚注间距
                wordBreak: 'break-word'
              }}
            >
              {exitNode.data.mname || exitNode.data.label}
            </div>
          </div>
        );
      })}
      
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'container', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};