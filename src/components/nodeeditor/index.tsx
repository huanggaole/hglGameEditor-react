import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../VariableEditor';
import { NODE_LABELS, NODE_TYPES } from './constants';

interface NodeEditorProps {
  node: Node;
  onClose: () => void;
  updateNode: (nodeId: string, data: any) => void;
}

const NodeEditor = ({ node, onClose, updateNode }: NodeEditorProps) => {
  const [mname, setMname] = useState(node.data.mname || '');
  const [showInfo, setShowInfo] = useState(node.data.showInfo || '');
  const [note, setNote] = useState(node.data.note || '');
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [transitionType, setTransitionType] = useState(node.data.transitionType || 'goto'); // 默认为直接跳转
  const [buttons, setButtons] = useState<{title: string}[]>(node.data.buttons || []);
  
  // 判断是否为收纳节点或出口节点
  const isContainerNode = node.type === NODE_TYPES.CONTAINER || node.type === NODE_TYPES.EXIT;
  // 判断是否为情节节点
  const isPlotNode = node.type === NODE_TYPES.PLOT;
  // 判断是否为开始节点
  const isStartNode = node.type === NODE_TYPES.START;
  // 判断是否需要跳转方式设置（情节节点和开始节点都需要）
  const needsTransitionType = isPlotNode || isStartNode;

  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, [showVariableSelector]);

  const handleSave = () => {
    // 根据节点类型保存不同的数据
    if (isContainerNode) {
      updateNode(node.id, {
        ...node.data,
        mname,
        note
      });
    } else if (isPlotNode || isStartNode) {
      // 情节节点和开始节点保存跳转方式和按钮信息
      updateNode(node.id, {
        ...node.data,
        mname,
        showInfo,
        transitionType,
        buttons: transitionType === 'btnsto' ? buttons : []
      });
    } else {
      updateNode(node.id, {
        ...node.data,
        mname,
        showInfo
      });
    }
    onClose();
  };

  // 添加按钮
  const addButton = () => {
    setButtons([...buttons, { title: '' }]);
  };

  // 更新按钮标题
  const updateButtonTitle = (index: number, title: string) => {
    const newButtons = [...buttons];
    newButtons[index].title = title;
    setButtons(newButtons);
  };

  // 删除按钮
  const removeButton = (index: number) => {
    const newButtons = [...buttons];
    newButtons.splice(index, 1);
    setButtons(newButtons);
  };

  const addVariableReference = (variable: CustomVariable) => {
    if (variable.type === 'boolean') {
      setShowInfo(showInfo + `{{${variable.name}}?"true显示内容":"false显示内容"}`); 
    } else {
      setShowInfo(showInfo + `{{${variable.name}}}`); 
    }
    setShowVariableSelector(false);
  };
  
  const renderVariableOptions = (vars: CustomVariable[], path: string = '') => {
    return vars.map((variable) => {
      const currentPath = path ? `${path}.${variable.name}` : variable.name;
      
      if (variable.type === 'object' && variable.children && variable.children.length > 0) {
        return (
          <div key={currentPath} style={{ marginLeft: '15px' }}>
            <div style={{ fontWeight: 'bold' }}>{variable.name} (对象):</div>
            {renderVariableOptions(variable.children, currentPath)}
          </div>
        );
      } else {
        return (
          <div key={currentPath} style={{ 
            padding: '5px', 
            margin: '5px 0', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} onClick={() => addVariableReference({ ...variable, name: currentPath })}>
            <span>{currentPath} ({variable.type})</span>
            <button style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>选择</button>
          </div>
        );
      }
    });
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      padding: '20px', 
      zIndex: 1000, 
      minWidth: '300px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <h3>编辑 {NODE_LABELS[node.type as keyof typeof NODE_LABELS] || node.type} 节点</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>节点编号:</label>
        <input 
          type="text" 
          value={node.id} 
          disabled 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>模块名称 (mname):</label>
        <input 
          type="text" 
          value={mname} 
          onChange={(e) => setMname(e.target.value)} 
          style={{ width: '100%', padding: '5px' }} 
        />
      </div>

      {isContainerNode ? (
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>备注信息 (note):</label>
          <textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={{ width: '100%', padding: '5px', minHeight: '100px' }} 
          />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label>显示信息 (showInfo):</label>
              <button 
                onClick={() => setShowVariableSelector(!showVariableSelector)}
                style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                显示变量
              </button>
            </div>
            <textarea 
              value={showInfo} 
              onChange={(e) => setShowInfo(e.target.value)} 
              style={{ width: '100%', padding: '5px', minHeight: '100px' }} 
            />
            {showVariableSelector && (
              <div style={{
                marginTop: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: 'white'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择要显示的变量:</div>
                {variables.length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    暂无变量，请先在"变量设置"中添加变量
                  </div>
                ) : (
                  <div>{renderVariableOptions(variables)}</div>
                )}
              </div>
            )}
          </div>
          
          {needsTransitionType && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>跳转方式:</label>
              <select
                value={transitionType}
                onChange={(e) => setTransitionType(e.target.value)}
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              >
                <option value="goto">直接跳转</option>
                <option value="btnsto">按钮跳转</option>
              </select>
              
              {transitionType === 'btnsto' && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label>按钮设置:</label>
                    <button 
                      onClick={addButton}
                      style={{
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      添加按钮
                    </button>
                  </div>
                  
                  {buttons.length === 0 ? (
                    <div style={{ color: '#666', fontStyle: 'italic', marginTop: '5px' }}>
                      请添加至少一个按钮
                    </div>
                  ) : (
                    <div>
                      {buttons.map((button, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '5px',
                          backgroundColor: '#f5f5f5',
                          padding: '5px',
                          borderRadius: '4px'
                        }}>
                          <input
                            type="text"
                            value={button.title}
                            onChange={(e) => updateButtonTitle(index, e.target.value)}
                            placeholder="按钮标题"
                            style={{ flex: 1, marginRight: '5px', padding: '5px' }}
                          />
                          <button
                            onClick={() => removeButton(index)}
                            style={{
                              backgroundColor: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={onClose}>取消</button>
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  );
};

export default NodeEditor;