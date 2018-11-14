import { IDataSourceConfig } from '../../file/data.source.config';

/**
 * DataOption 不可更改
 */
export class DataSourceConfig {

  constructor(private _option: IDataSourceConfig) {

  }

  get id() {
    return this._option.id;
  }

  get displayName() {
    return this._option.displayName;
  }

  get repositoryKey() {
    const [key] = this._option.generatorPath.split('$');
    return key;
  }


  get generatorPath() {
    return this._option.generatorPath;
  }

  get generatorParams() {
    return this._option.generatorParams;
  }

  get configType() {
    return this._option.configType;
  }

  get config() {
    return this._option.config;
  }

  get dimensions() {
    return this._option.metaData.dimensions;
  }

  get value(): IDataSourceConfig {
    return this._option;
  }
}
