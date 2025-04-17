import React from 'react';
import { Node } from 'reactflow';
import NodeBaseInfo from '../common/NodeBaseInfo';
import NoteEditor from '../common/NoteEditor';
import ActionButtons from '../common/ActionButtons';

interface ContainerNodeEditorProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const ContainerNodeEditor: React.FC<ContainerNodeEditorProps> = ({
  node,
  mname,
  setMname,
  note,
  setNote,
  onClose,
  updateNode
}) => {
  const handleSave = () => {
    updateNode(node.id, {
      ...node.data,
      mname,
      note
    });
    onClose();
  };

  return (
    <>
      <NodeBaseInfo node={node} mname={mname} setMname={setMname} />
      
      <NoteEditor note={note} setNote={setNote} />

      <ActionButtons onClose={onClose} onSave={handleSave} />
    </>
  );
};

export default ContainerNodeEditor;