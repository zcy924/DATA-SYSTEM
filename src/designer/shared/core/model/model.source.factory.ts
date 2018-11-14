import {IConfigSourceFactory} from '../../../designer/core/config/config.source.factory';
import {DesignConfigSourceFactory} from '../../../designer/core/config/design/design.config.source.factory';
import {RuntimeConfigSourceFactory} from '../../../designer/core/config/runtime/runtime.config.source.factory';
import {combineLatest, Observable} from 'rxjs';
import {IConfigSourceOption} from '../../../designer/core/config/config.source.interface';
import { DataSourceFactory } from '../data/data.source.factory';

export class ModelSourceFactory {
  private static _modelSourceFactoryForDesign: ModelSourceFactory;
  private static _modelSourceFactoryForRuntime: ModelSourceFactory;

  private _configSourceFactory: IConfigSourceFactory;

  static getInstance(modelSourceFactoryType: 'design' | 'runtime'): ModelSourceFactory {
    let modelSourceFactory: ModelSourceFactory;
    switch (modelSourceFactoryType) {
      case 'design':
        if (!this._modelSourceFactoryForDesign) {
          this._modelSourceFactoryForDesign = new ModelSourceFactory(modelSourceFactoryType);
        }
        modelSourceFactory = this._modelSourceFactoryForDesign;
        break;
      case 'runtime':
        if (!this._modelSourceFactoryForRuntime) {
          this._modelSourceFactoryForRuntime = new ModelSourceFactory(modelSourceFactoryType);
        }
        modelSourceFactory = this._modelSourceFactoryForRuntime;
        break;
    }
    return modelSourceFactory;
  }

  constructor(modelSourceFactoryType: 'design' | 'runtime') {
    switch (modelSourceFactoryType) {
      case 'design':
        this._configSourceFactory = DesignConfigSourceFactory.getInstance();
        break;
      case 'runtime':
        this._configSourceFactory = RuntimeConfigSourceFactory.getInstance();
        break;
    }
  }

  getModelSource(modelOption: ModelOption): Observable<Array<any>> {

    const configSource = this._configSourceFactory.getConfigSource(modelOption.configOption),
      dataSource = DataSourceFactory.getInstance().getDataSource(modelOption.dataOption);

    return combineLatest(configSource, dataSource);

  }
}

interface ModelOption {
  configOption: IConfigSourceOption;
  dataOption: any;
}
