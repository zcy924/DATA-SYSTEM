import { Observable } from 'rxjs';
import { DataSourceConfigSet } from '@core/data/data.source.config.set';
import { DataSourceFactory } from '@core/data/data.source.factory';
import { IDataSourceConfig } from '../../interface/file/data.source.config';

/**
 * 每个页面都有自己的DataSourceManager
 * 如此便于在页面被销毁时，销毁相应的数据源
 */
export class DataSourceManager {
  private _dataSourceMap: Map<string, Observable<any>> = new Map();

  constructor(private _dataOptionSet: DataSourceConfigSet) {

  }

  load(configArray: Array<IDataSourceConfig>) {

  }

  clear() {

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
}
