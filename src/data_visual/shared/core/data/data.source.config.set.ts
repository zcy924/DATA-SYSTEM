import * as _ from 'lodash';

import { DataSourceConfig } from './data.source.config';
import { IDataSourceConfig } from '../../interface/file/data.source.config';
import { Destroyable } from '../../common';

export class DataSourceConfigSet extends Destroyable {

  private _parent: DataSourceConfigSet;
  private _array: Array<DataSourceConfig> = [];

  constructor(dataSourceConfigArray?: IDataSourceConfig | Array<IDataSourceConfig>) {
    super();
    this.load(dataSourceConfigArray);
    this.onDestroy(() => {
      this._array.splice(0);
      this._array = null;

      this._parent = null;
    });
  }

  set parent(value: DataSourceConfigSet) {
    this._parent = value;
  }

  /**
   *
   */
  get values(): Array<DataSourceConfig> {
    if (this._parent) {
      return this._parent.values.concat(this._array);
    } else {
      return this._array.slice(0);
    }
  }

  has(id: string): boolean {
    return (this._array.findIndex((dataSourceConfig: DataSourceConfig) => {
      return dataSourceConfig.id === id;
    }) >= 0) || (this._parent ? this._parent.has(id) : false);
  }

  getDataSourceConfig(id: string): DataSourceConfig {
    return this._array.find((value) => {
      return value.id === id;
    }) || (this._parent ? this._parent.getDataSourceConfig(id) : null);
  }

  load(array: IDataSourceConfig | Array<IDataSourceConfig>) {
    if (_.isArray(array)) {
      array.forEach((value) => {
        this._load(value);
      });
    } else if (_.isObjectLike(array)) {
      this._load(array);
    }
  }

  private _load(dataSourceConfigOption: IDataSourceConfig) {
    this._array.push(new DataSourceConfig(dataSourceConfigOption));
  }
}
