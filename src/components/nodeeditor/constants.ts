const NODE_TYPES = {
  START: 'start',
  PLOT: 'plot',
  END: 'end',
  CONTAINER: 'container',
  ENTRY: 'entry',
  EXIT: 'exit'
} as const;

const NODE_LABELS = {
  [NODE_TYPES.START]: '开始节点',
  [NODE_TYPES.PLOT]: '情节节点',
  [NODE_TYPES.END]: '结局节点',
  [NODE_TYPES.CONTAINER]: '收纳节点',
  [NODE_TYPES.ENTRY]: '入口节点',
  [NODE_TYPES.EXIT]: '出口节点'
};

export { NODE_TYPES, NODE_LABELS };