import { DataSourceConfigSet } from '@core/data/data.source.config.set';
import { array } from '@core/data/test';

/**
 * 管理多个空间的DataSourceConfig
 * 相同空间的DataSourceConfig被存放在同一个DataSourceConfigSet中
 */
export class DataSourceConfigManager {
  private static _dataSourceConfigManager: DataSourceConfigManager;

  private _map: Map<string, DataSourceConfigSet> = new Map();

  // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
  // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。

  static getInstance() {
    if (!this._dataSourceConfigManager) {
      this._dataSourceConfigManager = new DataSourceConfigManager();
    }
    return this._dataSourceConfigManager;
  }

  private constructor() {
  }

  addDataSourceConfigSet(id: string, dataSourceConfigSet: DataSourceConfigSet) {
    this._map.set(id, dataSourceConfigSet);
  }

  removeDataSourceConfigSet(id: string) {
    this._map.delete(id);
  }

  getDataSourceConfigSet(id: string) {
    if (this._map.has(id)) {
      return this._map.get(id);
    }
  }

  clear() {
    if (this._map) {
      this._map.clear();
    }
  }
}

DataSourceConfigManager.getInstance().addDataSourceConfigSet('space1', new DataSourceConfigSet(array));

export const dataOptionManager = DataSourceConfigManager.getInstance();


