import { Handle, Position, NodeProps } from 'reactflow';
import { NodeControls } from '../../NodeEdgeControls';
import { nodeStyles } from '../common/nodeStyles';
import { NODE_TYPES } from '../../nodeeditor/constants';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ConditionType } from '../../nodeeditor/constants/conditionTypes';

// 不再需要文本截断辅助函数

export const ConditionNode = ({ data, id, selected }: NodeProps) => {
  // 获取条件分支列表，默认为空数组
  const conditions = data.conditions || [];
  // 定义一个映射函数，将 ConditionType 枚举值转换为当前语言下的字符串
  const conditionTypeToString = (type: ConditionType): string => {
    switch (type) {
      case ConditionType.EQUALS:
        return useLanguage().t.equals;
      case ConditionType.NOT_EQUALS:
        return useLanguage().t.notEquals;
      case ConditionType.GREATER_THAN:
        return useLanguage().t.greaterThan;
      case ConditionType.LESS_THAN:
        return useLanguage().t.lessThan;
      case ConditionType.GREATER_THAN_OR_EQUALS:
        return useLanguage().t.greaterThanOrEquals;
      case ConditionType.LESS_THAN_OR_EQUALS:
        return useLanguage().t.lessThanOrEquals;
      case ConditionType.CONTAINS:
        return useLanguage().t.contains;
      default:
        return useLanguage().t.equals;
    }
  }
  return (
    <div style={{
      ...nodeStyles.condition,
      border: selected ? '3px solid #ff9800' : '2px solid #ff9800',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        
        {/* 显示条件列表摘要 */}
        {conditions.length > 0 && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{useLanguage().t.conditionList}:</div>
            {conditions.map((condition: any, index: number) => (
              <div key={index} style={{ marginLeft: '10px', fontSize: '11px' }}>
                {index + 1}. {condition.variable} {conditionTypeToString(condition.type)} {condition.value} → {condition.label || useLanguage().t.condition + `${index+1}`}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 默认分支 - 当所有条件都不满足时执行 */}
      <div style={{ position: 'relative' }}>
        <Handle
          type="source"
          position={Position.Bottom}
          id="default"
          style={{
            background: '#666666', // 灰色
            bottom: '-15px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-30px',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#666666',
            textAlign: 'center',
            width: '100px',
            wordBreak: 'break-word'
          }}
        >
          {useLanguage().t.defaultBranch}
        </div>
      </div>
      
      {/* 条件分支 - 根据配置的条件生成多个出口 */}
      {conditions.length > 0 && conditions.map((condition: any, index: number) => {
        // 计算每个Handle的位置，均匀分布在右侧
        const totalConditions = conditions.length;
        const position = index / (totalConditions - 1 || 1); // 0到1之间的值
        const y = -32 + position * 20; // 垂直位置，从上到下分布
        
        return (
          <div key={index} style={{ position: 'relative' }}>
            <Handle
              type="source"
              position={Position.Left}
              id={`condition-${index}`}
              style={{
                top: `${y}px`,
                left: '-15px',
                background: '#ff9800' // 橙色
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: `${y}px`,
                left: '-120px',
                transform: 'translateY(-50%)',
                fontSize: '10px',
                color: '#ff9800',
                textAlign: 'right',
                width: '100px',
                wordBreak: 'break-word'
              }}
            >
              {condition.label || useLanguage().t.condition + `${index+1}`}
            </div>
          </div>
        );
      })}
      
      {selected && data.onEdit && data.onDelete && (
        <NodeControls 
          node={{ id, data, type: NODE_TYPES.CONDITION, position: { x: 0, y: 0 } }} 
          onEdit={data.onEdit} 
          onDelete={data.onDelete} 
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};