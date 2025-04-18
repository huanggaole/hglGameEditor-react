import { Handle, Position, NodeProps } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { DirectTransitionHandler } from '../common/DirectTransitionHandler';
import { ButtonGroupHandler } from '../common/ButtonGroupHandler';
import { nodeStyles } from '../common/nodeStyles';
import { ShowInfoDisplay } from '../common/ShowInfoDisplay';

export const PlotNode = ({ data, id, selected }: NodeProps) => {
  // 获取跳转方式，默认为直接跳转
  const transitionType = data.transitionType || 'goto';
  // 获取按钮列表，只有在按钮跳转模式下才使用
  const buttons = transitionType === 'btnsto' ? (data.buttons || []) : [];
  
  return (
    <div style={{
      ...nodeStyles.plot,
      border: selected ? '3px solid #888888' : '2px solid #888888',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <ShowInfoDisplay showInfo={data.showInfo} label={data.label} mname={data.mname} />
      
      {/* 根据跳转方式显示不同的source Handle */}
      {transitionType === 'goto' ? (
        <DirectTransitionHandler />
      ) : (
        <ButtonGroupHandler buttons={buttons} />
      )}
      
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: 'plot', position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};