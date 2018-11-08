import { IDataSourceConfig } from '../../shared/file/data.source.config';

/**
 * DataOption 不可更改
 */
export class DataOption {

  constructor(private _option: IDataSourceConfig) {

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
