import React, { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { CustomVariable } from './VariableEditor';

// 为window对象添加appVariables属性的类型声明
declare global {
  interface Window {
    appVariables?: CustomVariable[];
  }
}

// 定义预览界面类型
type PreviewType = 'start' | 'plot' | 'end';

// 定义按钮类型，用于表示跳转按钮
interface ButtonInfo {
  id: string;
  label: string;
  targetNodeId: string;
}

interface PreviewComponentProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ nodes, edges, onClose }) => {
  // 临时变量，用于游戏运行时的状态管理
  const [tempVariables, setTempVariables] = useState<CustomVariable[]>([]);
  
  // 初始化临时变量，从全局变量复制结构和默认值
  useEffect(() => {
    // 从window对象获取全局变量
    const appVariables = window.appVariables || [];
    
    // 深拷贝变量结构和默认值
    const deepCopyVariables = (variables: CustomVariable[]): CustomVariable[] => {
      return variables.map(variable => ({
        ...variable,
        children: variable.children ? deepCopyVariables(variable.children) : undefined
      }));
    };
    
    setTempVariables(deepCopyVariables(appVariables));
  }, []);
  
  // 根据变量路径获取变量值
  const getVariableValue = (path: string): any => {
    const parts = path.split('.');
    let result: any = null;
    
    // 在临时变量中查找变量
    const findVariable = (variables: CustomVariable[], pathParts: string[], index: number): any => {
      if (index >= pathParts.length) return null;
      
      const currentPart = pathParts[index];
      const variable = variables.find(v => v.name === currentPart);
      
      if (!variable) return null;
      
      if (index === pathParts.length - 1) {
        // 找到最终变量，返回其默认值
        return variable.defaultValue;
      }
      
      // 如果是对象类型且有子变量，继续查找
      if (variable.type === 'object' && variable.children) {
        return findVariable(variable.children, pathParts, index + 1);
      }
      
      return null;
    };
    
    result = findVariable(tempVariables, parts, 0);
    return result;
  };
  
