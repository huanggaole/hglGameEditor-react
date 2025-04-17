import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../../VariableEditor';
import NodeBaseInfo from '../common/NodeBaseInfo';
import ShowInfoEditor from '../common/ShowInfoEditor';
import ActionButtons from '../common/ActionButtons';
import TransitionTypeSelector from '../common/TransitionTypeSelector';
import ButtonListEditor from '../common/ButtonListEditor';

interface StartNodeEditorProps {
  node: Node;
  mname: string;
  setMname: (value: string) => void;
  showInfo: string;
  setShowInfo: (value: string) => void;
  transitionType: string;
  setTransitionType: (value: string) => void;
  buttons: {title: string}[];
  setButtons: (buttons: {title: string}[]) => void;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const StartNodeEditor: React.FC<StartNodeEditorProps> = ({
  node,
  mname,
  setMname,
  showInfo,
  setShowInfo,
  transitionType,
  setTransitionType,
  buttons,
  setButtons,
  onClose,
  updateNode
}) => {
  const [variables, setVariables] = useState<CustomVariable[]>([]);

  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, []);

  const handleSave = () => {
    updateNode(node.id, {
      ...node.data,
      mname,
      showInfo,
      transitionType,
      buttons: transitionType === 'btnsto' ? buttons : []
    });
    onClose();
  };

  // 使用通用组件，不再需要这些方法

  return (
    <>
      <NodeBaseInfo node={node} mname={mname} setMname={setMname} />
      
      <ShowInfoEditor 
        showInfo={showInfo} 
        setShowInfo={setShowInfo} 
        variables={variables} 
      />
      
      <TransitionTypeSelector 
        transitionType={transitionType}
        setTransitionType={setTransitionType}
      />

      {transitionType === 'btnsto' && (
        <ButtonListEditor 
          buttons={buttons}
          setButtons={setButtons}
        />
      )}

      <ActionButtons onClose={onClose} onSave={handleSave} />
    </>
  );
};

export default StartNodeEditor;