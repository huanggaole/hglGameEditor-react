import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { CustomVariable } from '../VariableEditor';
import { NODE_LABELS, NODE_TYPES } from './constants';
import VariableSelector from './VariableSelector';

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
  const [showConditionVariableSelector, setShowConditionVariableSelector] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [transitionType, setTransitionType] = useState(node.data.transitionType || 'goto'); // 默认为直接跳转
  const [buttons, setButtons] = useState<{title: string}[]>(node.data.buttons || []);
  // 条件分歧节点的条件列表
  const [conditions, setConditions] = useState<{variable: string, type: string, value: string, label: string}[]>(node.data.conditions || []);
  // 新增条件的临时状态
  const [newCondition, setNewCondition] = useState<{variable: string, type: string, value: string, label: string}>({variable: '', type: '等于', value: '', label: ''});
  
  // 判断是否为收纳节点或出口节点
  const isContainerNode = node.type === NODE_TYPES.CONTAINER || node.type === NODE_TYPES.EXIT;
  // 判断是否为情节节点
  const isPlotNode = node.type === NODE_TYPES.PLOT;
  // 判断是否为开始节点
  const isStartNode = node.type === NODE_TYPES.START;
  // 判断是否为条件分歧节点
  const isConditionNode = node.type === NODE_TYPES.CONDITION;
  // 判断是否需要跳转方式设置（情节节点和开始节点都需要）
  const needsTransitionType = isPlotNode || isStartNode;

  useEffect(() => {
    const appVariables = window.appVariables || [];
    setVariables(appVariables);
  }, [showVariableSelector, showConditionVariableSelector]);

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
    } else if (isConditionNode) {
      // 条件分歧节点保存条件列表
      updateNode(node.id, {
        ...node.data,
        mname,
        showInfo,
        conditions
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
      setShowInfo(showInfo + `{{${variable.name}}?"true显示内容":"false显示内容"}}`);
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
      ) : isConditionNode ? (
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

          {/* 条件分歧节点的条件设置 */}
          <div style={{ marginBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>条件设置:</label>
              <button 
                onClick={() => {
                  if (newCondition.variable && newCondition.value) {
                    setConditions([...conditions, {
                      ...newCondition,
                      label: `${newCondition.variable} ${newCondition.type} ${newCondition.value}`
                    }]);
                    setNewCondition({variable: '', type: '等于', value: '', label: ''});
                  }
                }}
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
                添加条件
              </button>
            </div>

            {/* 新增条件表单 */}
            <div style={{ marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label>条件变量:</label>
                  <button 
                    onClick={() => setShowConditionVariableSelector(!showConditionVariableSelector)}
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
                    选择变量
                  </button>
                </div>
                <input 
                  type="text" 
                  value={newCondition.variable} 
                  onChange={(e) => setNewCondition({...newCondition, variable: e.target.value})} 
                  placeholder="变量名称"
                  style={{ width: '100%', padding: '5px' }} 
                />
                {showConditionVariableSelector && (
                  <div style={{
                    marginTop: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>选择条件变量:</div>
                    {variables.length === 0 ? (
                      <div style={{ color: '#666', fontStyle: 'italic' }}>
                        暂无变量，请先在"变量设置"中添加变量
                      </div>
                    ) : (
                      <div>
                        <VariableSelector
                          variables={variables}
                          onSelect={(variable, path) => {
                            setNewCondition({...newCondition, variable: path});
                            setShowConditionVariableSelector(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>条件类型:</label>
                <select
                  value={newCondition.type}
                  onChange={(e) => setNewCondition({...newCondition, type: e.target.value})}
                  style={{ width: '100%', padding: '5px' }}
                >
                  <option value="等于">等于</option>
                  <option value="不等于">不等于</option>
                  <option value="大于">大于</option>
                  <option value="小于">小于</option>
                  <option value="大于等于">大于等于</option>
                  <option value="小于等于">小于等于</option>
                  <option value="包含">包含</option>
                  <option value="不包含">不包含</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>条件值:</label>
                <input 
                  type="text" 
                  value={newCondition.value} 
                  onChange={(e) => setNewCondition({...newCondition, value: e.target.value})} 
                  placeholder="条件值"
                  style={{ width: '100%', padding: '5px' }} 
                />
              </div>
            </div>

            {/* 已添加的条件列表 */}
            {conditions.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic', marginTop: '5px' }}>
                请添加至少一个条件
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>已添加的条件:</div>
                {conditions.map((condition, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '5px',
                    backgroundColor: '#f5f5f5',
                    padding: '5px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ flex: 1 }}>{condition.label || `${condition.variable} ${condition.type} ${condition.value}`}</span>
                    <button
                      onClick={() => {
                        const newConditions = [...conditions];
                        newConditions.splice(index, 1);
                        setConditions(newConditions);
                      }}
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
            <div style={{ marginTop: '10px', color: '#666', fontSize: '12px' }}>
              注意: 条件将按顺序检查，第一个满足的条件将被执行。请确保为每个条件添加相应的连接线。
            </div>
          </div>
        </>
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