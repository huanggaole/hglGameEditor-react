import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../VariableEditor';
import { NODE_LABELS, NODE_TYPES } from './constants';
import { NodeEditorProps } from './types';
import ContainerNodeEditor from './nodes/ContainerNodeEditor';
import PlotNodeEditor from './nodes/PlotNodeEditor';
import StartNodeEditor from './nodes/StartNodeEditor';
import ConditionNodeEditor from './nodes/ConditionNodeEditor';
import DefaultNodeEditor from './nodes/DefaultNodeEditor';
import EditorContainer from './common/EditorContainer';

const NodeEditor = ({ node, onClose, updateNode }: NodeEditorProps) => {
  const [mname, setMname] = useState(node.data.mname || '');
  const [showInfo, setShowInfo] = useState(node.data.showInfo || '');
  const [note, setNote] = useState(node.data.note || '');
  const [transitionType, setTransitionType] = useState(node.data.transitionType || 'goto');
  const [buttons, setButtons] = useState<{title: string}[]>(node.data.buttons || []);
  const [conditions, setConditions] = useState<{variable: string, type: number, value: string, label: string}[]>(
    node.data.conditions || []
  );
  
  // 判断节点类型
  const isNoteNode = node.type === NODE_TYPES.CONTAINER || node.type === NODE_TYPES.EXIT;
  const isPlotNode = node.type === NODE_TYPES.PLOT;
  const isStartNode = node.type === NODE_TYPES.START;
  const isConditionNode = node.type === NODE_TYPES.CONDITION;

  // 根据节点类型渲染相应的编辑器组件
  const renderNodeEditor = () => {
    if (isNoteNode) {
      return (
        <ContainerNodeEditor
          node={node}
          mname={mname}
          setMname={setMname}
          note={note}
          setNote={setNote}
          onClose={onClose}
          updateNode={updateNode}
        />
      );
    } else if (isPlotNode) {
      return (
        <PlotNodeEditor
          node={node}
          mname={mname}
          setMname={setMname}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          transitionType={transitionType}
          setTransitionType={setTransitionType}
          buttons={buttons}
          setButtons={setButtons}
          onClose={onClose}
          updateNode={updateNode}
        />
      );
    } else if (isStartNode) {
      return (
        <StartNodeEditor
          node={node}
          mname={mname}
          setMname={setMname}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          transitionType={transitionType}
          setTransitionType={setTransitionType}
          buttons={buttons}
          setButtons={setButtons}
          onClose={onClose}
          updateNode={updateNode}
        />
      );
    } else if (isConditionNode) {
      return (
        <ConditionNodeEditor
          node={node}
          mname={mname}
          setMname={setMname}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          conditions={conditions}
          setConditions={setConditions}
          onClose={onClose}
          updateNode={updateNode}
        />
      );
    } else {
      // 默认情况下，使用DefaultNodeEditor组件
      return (
        <DefaultNodeEditor
          node={node}
          mname={mname}
          setMname={setMname}
          onClose={onClose}
          updateNode={updateNode}
        />
      );
    }
  };

  return (
    <EditorContainer>
      {renderNodeEditor()}
    </EditorContainer>
  );
};

export default NodeEditor;