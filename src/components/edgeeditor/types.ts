import { Edge } from 'reactflow';
import { CustomVariable } from '../VariableEditor';

// 为window对象添加appVariables属性的类型声明
declare global {
  interface Window {
    appVariables?: CustomVariable[];
  }
}

// 定义节点数据类型接口
export interface NodeData {
  mname?: string;
  label?: string;
  [key: string]: any;
}

// EdgeEditor组件的Props接口
export interface EdgeEditorProps {
  edge: Edge;
  onClose: () => void;
  updateEdge: (edgeId: string, data: any) => void;
}

// 变量更新相关接口
export interface VariableUpdate {
  [key: string]: any;
}