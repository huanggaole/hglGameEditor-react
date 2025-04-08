const NODE_TYPES = {
  START: 'start',
  PLOT: 'plot',
  END: 'end'
} as const;

const NODE_LABELS = {
  [NODE_TYPES.START]: '开始节点',
  [NODE_TYPES.PLOT]: '情节节点',
  [NODE_TYPES.END]: '结局节点'
};

export { NODE_TYPES, NODE_LABELS };