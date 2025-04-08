import { Node } from 'reactflow';

export interface NodeData {
  mname?: string;
  label?: string;
  [key: string]: any;
}

export interface NodeEditorProps {
  node: Node;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}