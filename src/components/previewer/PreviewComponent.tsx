import React, { useState, useEffect } from 'react';
// 删除未使用的导入
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
  const buttons: ButtonInfo[] = [];
  
  // 如果当前节点是条件分歧节点，自动根据条件判断下一步
  if (currentNode?.type === 'condition') {
    // 条件分歧节点不显示按钮，将在componentDidMount中自动处理
    // 这里不添加任何按钮
  } 
  // 根据节点的跳转方式和按钮信息构建按钮
  else if (currentNode?.data?.transitionType === 'btnsto' && currentNode?.data?.buttons && currentNode.data.buttons.length > 0) {
    // 如果节点是按钮跳转类型，使用节点中存储的按钮信息
    currentNode.data.buttons.forEach((button: any, index: number) => {
      // 查找对应的边
      const edge = outgoingEdges.find(e => e.sourceHandle === `button-${index}`);
      if (edge) {
        buttons.push({
          id: edge.id,
          label: button.title || `按钮${index+1}`,
          targetNodeId: edge.target
        });
      }
    });
  } else {
    // 如果是直接跳转或其他类型，为每个出边创建一个默认按钮
    outgoingEdges.forEach(edge => {
      buttons.push({
        id: edge.id,
        label: '下一步',
        targetNodeId: edge.target
      });
    });
  }

  // 解析文本中的变量引用的包装函数
  const parseVariablesWrapper = (text: string): string => {
    return parseVariables(text, tempVariables);
  };

  // 自动处理条件分歧节点
  // 自动处理条件分歧节点
  useEffect(() => {
    // 如果当前节点是条件分歧节点，自动处理条件判断和跳转
    if (currentNode?.type === 'condition') {
      console.log('Processing condition node:', currentNode);
      
      // 获取条件列表
      const conditions = currentNode.data.conditions || [];
      
      // 获取从条件节点出发的所有边
      const conditionEdges = edges.filter(edge => edge.source === currentNode.id);
      
      // 默认边 - 当所有条件都不满足时使用
      const defaultEdge = conditionEdges.find(edge => edge.sourceHandle === 'default');
      
      // 检查每个条件，找到第一个满足的条件
      let matchedEdge = null;
      let matchedCondition = null;
      
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const edge = conditionEdges.find(edge => edge.sourceHandle === `condition-${i}`);
        
        if (edge && condition.variable && condition.type && condition.value !== undefined) {
          // 获取变量当前值
          const variableValue = parseVariables(condition.variable, tempVariables);
          console.log(`检查条件: ${condition.variable} (${variableValue}) ${condition.type} ${condition.value}`);
          console.log(variableValue, condition.value);
          // 根据条件类型进行判断
          let conditionMet = false;
          switch (condition.type) {
            case '等于':
              conditionMet = variableValue == condition.value;
              break;
            case '不等于':
              conditionMet = variableValue != condition.value;
              break;
            case '大于':
              conditionMet = Number(variableValue) > Number(condition.value);
              break;
            case '小于':
              conditionMet = Number(variableValue) < Number(condition.value);
              break;
            case '大于等于':
              conditionMet = Number(variableValue) >= Number(condition.value);
              break;
            case '小于等于':
              conditionMet = Number(variableValue) <= Number(condition.value);
              break;
            case '包含':
              conditionMet = String(variableValue).includes(String(condition.value));
              break;
            case '不包含':
              conditionMet = !String(variableValue).includes(String(condition.value));
              break;
          }
          
          if (conditionMet) {
            matchedEdge = edge;
            matchedCondition = condition;
            console.log(`条件满足: ${condition.label || `条件${i+1}`}`);
            break;
          }
        }
      }
      
      // 如果找到匹配的条件边，使用它；否则使用默认边
      // 这里确保在没有任何条件满足时，使用默认分支
      const edgeToUse = matchedEdge || defaultEdge;
      
      if (edgeToUse) {
        // 明确标识是通过哪个分支跳转的
        const branchType = matchedCondition ? 
          (matchedCondition.label || `条件${conditions.indexOf(matchedCondition)+1}`) : 
          '默认分支';
        console.log(`跳转到: ${edgeToUse.target}，通过: ${branchType}，边ID: ${edgeToUse.id}`);
        
        // 使用setTimeout避免无限循环渲染
        setTimeout(() => {
          // 传递正确的边ID，确保在使用默认分支时也能执行边上的变量操作
          handleButtonClick(edgeToUse.target, edgeToUse.id);
        }, 100);
      } else {
        console.log('没有找到匹配的条件边或默认边，无法跳转');
      }
    }
  }, [currentNodeId, edges, nodes, tempVariables]);
  
  // 处理按钮点击事件
  const handleButtonClick = (targetNodeId: string, edgeId: string) => {
    console.log('handleButtonClick called with:', { targetNodeId, edgeId, currentNodeId: currentNode?.id, currentNodeType: currentNode?.type });
    
    // 查找对应的边，检查是否有变量更新操作
    const edge = edges.find(e => e.id === edgeId);
    console.log('Found edge:', edge);
    
    // 条件跳转功能已完全移除，仅保留变量更新逻辑
    
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

  // 如果当前节点是条件分歧节点，不渲染UI，直接返回null
  // 条件分歧节点的处理逻辑已经在useEffect中实现
  if (currentType === 'condition') {
    return null;
  }
  
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