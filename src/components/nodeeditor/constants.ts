const NODE_TYPES = {
  START: 'start',
  PLOT: 'plot',
  END: 'end',
  CONTAINER: 'container',
  ENTRY: 'entry',
  EXIT: 'exit',
  CONDITION: 'condition' // 新增条件分歧节点类型
} as const;

const NODE_LABELS = {
  [NODE_TYPES.START]: '开始节点',
  [NODE_TYPES.PLOT]: '情节节点',
  [NODE_TYPES.END]: '结局节点',
  [NODE_TYPES.CONTAINER]: '收纳节点',
  [NODE_TYPES.ENTRY]: '入口节点',
  [NODE_TYPES.EXIT]: '出口节点',
  [NODE_TYPES.CONDITION]: '条件分歧节点' // 新增条件分歧节点标签
};

export { NODE_TYPES, NODE_LABELS };