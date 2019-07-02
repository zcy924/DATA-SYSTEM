import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, Destroyable, IConfigSourceOption } from '@barca/shared';
import { ModelSource } from './model.source';
import { dataSourceConfigSetManager } from '../../data/data.source.config.set.manager';

export class ModelSourceFactory extends Destroyable {

  private _configSourceManager: ConfigSourceManager;
  private _dataSourceManager: DataSourceManager;

  constructor() {
    super();
    this._configSourceManager = new ConfigSourceManager();
    this._dataSourceManager = new DataSourceManager(dataSourceConfigSetManager.getItem('space1'));
    this.onDestroy(() => {
      this._configSourceManager = null;
      this._dataSourceManager = null;
    });
  }

  getModelSource(modelOption: IModelOption): ModelSource {
    const ret = new ModelSource(this._configSourceManager, this._dataSourceManager);
    // ret.init(modelOption.configSourceOption, modelOption.dataSourceKey);
    return ret;

  }
}

interface IModelOption {
  configSourceOption: IConfigSourceOption;
  dataSourceKey: any;
}
