import { Observable } from 'rxjs';
import { DataSourceFactory } from './data.source.factory';
import { IDataSourceConfig } from '../../file/data.source.config';
import { DataSourceConfigSet } from '@shared/core/data/data.source.config.set';

/**
 * 每个页面都有自己的DataSourceManager
 * 如此便于在页面被销毁时，释放相应的数据源
 */
export class DataSourceManager {
  private _dataSourceMap: Map<string, Observable<any>> = new Map();

  constructor(private _dataOptionSet: DataSourceConfigSet) {

  }

  load(configArray: Array<IDataSourceConfig>) {

  }

  getDataSourceByID(id: string): Observable<any> {
    const dataSourceMap = this._dataSourceMap;
    if (dataSourceMap.has(id)) {
      return dataSourceMap.get(id);
    } else if (this._dataOptionSet.getDataSourceConfig(id)) {
      const dataSource = DataSourceFactory
        .getInstance()
        .getDataSource(this._dataOptionSet.getDataSourceConfig(id));
      dataSourceMap.set(id, dataSource);
      return dataSource;
    }
    return null;
  }

  clear() {

  }
}
