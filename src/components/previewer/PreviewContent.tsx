import React from 'react';
import { PreviewContentProps } from './types';
import { useLanguage } from '../../contexts/LanguageContext';

const PreviewContent: React.FC<PreviewContentProps> = ({ currentNode, parseVariables }) => {
  // 判断是否为条件分歧节点
  const isConditionNode = currentNode?.type === 'condition';
  // 获取条件列表
  const conditions = isConditionNode ? (currentNode?.data?.conditions || []) : [];
  const { t } = useLanguage();
  return (
    <div className="preview-content" style={{
      flex: 1,
      overflow: 'auto',
      border: '1px solid #eee',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
      whiteSpace: 'pre-wrap', // 保留换行符
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* 显示节点内容 */}
      {currentNode?.type !== 'container' && (
        <div>
          {parseVariables(currentNode?.data?.showInfo || t.noContentDisplay)}
        </div>
      )}
      
      {/* 如果是条件分歧节点，显示条件列表 */}
      {isConditionNode && conditions.length > 0 && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>条件判断:</div>
          {conditions.map((condition: any, index: number) => {
            // 获取变量当前值
            const variableValue = parseVariables(condition.variable);
            // 判断条件是否满足
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
            console.log(conditionMet);
            return (
              <div key={index} style={{ 
                marginLeft: '10px', 
                padding: '5px',
                backgroundColor: conditionMet ? '#e6f7e6' : '#f7e6e6',
                borderRadius: '4px',
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{index + 1}. </span>
                  <span>{condition.variable} ({variableValue}) {condition.type} {condition.value}</span>
                </div>
                <div style={{ 
                  color: conditionMet ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {conditionMet ? '✓' : '✗'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreviewContent;