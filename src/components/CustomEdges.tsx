import React from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';
import { EdgeControls } from './NodeEdgeControls';

// 创建自定义接口替代GetBezierPathParams
interface CustomBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition: any;
  targetX: number;
  targetY: number;
  targetPosition: any;
}

// 扩展EdgeProps接口以包含sourceHandle属性和回调函数
interface CustomEdgeProps extends EdgeProps {
  sourceHandle?: string;
  data?: {
    onEdit?: (edge: any) => void;
    onDelete?: (edgeId: string) => void;
    updateVariables?: Record<string, any>;
  };
}

// 自定义边组件
export const CustomEdge: React.FC<CustomEdgeProps> = ({
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
  selected, // 添加selected属性
}) => {
  // 使用useState来管理边的选中状态
  const reactFlowInstance = useReactFlow();
  
  // 检查是否是自连接（源节点和目标节点是同一个）
  const isSelfConnecting = source === target;
  
  // 使用sourceHandle参数来确定连接类型（解决未使用的参数警告）
  const isButtonConnection = sourceHandle && sourceHandle.startsWith('button-');
  
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
    // 创建一个符合CustomBezierPathParams类型的对象
    const pathParams: CustomBezierPathParams = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    };
    [edgePath, labelX, labelY] = getBezierPath(pathParams);
  }

  // 边的样式，根据选中状态调整
  const edgeStyle = {
    stroke: isButtonConnection ? '#4a90e2' : '#888', // 如果是按钮连接，使用蓝色
    strokeWidth: selected ? 3 : 2, // 选中时加粗
    ...style,
  };

  // 计算边控制按钮的位置
  const getEdgeControlPosition = () => {
    // 获取边的路径元素
    const edgeElement = document.getElementById(id);
    if (edgeElement && edgeElement instanceof SVGPathElement) {
      // 获取边的中点位置
      const pathLength = edgeElement.getTotalLength();
      const midPoint = edgeElement.getPointAtLength(pathLength / 2);
      
      // 使用reactFlowInstance将边的中点位置转换为屏幕坐标
      if (reactFlowInstance) {
        const { x, y } = ({
          x: midPoint.x + 60,
          y: midPoint.y
        });
        
        return { x, y };
      }
    }
    
    // 如果无法获取精确位置，使用边的中点作为近似位置
    return {
      x: (sourceX + targetX) / 2,
      y: (sourceY + targetY) / 2
    };
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
      
      {/* 当边被选中时显示控制按钮 */}
      {selected && data?.onEdit && data?.onDelete && (
        <foreignObject
          width={100}
          height={40}
          x={getEdgeControlPosition().x - 50}
          y={getEdgeControlPosition().y - 20}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <EdgeControls 
            edge={{ id, source, target, data }}
            onEdit={data.onEdit}
            onDelete={data.onDelete}
          />
        </foreignObject>
      )}
    </>
  );
};