import { array } from './test';
import { BaseStorage, DataSourceConfigSet } from '@data-studio/shared';


/**
 * 管理多个空间的DataSourceConfig
 * 相同空间的DataSourceConfig被存放在同一个DataSourceConfigSet中
 */
export class DataSourceConfigSetManager extends BaseStorage<DataSourceConfigSet> {
  private static _manager: DataSourceConfigSetManager;

  // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
  // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。

  static getInstance() {
    if (!this._manager) {
      this._manager = new DataSourceConfigSetManager();
    }
    return this._manager;
  }

  private constructor() {
    super();
  }
}

DataSourceConfigSetManager.getInstance().setItem('space1', new DataSourceConfigSet(array));

export const dataSourceConfigSetManager = DataSourceConfigSetManager.getInstance();


