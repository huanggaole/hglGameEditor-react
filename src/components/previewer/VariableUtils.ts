import { CustomVariable } from '../VariableEditor';

/**
 * 深拷贝变量结构和默认值
 */
export const deepCopyVariables = (variables: CustomVariable[]): CustomVariable[] => {
  return variables.map(variable => ({
    ...variable,
    children: variable.children ? deepCopyVariables(variable.children) : undefined
  }));
};

/**
 * 根据变量路径获取变量值
 */
export const getVariableValue = (path: string, tempVariables: CustomVariable[]): any => {
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

/**
 * 解析文本中的变量引用
 */
export const parseVariables = (text: string, tempVariables: CustomVariable[]): string => {
  if (!text) return '';
  
  // 替换条件表达式 {{变量名}?"true显示内容":"false显示内容"}
  let parsedText = text.replace(/{{([^}]+)}\?"([^"]*)"(?::"([^"]*)")?/g, (_match, varName, trueText, falseText = '') => {
    const value = getVariableValue(varName.trim(), tempVariables);
    // 对 trueText 和 falseText 中的变量进行递归解析
    const parsedTrueText = parseVariables(trueText, tempVariables);
    const parsedFalseText = parseVariables(falseText, tempVariables);
    return value ? parsedTrueText : parsedFalseText;
  });
  
  // 替换普通变量引用 {{变量名}}
  parsedText = parsedText.replace(/{{([^}]+)}}/g, (_match, varName) => {
    console.log('varName', varName);
    const value = getVariableValue(varName.trim(), tempVariables);
    console.log('value', value);
    // 确保返回变量的实际值而不是变量名
    // 如果变量值存在，则转换为字符串返回，否则保留原始匹配文本
    return value !== null && value !== undefined ? String(value) : _match;
  });
  
  return parsedText;
};

/**
 * 解析变量引用，用于变量更新中的公式和变量引用
 */
export const parseVariableReferences = (text: string, variables: CustomVariable[]): any => {
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

/**
 * 更新变量值
 */
export const updateVariable = (variables: CustomVariable[], path: string[], value: any, index: number): boolean => {
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
        const parsedValue = parseVariableReferences(value, variables);
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