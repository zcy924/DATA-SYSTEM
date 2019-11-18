import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, Destroyable, GraphicOption, IConfigSourceOptionWrapper } from '@data-studio/shared';
import { ModelSource } from './model.source';
import { dataSourceConfigSetManager } from '../../data/data.source.config.set.manager';

/**
 * 模型源工厂   模型=配置+数据
 */
export class ModelSourceManager extends Destroyable {

  private _configSourceManager: ConfigSourceManager;
  private _dataSourceManager: DataSourceManager;

  init() {
    this._configSourceManager = new ConfigSourceManager();
    this._dataSourceManager = new DataSourceManager(dataSourceConfigSetManager.getItem('space1'));
    this.onDestroy(() => {
      if (this._configSourceManager) {
        this._configSourceManager.destroy();
        this._configSourceManager = null;
      }

      this._dataSourceManager = null;
    });
  }

  get componentRefManager() {
    return this._configSourceManager.componentRefManager;
  }

  get configSourceManager() {
    return this._configSourceManager;
  }

  get dataSourceManager() {
    return this._dataSourceManager;
  }

  getModelSource(graphicOption: GraphicOption): ModelSource {
    const modelSource = new ModelSource(this._configSourceManager, this._dataSourceManager);
    modelSource.init(graphicOption);
    return modelSource;
  }
}

interface IModelOption {
  configSourceOption: IConfigSourceOptionWrapper;
  dataSourceConfigID: string;
}
