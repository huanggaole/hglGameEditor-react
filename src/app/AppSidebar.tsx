import React from 'react';
import { Node } from 'reactflow';
import { PathNavigation } from '../components/NodeEdgeControls';

export const AppSidebar = ({
  nodes,
  setNodes,
  currentPath,
  goBack,
  enterContainer
}: {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  currentPath: string[];
  goBack: () => void;
  enterContainer: (nodeId: string) => void;
}) => {
  const NODE_TYPES = {
    START: 'start',
    PLOT: 'plot',
    END: 'end',
    CONTAINER: 'container'
  } as const;

  const NODE_LABELS = {
    [NODE_TYPES.START]: '开始节点',
    [NODE_TYPES.PLOT]: '情节节点',
    [NODE_TYPES.END]: '结局节点',
    [NODE_TYPES.CONTAINER]: '收纳节点'
  };

  const createNode = (type: string, position: {x: number, y: number}, existingNodes: Node[] = []) => {
    const id = `${existingNodes.length + 1}`;
    const label = NODE_LABELS[type as keyof typeof NODE_LABELS] || type;
    return {
      id,
      position,
      data: { 
        label,
        mname: `模块${id}`,
        showInfo: ''
      },
      type
    };
  };

  return (
    <div style={{ width: '200px', backgroundColor: '#e0e0e0', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <PathNavigation currentPath={currentPath} onBack={goBack} />
      
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.PLOT, { x: Math.random() * 500, y: Math.random() * 500 }, nodes);
          setNodes((nds) => nds.concat(newNode));
        }}
        style={{ border: '2px solid #888888', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.PLOT]}
      </button>
      
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.END, { x: Math.random() * 500, y: Math.random() * 500 }, nodes);
          setNodes((nds) => nds.concat(newNode));
        }}
        style={{ border: '2px solid #00cc00', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.END]}
      </button>
      
      <button 
        onClick={() => {
          const newNode = createNode(NODE_TYPES.CONTAINER, { x: Math.random() * 500, y: Math.random() * 500 }, nodes);
          setNodes((nds) => nds.concat({
            ...newNode,
            data: {
              ...newNode.data,
              onEnter: () => enterContainer(newNode.id)
            }
          }));
        }}
        style={{ border: '2px dashed #666666', borderRadius: '4px', padding: '8px' }}
      >
        {NODE_LABELS[NODE_TYPES.CONTAINER]}
      </button>
    </div>
  );
};