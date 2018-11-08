import * as _ from 'lodash';

import {DataSourceConfig} from '../../../core/data/data.source.config';
import { IDataSourceConfig } from '../../file/data.source.config';

export class DataSourceConfigSet {

  private _parent: DataSourceConfigSet;
  private _array: Array<DataSourceConfig> = [];

  constructor(dataSourceConfigArray?: IDataSourceConfig | Array<IDataSourceConfig>) {
    if (dataSourceConfigArray) {
      this.load(dataSourceConfigArray);
    }
  }

  set parent(value: DataSourceConfigSet) {
    this._parent = value;
  }

  get dataOptionArray(): Array<DataSourceConfig> {
    if (this._parent) {
      return this._parent.dataOptionArray.concat(this._array);
    } else {
      return this._array.slice(0);
    }
  }

  getDataSourceConfig(id: string): DataSourceConfig {
    return this._array.find((value) => {
      return value.id === id;
    }) || (this._parent ? this._parent.getDataSourceConfig(id) : null);
  }

  load(dataOptionOptionArray: IDataSourceConfig | Array<IDataSourceConfig>) {
    if (_.isArray(dataOptionOptionArray)) {
      dataOptionOptionArray.forEach((value) => {
        this._load(value);
      });
    } else {
      this._load(dataOptionOptionArray);
    }
  }

  private _load(dataOptionOption: IDataSourceConfig) {
    this._array.push(new DataSourceConfig(dataOptionOption));
  }
}
