import { Observable } from 'rxjs';
import { DataSourceFactory } from './data.source.factory';
import { IDataSourceConfig } from '../../file/data.source.config';
import { DataSourceConfigSet } from '@shared/core/data/data.source.config.set';
import * as _ from 'lodash';

/**
 * 每个页面都有自己的DataSourceManager
 * 如此便于在页面被销毁时，释放相应的数据源
 *
 * 1、是否可以切换DataSourceConfigSet
 */
export class DataSourceManager {
  private _dataSourceMap: Map<string, Observable<any>> = new Map();
  private _dataSourceFactory = DataSourceFactory.getInstance();

  constructor(private _dataSourceConfigSet: DataSourceConfigSet) {

  }

  load(configArray: Array<IDataSourceConfig>) {

  }

  getDependencies(arrayOfID: Array<string>): Array<string> {
    let ret;
    ret = arrayOfID.map(id => {
      return this._dataSourceConfigSet.has(id) ? this._dataSourceConfigSet.getDataSourceConfig(id).repositoryKey : null;
    });
    return _.uniq(_.compact(ret));
  }

  getDataSourceByID(id: string): Observable<any> {
    console.log('获取数据源：');
    const dataSourceMap = this._dataSourceMap;
    if (dataSourceMap.has(id)) {
      return dataSourceMap.get(id);
    } else if (this._dataSourceConfigSet.getDataSourceConfig(id)) {
      const dataSource = this._dataSourceFactory
        .getDataSource(this._dataSourceConfigSet.getDataSourceConfig(id));
      dataSourceMap.set(id, dataSource);
      return dataSource;
    }
    return null;
  }

  clear() {

  }
}
