import React, { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { CustomVariable } from '../VariableEditor';
import { PreviewType, ButtonInfo, PreviewComponentProps } from './types';
import { deepCopyVariables, parseVariables, updateVariable } from './VariableUtils';
import PreviewHeader from './PreviewHeader';
import PreviewContent from './PreviewContent';
import PreviewActions from './PreviewActions';

const PreviewComponent: React.FC<PreviewComponentProps> = ({ nodes, edges, onClose }) => {
  // 临时变量，用于游戏运行时的状态管理
  const [tempVariables, setTempVariables] = useState<CustomVariable[]>([]);
  
  // 初始化临时变量，从全局变量复制结构和默认值
  useEffect(() => {
    // 从window对象获取全局变量
    const appVariables = window.appVariables || [];
    
    // 深拷贝变量结构和默认值
    setTempVariables(deepCopyVariables(appVariables));
  }, []);
  
  // 当前显示的节点ID
  const [currentNodeId, setCurrentNodeId] = useState<string>(() => {
    // 默认显示开始节点
    const startNode = nodes.find(node => node.type === 'start');
    return startNode ? startNode.id : '';
  });

  // 获取当前节点
  const currentNode = nodes.find(node => node.id === currentNodeId);
  
  // 获取当前节点类型
  const currentType: PreviewType = currentNode?.type as PreviewType || 'start';

  // 获取从当前节点出发的所有边
  const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);

  // 构建按钮信息
  const buttons: ButtonInfo[] = outgoingEdges.map(edge => {
    // 如果是按钮跳转类型(btnsto)，则使用btnname作为按钮标签，否则使用默认的'下一步'
    const buttonLabel = edge.data?.ntype === 'btnsto' ? edge.data?.btnname || '下一步' : '下一步';
    return {
      id: edge.id,
      label: buttonLabel,
      targetNodeId: edge.target
    };
  });

  // 解析文本中的变量引用的包装函数
  const parseVariablesWrapper = (text: string): string => {
    return parseVariables(text, tempVariables);
  };

  // 处理按钮点击事件
  const handleButtonClick = (targetNodeId: string, edgeId: string) => {
    console.log('handleButtonClick called with:', { targetNodeId, edgeId, currentNodeId: currentNode?.id, currentNodeType: currentNode?.type });
    
    // 查找对应的边，检查是否有变量更新操作
    const edge = edges.find(e => e.id === edgeId);
    console.log('Found edge:', edge);
    
    // 如果是条件跳转，先判断条件是否满足
    if (edge?.data?.ntype === 'condition') {
      const { conditionVariable, conditionType, conditionValue } = edge.data;
      const currentValue = parseVariables(conditionVariable, tempVariables);
      
      // 根据条件类型进行判断
      let conditionMet = false;
      switch (conditionType) {
        case '等于':
          conditionMet = currentValue == conditionValue;
          break;
        case '不等于':
          conditionMet = currentValue != conditionValue;
          break;
        case '大于':
          conditionMet = Number(currentValue) > Number(conditionValue);
          break;
        case '小于':
          conditionMet = Number(currentValue) < Number(conditionValue);
          break;
        case '大于等于':
          conditionMet = Number(currentValue) >= Number(conditionValue);
          break;
        case '小于等于':
          conditionMet = Number(currentValue) <= Number(conditionValue);
          break;
      }
      
      // 如果条件不满足，直接返回
      if (!conditionMet) {
        return;
      }
    }
    
    if (edge && edge.data?.updateVariables) {
      // 更新临时变量
      const updates = edge.data.updateVariables;
      setTempVariables(prevVars => {
        // 深拷贝当前临时变量
        const updatedVars = JSON.parse(JSON.stringify(prevVars));
        
        // 应用所有更新
        Object.entries(updates).forEach(([path, value]) => {
          const pathParts = path.split('.');
          updateVariable(updatedVars, pathParts, value, 0);
        });
        
        return updatedVars;
      });
    }
    
    // 获取目标节点
    const targetNode = nodes.find(node => node.id === targetNodeId);
    console.log('Target node:', targetNode);

    // 如果目标节点是容器节点，直接查找其内部的入口节点
    if (targetNode?.type === 'container') {
      const entryNode = nodes.find(node => 
        node.type === 'entry' && 
        node.data?.parentId === targetNode.id
      );
      
      if (entryNode) {
        // 如果找到入口节点，直接跳转到入口节点的下一个节点
        const entryOutgoingEdges = edges.filter(edge => edge.source === entryNode.id);
        if (entryOutgoingEdges.length > 0) {
          // 直接跳转到入口节点的下一个节点
          setCurrentNodeId(entryOutgoingEdges[0].target);
          return;
        }
      }
    }
    
    // 如果当前节点是入口节点，直接跳转到目标节点
    if (currentNode?.type === 'entry') {
      console.log('Current node is entry node, jumping to target:', targetNodeId);
      setCurrentNodeId(targetNodeId);
      return;
    }
    
    // 如果当前节点是出口节点，查找其父容器节点
    if (targetNode?.type === 'exit') {
      console.log('Current node is exit node:', targetNode);
      const containerNode = nodes.find(node => 
        node.type === 'container' && 
        node.id === targetNode.data?.parentId
      );
      console.log('Found container node:', containerNode);
      
      if (containerNode) {
        // 查找从容器节点出发的边，且边的sourceHandle包含当前出口节点的ID
        const containerOutgoingEdges = edges.filter(edge => 
          edge.source === containerNode.id && 
          edge.sourceHandle === `exit-${targetNode.id}`
        );
        console.log('Container outgoing edges:', containerOutgoingEdges);
        
        if (containerOutgoingEdges.length > 0) {
          // 如果跳转到的节点是个收纳节点，跳转到其内部的入口节点
          const exitNextNode = nodes.find(node => node.id === containerOutgoingEdges[0].target);
          if (exitNextNode?.type === 'container') {
            // 将当前节点设置为该收纳节点的入口节点
            const entryNode = nodes.find(node => 
                node.type === 'entry' && 
                node.data?.parentId === exitNextNode.id
              );
            // 找到该入口节点的下一个节点
            const entryOutgoingEdges = edges.filter(edge => edge.source === entryNode?.id);
            setCurrentNodeId(entryOutgoingEdges[0].target);
          } else {
            setCurrentNodeId(containerOutgoingEdges[0].target);
          }
          // 跳转到容器节点连接的下一个节点
          return;
        }
      }
      
      // 如果没有找到对应的边，直接跳转到目标节点
      console.log('Direct jump to target node:', targetNodeId);
      setCurrentNodeId(targetNodeId);
      return;
    }
    
    // 切换到目标节点
    console.log('Switching to target node:', targetNodeId);
    setCurrentNodeId(targetNodeId);
  };

  // 处理重新开始游戏
  const handleRestart = () => {
    const startNode = nodes.find(node => node.type === 'start');
    if (startNode) {
      setCurrentNodeId(startNode.id);
    }
  };

  return (
    <div className="preview-container" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '600px',
      height: '80%',
      maxHeight: '500px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      zIndex: 1000
    }}>
      <PreviewHeader 
        currentType={currentType} 
        onClose={onClose} 
      />

      <PreviewContent 
        currentNode={currentNode} 
        parseVariables={parseVariablesWrapper} 
      />

      <PreviewActions 
        currentType={currentType} 
        buttons={buttons} 
        onButtonClick={handleButtonClick} 
        onRestart={handleRestart} 
      />
    </div>
  );
};

export default PreviewComponent;