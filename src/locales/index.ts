// 多语言配置文件

// 语言类型定义
export type LanguageType = 'zh' | 'en';

// 多语言文本接口
export interface LocaleTexts {
  // 变量编辑器
  variableTitle: string;
  addVariable: string;
  noVariablesPrompt: string;
  confirm: string;
  variableName: string;
  variableType: string;
  defaultValue: string;
  description: string;
  stringType: string;
  numberType: string;
  booleanType: string;
  objectType: string;
  booleanTrue: string;
  booleanFalse: string;
  collapseChildren: string;
  expandChildren: string;
  addChildVariable: string;
  variableNameError: string;
  note: string;
  condition: string;
  insertCondition: string;
  defaultBranchNote: string;
  directJump: string;
  noButtonSet: string;
  variableUpdate: string;
  inputVariableValue: string;
  currentVariableUpdates: string;
  conditionNodeTitle: string;
  
  // 预览器
  gameStartTitle: string;
  plotPageTitle: string;
  gameEndTitle: string;
  noContentDisplay: string;

  // 菜单栏
  newProject: string;
  saveProject: string;
  loadProject: string;
  previewGame: string;
  variableSettings: string;
  languageSelector: string;

  // 编辑器通用
  cancel: string;
  save: string;
  nodeId: string;
  moduleName: string;
  transitionMethod: string;
  directTransition: string;
  buttonSelection: string;
  editTransition: string;
  sourceNode: string;
  targetNode: string;
  variableUpdateSettings: string;
  
  // 节点类型标签
  startNode: string;
  plotNode: string;
  endNode: string;
  containerNode: string;
  entryNode: string;
  exitNode: string;
  conditionNode: string;
  
  // 节点默认名称
  defaultNodeName: string;
  startNodeName: string;
  entryNodeName: string;
  
  // 操作面板
  backButton: string;
  
  // 预览相关
  gameStart: string;
  restartGame: string;
  
  // 其他通用文本
  noVariables: string;
  
  // ShowInfoEditor组件
  showInfo: string;
  insertVariable: string;
  selectVariable: string;
  close: string;
  noAvailableVariables: string;
  
  // ButtonListEditor组件
  button: string;
  buttonList: string;
  buttonTitle: string;
  addButton: string;
  removeButton: string;
  
  // 节点和边的操作按钮
  edit: string;
  enter: string;
  copy: string;
  delete: string;

  // 条件节点编辑器
  conditionList: string;
  addNewCondition: string;
  editCondition: string;
  defaultBranchDesc: string;
  variableLabel: string;
  conditionType: string;
  conditionValue: string;
  selectVariableBtn: string;
  pleaseSelectVariable: string;
  defaultBranch: string;
  
  // 条件类型
  equals: string;
  notEquals: string;
  contains: string;
  greaterThan: string;
  lessThan: string;
  greaterThanOrEquals: string;
  lessThanOrEquals: string;
}

// 中文文本
export const zhCN: LocaleTexts = {
    // 变量编辑器
    variableTitle: '变量设置',
    addVariable: '添加变量',
    noVariablesPrompt: '暂无变量，请点击"添加变量"按钮创建',
    confirm: '确定',
    variableName: '变量名',
    variableType: '类型',
    defaultValue: '默认值',
    description: '描述',
    stringType: '字符串 (String)',
    numberType: '数字 (Number)',
    booleanType: '布尔值 (Boolean)',
    objectType: '对象 (Object)',
    booleanTrue: '是 (true)',
    booleanFalse: '否 (false)',
    collapseChildren: '收起子变量',
    expandChildren: '展开子变量',
    addChildVariable: '添加子变量',
    variableNameError: '变量名只能包含英文和数字',
    note: '备注',
    condition: '条件',
    insertCondition: '插入条件',
    defaultBranch: '默认分支',
    defaultBranchNote: '当不满足任何一个条件列表中的条件时，将执行默认分支。',
    directJump: '直接跳转',
    noButtonSet: '未设置按钮',

    // 预览器
    gameStartTitle: '游戏开始',
    plotPageTitle: '剧情页面',
    gameEndTitle: '游戏结局',
    noContentDisplay: '无内容显示',

    // 菜单栏
    newProject: '新建',
    saveProject: '存档',
    loadProject: '读取',
    previewGame: '预览游戏',
    variableSettings: '变量设置',
    languageSelector: '语言',

    // 编辑器通用
    cancel: '取消',
    save: '保存',
    nodeId: '节点编号',
    moduleName: '模块名称 (mname)',
    transitionMethod: '跳转方式',
    directTransition: '直接跳转',
    buttonSelection: '按钮选择',
    editTransition: '编辑跳转',
    sourceNode: '源节点',
    targetNode: '目标节点',
    variableUpdateSettings: '变量更新设置',

    // 节点类型标签
    startNode: '开始节点',
    plotNode: '情节节点',
    endNode: '结局节点',
    containerNode: '收纳节点',
    entryNode: '入口节点',
    exitNode: '出口节点',
    conditionNode: '条件分歧节点',

    // 节点默认名称
    defaultNodeName: '模块',
    startNodeName: '开始',
    entryNodeName: '入口',

    // 操作面板
    backButton: '↑',

    // 预览相关
    gameStart: '游戏开始',
    restartGame: '重新开始游戏',

    // 其他通用文本
    noVariables: '暂无变量，请先在"变量设置"中添加变量',

    // ShowInfoEditor组件
    showInfo: '显示信息',
    insertVariable: '插入变量',
    selectVariable: '选择变量',
    close: '关闭',
    noAvailableVariables: '没有可用变量',

    // ButtonListEditor组件
    button: '按钮',
    buttonList: '按钮列表',
    buttonTitle: '按钮标题',
    addButton: '添加按钮',
    removeButton: '删除',

    // 节点和边的操作按钮
    edit: '编辑',
    enter: '进入',
    copy: '复制',
    delete: '删除',

    // 条件节点编辑器
    conditionList: '条件列表',
    addNewCondition: '添加新条件',
    editCondition: '编辑条件',
    defaultBranchDesc: '当不满足任何一个条件列表中的条件时，将执行默认分支。',
    variableLabel: '变量',
    conditionType: '条件类型',
    conditionValue: '值',
    selectVariableBtn: '选择',
    pleaseSelectVariable: '请先选择变量',

    // 条件类型
    equals: '等于',
    notEquals: '不等于',
    contains: '包含',
    greaterThan: '大于',
    lessThan: '小于',
    greaterThanOrEquals: '大于等于',
    lessThanOrEquals: '小于等于',
    variableUpdate: '变量更新',
    inputVariableValue: '输入变量值',
    currentVariableUpdates: '当前变量更新',
    conditionNodeTitle: '条件分歧节点'
};

