import { NodeProps } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { DirectTransitionHandler } from '../common/DirectTransitionHandler';
import { ButtonGroupHandler } from '../common/ButtonGroupHandler';
import { nodeStyles } from '../common/nodeStyles';
import { ShowInfoDisplay } from '../common/ShowInfoDisplay';



export const StartNode = ({ data, id, selected }: NodeProps) => {
  // 获取跳转方式，默认为直接跳转
  const transitionType = data.transitionType || 'goto';
  // 获取按钮列表，只有在按钮跳转模式下才使用
  const buttons = transitionType === 'btnsto' ? (data.buttons || []) : [];
  
  return (
    <div style={{
      ...nodeStyles.start,
      border: selected ? '3px solid #ff0000' : '2px solid #ff0000',
      position: 'relative'
    }}>
      <ShowInfoDisplay showInfo={data.showInfo} label={data.label} mname={data.mname} />
      
      {/* 根据跳转方式显示不同的source Handle */}
      {transitionType === 'goto' ? (
        <DirectTransitionHandler />
      ) : (
        <ButtonGroupHandler buttons={buttons} />
      )}
      
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