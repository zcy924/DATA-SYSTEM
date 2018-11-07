import * as _ from 'lodash';

import {DataOption} from '@core/data/data.option';
import { IDataSourceOption } from '../../interface/file/data.source.option';

export class DataSourceConfigSet {

  private _parent: DataSourceConfigSet;
  private _array: Array<DataOption> = [];

  constructor(dataOptionOptionArray?: IDataSourceOption | Array<IDataSourceOption>) {
    if (dataOptionOptionArray) {
      this.load(dataOptionOptionArray);
    }
  }

  set parent(value: DataSourceConfigSet) {
    this._parent = value;
  }

  get dataOptionArray(): Array<DataOption> {
    if (this._parent) {
      return this._parent.dataOptionArray.concat(this._array);
    } else {
      return this._array.slice(0);
    }
  }

  getDataSourceConfig(id: string): DataOption {
    return this._array.find((value) => {
      return value.id === id;
    }) || (this._parent ? this._parent.getDataSourceConfig(id) : null);
  }

  load(dataOptionOptionArray: IDataSourceOption | Array<IDataSourceOption>) {
    if (_.isArray(dataOptionOptionArray)) {
      dataOptionOptionArray.forEach((value) => {
        this._load(value);
      });
    } else {
      this._load(dataOptionOptionArray);
    }
  }

  private _load(dataOptionOption: IDataSourceOption) {
    this._array.push(new DataOption(dataOptionOption));
  }
}