// 英文文本
export const enUS: LocaleTexts = {
    // 变量编辑器
    variableTitle: 'Variable Settings',
    addVariable: 'Add Variable',
    noVariablesPrompt: 'No variables, click "Add Variable" button to create',
    confirm: 'Confirm',
    note: 'Note',
    condition: 'Condition',
    insertCondition: 'Insert Condition',
    defaultBranch: 'Default Branch',
    defaultBranchNote: 'When none of the conditions in the list are met, the default branch will be executed.',
    directJump: 'Direct Jump',
    noButtonSet: 'No Button Set',

    // 预览器
    gameStartTitle: 'Game Start',
    plotPageTitle: 'Plot Page',
    gameEndTitle: 'Game End',
    noContentDisplay: 'No Content to Display',

    // 菜单栏
    newProject: 'New',
    saveProject: 'Save',
    loadProject: 'Load',
    previewGame: 'Preview Game',
    variableSettings: 'Variable Settings',
    languageSelector: 'Language',

    // 编辑器通用
    cancel: 'Cancel',
    save: 'Save',
    nodeId: 'Node ID',
    moduleName: 'Module Name',
    transitionMethod: 'Transition Method',
    directTransition: 'Direct Transition',
    buttonSelection: 'Button Selection',
    editTransition: 'Edit Transition',
    sourceNode: 'Source Node',
    targetNode: 'Target Node',
    variableUpdateSettings: 'Variable Update Settings',

    // 节点类型标签
    startNode: 'Start Node',
    plotNode: 'Plot Node',
    endNode: 'End Node',
    containerNode: 'Container Node',
    entryNode: 'Entry Node',
    exitNode: 'Exit Node',
    conditionNode: 'Condition Node',

    // 节点默认名称
    defaultNodeName: 'Module',
    startNodeName: 'Start',
    entryNodeName: 'Entry',

    // 操作面板
    backButton: '↑',

    // 预览相关
    gameStart: 'Game Start',
    restartGame: 'Restart Game',

    // 其他通用文本
    noVariables: 'No variables, please add variables in "Variable Settings" first',

    // ShowInfoEditor组件
    showInfo: 'Display Info',
    insertVariable: 'Insert Variable',
    selectVariable: 'Select Variable',
    close: 'Close',
    noAvailableVariables: 'No available variables',

    // ButtonListEditor组件
    button: 'Button',
    buttonList: 'Button List',
    buttonTitle: 'Button Title',
    addButton: 'Add Button',
    removeButton: 'Remove',

    // 节点和边的操作按钮
    edit: 'Edit',
    enter: 'Enter',
    copy: 'Copy',
    delete: 'Delete',
    variableName: 'variableName',
    variableType: 'variableType',
    defaultValue: 'defaultValue',
    description: 'description',
    stringType: 'String',
    numberType: 'Number',
    booleanType: 'Boolean',
    objectType: 'Object',
    booleanTrue: 'true',
    booleanFalse: 'false',
    collapseChildren: 'Collapse child variables',
    expandChildren: 'Expand child variables',
    addChildVariable: 'Add child variable',
    variableNameError: 'Variable name can only contain English letters and numbers',

    // 条件节点编辑器
    conditionList: 'Condition List',
    addNewCondition: 'Add New Condition',
    editCondition: 'Edit Condition',
    defaultBranchDesc: 'When none of the conditions in the list are met, the default branch will be executed.',
    variableLabel: 'Variable',
    conditionType: 'Condition Type',
    conditionValue: 'Value',
    selectVariableBtn: 'Select',
    pleaseSelectVariable: 'Please select a variable first',

    // 条件类型
    equals: 'Equals',
    notEquals: 'Not Equals',
    contains: 'Contains',
    greaterThan: 'Greater Than',
    lessThan: 'Less Than',
    greaterThanOrEquals: 'Greater Than or Equals',
    lessThanOrEquals: 'Less Than or Equals',
    variableUpdate: 'Variable Update',
    inputVariableValue: 'Input Variable Value',
    currentVariableUpdates: 'Current Variable Updates',
    conditionNodeTitle: 'Condition Node'
};

// 默认导出所有语言包
export default {
  zh: zhCN,
  en: enUS
};

