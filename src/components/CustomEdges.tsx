import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

// 自定义边组件
export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  sourceHandle, // 添加sourceHandle属性
}) => {
  // 检查是否是自连接（源节点和目标节点是同一个）
  const isSelfConnecting = source === target;
  
  let edgePath, labelX, labelY;
  
  if (isSelfConnecting) {
    // 计算自连接路径的控制点
    // 向右延伸的距离
    const extendRight = 150;
    // 向上延伸的距离
    const extendUp = 80;
    
    // 创建一个自定义的SVG路径
    // 从源点开始，先向右，然后向上，再向左，最后连回目标点
    if(sourceX >= targetX){
      edgePath = `M ${sourceX} ${sourceY} 
                 C ${sourceX} ${sourceY + extendUp}, 
                   ${sourceX + extendRight} ${sourceY + extendUp}, 
                   ${sourceX + extendRight} ${(sourceY + targetY)/2} 
                 C ${sourceX + extendRight} ${targetY - extendUp}, 
                   ${sourceX} ${targetY - extendUp}, 
                   ${targetX} ${targetY}`;
    } else {
      edgePath = `M ${sourceX} ${sourceY} 
                 C ${sourceX} ${sourceY + extendUp}, 
                   ${sourceX - extendRight} ${sourceY + extendUp}, 
                   ${sourceX - extendRight} ${(sourceY + targetY)/2} 
                 C ${sourceX - extendRight} ${targetY - extendUp}, 
                   ${sourceX} ${targetY - extendUp}, 
                   ${targetX} ${targetY}`;
    }
    
    
    // 设置标签位置在路径的顶部中间
    labelX = sourceX + extendRight/2;
    labelY = sourceY - extendUp;
  } else {
    // 正常连接的贝塞尔曲线路径
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      // 确保sourceHandle属性被传递给getBezierPath函数
      sourceHandle,
    });
  }

  // 边的样式
  const edgeStyle = {
    stroke: '#888',
    strokeWidth: 2,
    ...style,
  };

  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text
        x={labelX}
        y={labelY}
        style={{
          fontSize: '12px',
          fill: '#888',
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          pointerEvents: 'none',
          backgroundColor: 'white',
        }}
      >
        
        {/* 显示变量更新信息 */}
        {data?.updateVariables && Object.keys(data.updateVariables).length > 0 && (
          <tspan x={labelX} dy="15" dx="0">
            变量更新: {Object.entries(data.updateVariables)
              .map(([key, value]) => `${key}=${value}`)
              .join(', ')}
          </tspan>
        )}
      </text>
    </>
  );
};