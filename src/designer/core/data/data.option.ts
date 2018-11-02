import { IDataSourceOption } from '../../interface/file/data.source.option';

/**
 * DataOption 不可更改
 */
export class DataOption {

  constructor(private _option: IDataSourceOption) {

  }

  get id() {
    return this._option.id;
  }

  get displayName() {
    return this._option.displayName;
  }

  get configType() {
    return this._option.configType;
  }

  get config() {
    return this._option.config;
  }

  get dimensions() {
    return this._option.dimensions;
  }
}
