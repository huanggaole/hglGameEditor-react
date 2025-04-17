import { Handle, Position, NodeProps } from 'reactflow';
import { NodeControls } from './NodeEdgeControls';
// 移除未使用的useState导入
import { useReactFlow } from 'reactflow';
import { NODE_TYPES } from './nodeeditor/constants';

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
  },
  entry: {
    border: '2px solid #ff0000',  // 红色边框
    borderRadius: '50%',          // 圆形
    padding: '10px',
    backgroundColor: '#fff',
    width: '80px',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  exit: {
    border: '2px solid #00cc00',  // 绿色边框
    borderRadius: '50%',          // 圆形
    padding: '10px',
    backgroundColor: '#fff',
    width: '80px',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  condition: {
    border: '2px solid #ff9800',  // 橙色边框
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    minWidth: '180px',
    position: 'relative'
  }
};

// 开始节点
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
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.showInfo && <div>显示信息: {truncateText(data.showInfo)}</div>}
      </div>
      
      {/* 根据跳转方式显示不同的source Handle */}
      {transitionType === 'goto' ? (
        // 直接跳转 - 黑色Handle
        <div style={{ position: 'relative' }}>
          <Handle 
            type="source" 
            position={Position.Bottom} 
            style={{ 
              background: '#000000',
              bottom: '-15px', }} 
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '-30px',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#000000',
              textAlign: 'center',
              width: '100px',
              wordBreak: 'break-word'
            }}
          >
            直接跳转
          </div>
        </div>
      ) : (
        // 按钮跳转 - 多个蓝色Handle
        <div>
          {buttons.length > 0 ? (
            buttons.map((button: any, index: number) => {
              // 计算每个Handle的位置，均匀分布在底部
              const totalButtons = buttons.length;
              const position = index / (totalButtons - 1 || 1); // 0到1之间的值
              const x = ((buttons.length > 1) ? (position * 100) : 50); // 转换为百分比
              
              return (
                <div key={index} style={{ position: 'relative' }}>
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={`button-${index}`}
                    style={{
                      left: `${x}%`,
                      bottom: '-15px',
                      transform: 'translateX(-50%)',
                      background: '#4a90e2' // 蓝色
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      bottom: '-30px',
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      color: '#4a90e2',
                      textAlign: 'center',
                      width: `${100 / totalButtons}%`,
                      wordBreak: 'break-word'
                    }}
                  >
                    {button.title || `按钮${index+1}`}
                  </div>
                </div>
              );
            })
          ) : (
            // 如果没有按钮，显示一个默认的蓝色Handle
            <div style={{ position: 'relative' }}>
              <Handle 
                type="source" 
                position={Position.Bottom} 
                style={{
                  background: '#4a90e2', 
                  bottom: '-15px'
                }} 
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '-30px',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: '#4a90e2',
                  textAlign: 'center',
                  width: '100px',
                  wordBreak: 'break-word'
                }}
              >
                未设置按钮
              </div>
            </div>
          )}
        </div>
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

