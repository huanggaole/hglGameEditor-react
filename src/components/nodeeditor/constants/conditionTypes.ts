// 条件类型枚举
export enum ConditionType {
  EQUALS = 0,
  NOT_EQUALS = 1,
  CONTAINS = 2,
  GREATER_THAN = 3,
  LESS_THAN = 4,
  GREATER_THAN_OR_EQUALS = 5,
  LESS_THAN_OR_EQUALS = 6
}

// 条件类型映射到翻译键
export const conditionTypeToTransKey: Record<ConditionType, string> = {
  [ConditionType.EQUALS]: 'equals',
  [ConditionType.NOT_EQUALS]: 'notEquals',
  [ConditionType.CONTAINS]: 'contains',
  [ConditionType.GREATER_THAN]: 'greaterThan',
  [ConditionType.LESS_THAN]: 'lessThan',
  [ConditionType.GREATER_THAN_OR_EQUALS]: 'greaterThanOrEquals',
  [ConditionType.LESS_THAN_OR_EQUALS]: 'lessThanOrEquals'
};

// 变量类型对应的可用条件类型
export const variableTypeToConditionTypes: Record<string, ConditionType[]> = {
  'string': [ConditionType.EQUALS, ConditionType.NOT_EQUALS, ConditionType.CONTAINS],
  'number': [
    ConditionType.EQUALS,
    ConditionType.NOT_EQUALS,
    ConditionType.GREATER_THAN,
    ConditionType.LESS_THAN,
    ConditionType.GREATER_THAN_OR_EQUALS,
    ConditionType.LESS_THAN_OR_EQUALS
  ],
  'boolean': [ConditionType.EQUALS, ConditionType.NOT_EQUALS],
  'object': [ConditionType.EQUALS]
};