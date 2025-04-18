import React from 'react';
import { Node } from 'reactflow';
import NodeBaseInfo from '../common/NodeBaseInfo';
import ActionButtons from '../common/ActionButtons';

interface DefaultNodeEditorProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const DefaultNodeEditor: React.FC<DefaultNodeEditorProps> = ({
  node,
  mname,
  setMname,
  onClose,
  updateNode
}) => {
  const handleSave = () => {
    updateNode(node.id, {
      ...node.data,
      mname
    });
    onClose();
  };

  return (
    <>
      <NodeBaseInfo node={node} mname={mname} setMname={setMname} />
      
      <ActionButtons onClose={onClose} onSave={handleSave} />
    </>
  );
};

export default DefaultNodeEditor;