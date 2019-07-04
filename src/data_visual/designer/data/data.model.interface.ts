import { IDataSourceDimension } from '@barca/shared';

/**
 * 用于数据模型选择面板的数据绑定
 */
export interface DataModel {
  id: string;
  displayName: string;
  state: { collapsedDimension: boolean, collapsedMeasure: boolean };
  dimensions?: Array<IDataSourceDimension>;
}

/**
 * Echart相关数据结构
 * dataset.source 第一行/列是否是 维度名 信息。
 * 可选值：
 * null/undefined：默认，自动探测。
 * true：第一行/列是维度名信息。
 * false：第一行/列直接开始是数据。
 */
export interface Dataset {
  id?: string;
  source?: any;
  dimensions?: Array<IDataSourceDimension>;
  sourceHeader?: null | undefined | boolean;
}