// 情节节点
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
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        {data.showInfo && <div>显示信息: {truncateText(data.showInfo)}</div>}
      </div>
      
      {/* 根据跳转方式显示不同的source Handle */}
      {transitionType === 'goto' ? (
        // 直接跳转 - 黑色Handle
        <div style={{ position: 'relative' }}>
          <Handle 
            type="source" 
            position={Position.Bottom} 
            style={{ 
              background: '#000000',
              bottom: '-15px', }} 
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '-30px',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#000000',
              textAlign: 'center',
              width: '100px',
              wordBreak: 'break-word'
            }}
          >
            直接跳转
          </div>
        </div>
      ) : (
        // 按钮跳转 - 多个蓝色Handle
        <div>
          {buttons.length > 0 ? (
            buttons.map((button: any, index: number) => {
              // 计算每个Handle的位置，均匀分布在底部
              const totalButtons = buttons.length;
              const position = index / (totalButtons - 1 || 1); // 0到1之间的值
              const x = ((buttons.length > 1) ? (position * 100) : 50); // 转换为百分比
              
              return (
                <div key={index} style={{ position: 'relative' }}>
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    id={`button-${index}`}
                    style={{
                      left: `${x}%`,
                      bottom: '-15px',
                      transform: 'translateX(-50%)',
                      background: '#4a90e2' // 蓝色
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      bottom: '-30px',
                      transform: 'translateX(-50%)',
                      fontSize: '10px',
                      color: '#4a90e2',
                      textAlign: 'center',
                      width: `${100 / totalButtons}%`,
                      wordBreak: 'break-word'
                    }}
                  >
                    {button.title || `按钮${index+1}`}
                  </div>
                </div>
              );
            })
          ) : (
            // 如果没有按钮，显示一个默认的蓝色Handle
            <div style={{ position: 'relative' }}>
              <Handle 
                type="source" 
                position={Position.Bottom} 
                style={{ background: '#4a90e2' }} 
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '-30px',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: '#4a90e2',
                  textAlign: 'center',
                  width: '100px',
                  wordBreak: 'break-word'
                }}
              >
                未设置按钮
              </div>
            </div>
          )}
        </div>
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
          onCopy={data.onCopy}
        />
      )}
    </div>
  );
};
   
// 收纳节点
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

// 入口节点 - 收纳节点内部的入口点
export const EntryNode = ({}: NodeProps) => {
  return (
    <div style={{
      ...nodeStyles.entry,
      position: 'relative'
    }}>
      <Handle type="source" position={Position.Bottom} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold' }}>入口</div>
      </div>
    </div>
  );
};

// 出口节点 - 收纳节点内部的出口点
export const ExitNode = ({ data, id, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();

  // 使用handleDelete函数或移除它
  // 这里我们保留它但添加注释，因为它可能在将来会被使用
  // @ts-ignore - TS6133: 'handleDelete' is declared but its value is never read.
  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

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

// 条件分歧节点 - 根据变量条件进行分支跳转

// 条件分歧节点 - 根据变量条件进行分支跳转
export const ConditionNode = ({ data, id, selected }: NodeProps) => {
  // 获取条件分支列表，默认为空数组
  const conditions = data.conditions || [];
  
  return (
    <div style={{
      ...nodeStyles.condition,
      border: selected ? '3px solid #ff9800' : '2px solid #ff9800',
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.mname || data.label}</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>条件分歧节点</div>
        {data.showInfo && <div style={{ marginBottom: '10px' }}>显示信息: {truncateText(data.showInfo)}</div>}
        
        {/* 显示条件列表摘要 */}
        {conditions.length > 0 && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>条件列表:</div>
            {conditions.map((condition: any, index: number) => (
              <div key={index} style={{ marginLeft: '10px', fontSize: '11px' }}>
                {index + 1}. {condition.variable} {condition.type} {condition.value} → {condition.label || `条件${index+1}`}
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
          默认分支
        </div>
      </div>
      
      {/* 条件分支 - 根据配置的条件生成多个出口 */}
      {conditions.length > 0 && conditions.map((condition: any, index: number) => {
        // 计算每个Handle的位置，均匀分布在右侧
        const totalConditions = conditions.length;
        const position = index / (totalConditions - 1 || 1); // 0到1之间的值
        const y = 20 + position * 60; // 垂直位置，从上到下分布
        
        return (
          <div key={index} style={{ position: 'relative' }}>
            <Handle
              type="source"
              position={Position.Right}
              id={`condition-${index}`}
              style={{
                top: `${y}px`,
                right: '-15px',
                background: '#ff9800' // 橙色
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: `${y}px`,
                right: '-120px',
                transform: 'translateY(-50%)',
                fontSize: '10px',
                color: '#ff9800',
                textAlign: 'left',
                width: '100px',
                wordBreak: 'break-word'
              }}
            >
              {condition.label || `条件${index+1}`}
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