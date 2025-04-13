import { Node, Edge } from 'reactflow';
import { CustomVariable } from '../VariableEditor';

// 为window对象添加appVariables属性的类型声明
declare global {
  interface Window {
    appVariables?: CustomVariable[];
  }
}

// 定义预览界面类型
export type PreviewType = 'start' | 'plot' | 'end';

// 定义按钮类型，用于表示跳转按钮
export interface ButtonInfo {
  id: string;
  label: string;
  targetNodeId: string;
}

// 预览组件的Props接口
export interface PreviewComponentProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

// 预览头部组件的Props接口
export interface PreviewHeaderProps {
  currentType: PreviewType;
  onClose: () => void;
}

// 预览内容组件的Props接口
export interface PreviewContentProps {
  currentNode: Node | undefined;
  parseVariables: (text: string) => string;
}

// 预览操作按钮组件的Props接口
export interface PreviewActionsProps {
  currentType: PreviewType;
  buttons: ButtonInfo[];
  onButtonClick: (targetNodeId: string, edgeId: string) => void;
  onRestart: () => void;
}