import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

// 自定义边组件
export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  // 计算贝塞尔曲线路径
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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
        {/* 显示跳转方式信息 */}
        <tspan dy="-10" dx="0">
          {data?.ntype === 'btnsto' 
            ? `按钮跳转:${data?.btnname || ''}` 
            : '直接跳转'}
        </tspan>
      </text>
    </>
  );
};