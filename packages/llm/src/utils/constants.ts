/**
 * 模型类型常量
 */
export enum ModelType {
  MAIN = 'mainModel',
  // VISION = 'visionModel',
  INTENTION_INFERENCE = 'intentionInferenceModel',
}

/**
 * 模型类型标签映射
 */
export const MODEL_TYPE_LABELS = {
  [ModelType.MAIN]: '主模型',
  // [ModelType.VISION]: '视觉识别模型',
  [ModelType.INTENTION_INFERENCE]: '意图推理模型',
};

/**
 * 模型类型图标映射
 */
export const MODEL_TYPE_ICONS = {
  [ModelType.MAIN]: 'EditOutlined',
  // [ModelType.VISION]: 'EyeOutlined',
  [ModelType.INTENTION_INFERENCE]: 'RobotOutlined',
};
