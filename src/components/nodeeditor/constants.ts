import { useLanguage } from '../../contexts/LanguageContext';

const NODE_TYPES = {
  START: 'start',
  PLOT: 'plot',
  END: 'end',
  CONTAINER: 'container',
  ENTRY: 'entry',
  EXIT: 'exit',
  CONDITION: 'condition' // 新增条件分歧节点类型
} as const;

// 获取当前语言的节点标签
const getNodeLabels = () => {
  // 这个函数会在组件中调用，返回当前语言的节点标签
  const { t } = useLanguage();
  
  return {
    [NODE_TYPES.START]: t.startNode,
    [NODE_TYPES.PLOT]: t.plotNode,
    [NODE_TYPES.END]: t.endNode,
    [NODE_TYPES.CONTAINER]: t.containerNode,
    [NODE_TYPES.ENTRY]: t.entryNode,
    [NODE_TYPES.EXIT]: t.exitNode,
    [NODE_TYPES.CONDITION]: t.conditionNode
  };
};

// 默认中文节点标签，用于非组件环境
const NODE_LABELS = {
  [NODE_TYPES.START]: '开始节点',
  [NODE_TYPES.PLOT]: '情节节点',
  [NODE_TYPES.END]: '结局节点',
  [NODE_TYPES.CONTAINER]: '收纳节点',
  [NODE_TYPES.ENTRY]: '入口节点',
  [NODE_TYPES.EXIT]: '出口节点',
  [NODE_TYPES.CONDITION]: '条件分歧节点'
};

export { NODE_TYPES, NODE_LABELS, getNodeLabels };