  // 解析文本中的变量引用
  const parseVariables = (text: string): string => {
    if (!text) return '';
    
    // 替换条件表达式 {{变量名}?"true显示内容":"false显示内容"}
    let parsedText = text.replace(/{{([^}]+)}\?"([^"]*)"(?::"([^"]*)"})?/g, (match, varName, trueText, falseText = '') => {
      const value = getVariableValue(varName.trim());
      // 对 trueText 和 falseText 中的变量进行递归解析
      const parsedTrueText = parseVariables(trueText);
      const parsedFalseText = parseVariables(falseText);
      return value ? parsedTrueText : parsedFalseText;
    });
    
    // 替换普通变量引用 {{变量名}}
    parsedText = parsedText.replace(/{{([^}]+)}}/g, (match, varName) => {
      const value = getVariableValue(varName.trim());
      return value !== null && value !== undefined ? String(value) : match;
    });
    
    return parsedText;
  };
  
  // 解析变量引用，用于变量更新中的公式和变量引用
  const parseVariableReferences = (text: string, variables: CustomVariable[]): any => {
    if (!text) return text;
    
    // 查找变量的值，类似于getVariableValue但使用提供的变量数组
    const findVariableValue = (path: string, vars: CustomVariable[]): any => {
      const parts = path.split('.');
      
      const findVariable = (variables: CustomVariable[], pathParts: string[], index: number): any => {
        if (index >= pathParts.length) return null;
        
        const currentPart = pathParts[index];
        const variable = variables.find(v => v.name === currentPart);
        
        if (!variable) return null;
        
        if (index === pathParts.length - 1) {
          return variable.defaultValue;
        }
        
        if (variable.type === 'object' && variable.children) {
          return findVariable(variable.children, pathParts, index + 1);
        }
        
        return null;
      };
      
      return findVariable(vars, parts, 0);
    };
    
    // 替换所有变量引用 {{变量名}}
    let result = text;
    const regex = /{{([^}]+)}}/g;
    let match;
    
    // 收集所有变量引用
    const references: {[key: string]: any} = {};
    while ((match = regex.exec(text)) !== null) {
      const varPath = match[1].trim();
      references[varPath] = findVariableValue(varPath, variables);
    }
    
    // 替换变量引用
    for (const [path, value] of Object.entries(references)) {
      const pattern = new RegExp(`{{${path}}}`, 'g');
      result = result.replace(pattern, value !== null && value !== undefined ? String(value) : `{{${path}}}`);
    }
    
    // 如果结果中不再包含变量引用，且是数学表达式，尝试计算
    if (!result.includes('{{') && /^[\d\s\+\-\*\/\(\)\%\.]+$/.test(result)) {
      try {
        // 尝试计算公式
        // eslint-disable-next-line no-eval
        return eval(result);
      } catch (e) {
        // 如果计算失败，返回原始字符串
        return result;
      }
    }
    
    return result;
  };
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
    const targetNode = nodes.find(node => node.id === edge.target);
    // 如果是按钮跳转类型(btnsto)，则使用btnname作为按钮标签，否则使用默认的'下一步'
    const buttonLabel = edge.data?.ntype === 'btnsto' ? edge.data?.btnname || '下一步' : '下一步';
    return {
      id: edge.id,
      label: buttonLabel,
      targetNodeId: edge.target
    };
  });

  // 处理按钮点击事件
  const handleButtonClick = (targetNodeId: string, edgeId: string) => {
    // 查找对应的边，检查是否有变量更新操作
    const edge = edges.find(e => e.id === edgeId);
    
    // 如果是条件跳转，先判断条件是否满足
    if (edge?.data?.ntype === 'condition') {
      const { conditionVariable, conditionType, conditionValue } = edge.data;
      const currentValue = getVariableValue(conditionVariable);
      
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
        
        // 应用更新
        const updateVariable = (variables: CustomVariable[], path: string[], value: any, index: number) => {
          if (index >= path.length) return false;
          
          const currentPart = path[index];
          const varIndex = variables.findIndex(v => v.name === currentPart);
          
          if (varIndex === -1) return false;
          
          if (index === path.length - 1) {
            // 找到目标变量，更新其值
            // 检查值是否为字符串，并且包含变量引用或公式
            if (typeof value === 'string') {
              // 如果值包含变量引用 {{变量名}}
              if (value.includes('{{') && value.includes('}}')) {
                // 解析变量引用
                const parsedValue = parseVariableReferences(value, updatedVars);
                variables[varIndex].defaultValue = parsedValue;
              } 
              // 如果值是简单的数学公式（不包含变量引用）
              else if (/^[\d\s\+\-\*\/\(\)\%\.]+$/.test(value)) {
                try {
                  // 尝试计算公式
                  // eslint-disable-next-line no-eval
                  const result = eval(value);
                  variables[varIndex].defaultValue = result;
                } catch (e) {
                  // 如果计算失败，保留原始字符串
                  variables[varIndex].defaultValue = value;
                }
              } else {
                // 如果不是公式或变量引用，直接赋值
                variables[varIndex].defaultValue = value;
              }
            } else {
              // 非字符串值直接赋值
              variables[varIndex].defaultValue = value;
            }
            return true;
          }
          
          // 如果是对象类型且有子变量，继续查找
          if (variables[varIndex].type === 'object' && variables[varIndex].children) {
            return updateVariable(variables[varIndex].children!, path, value, index + 1);
          }
          
          return false;
        };
        
        // 应用所有更新
        Object.entries(updates).forEach(([path, value]) => {
          const pathParts = path.split('.');
          updateVariable(updatedVars, pathParts, value, 0);
        });
        
        return updatedVars;
      });
    }
    
    // 切换到目标节点
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
      <div className="preview-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>
          {currentType === 'start' ? '游戏开始' : 
           currentType === 'plot' ? '剧情页面' : 
           '游戏结局'}
        </h2>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          关闭
        </button>
      </div>

      <div className="preview-content" style={{
        flex: 1,
        overflow: 'auto',
        border: '1px solid #eee',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9',
        whiteSpace: 'pre-wrap' // 添加此样式以保留换行符
      }}>
        {parseVariables(currentNode?.data?.showInfo || '无内容显示')}
      </div>

      <div className="preview-actions" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {currentType === 'end' ? (
          <button 
            onClick={handleRestart}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            重新开始游戏
          </button>
        ) : (
          buttons.map(button => (
            <button 
              key={button.id}
              onClick={() => handleButtonClick(button.targetNodeId, button.id)}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {button.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviewComponent;