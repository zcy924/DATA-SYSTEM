import {IConfigSourceFactory} from '../../../shared/core/config/config.source.factory';
import {DesignConfigSourceFactory} from '../config/design/design.config.source.factory';
import {RuntimeConfigSourceFactory} from '../../../runtime/config/runtime.config.source.factory';
import {combineLatest, Observable} from 'rxjs';
import {IConfigSourceOption} from '../config/config.source.interface';
import { DataSourceFactory } from '../../../shared/core/data/data.source.factory';

export class ModelSourceFactory {
  private static _modelSourceFactoryForDesign: ModelSourceFactory;
  private static _modelSourceFactoryForRuntime: ModelSourceFactory;

  private _configSourceFactory: IConfigSourceFactory;

  static getInstance(mode: 'design' | 'runtime'): ModelSourceFactory {
    let modelSourceFactory: ModelSourceFactory;
    switch (mode) {
      case 'design':
        if (!this._modelSourceFactoryForDesign) {
          this._modelSourceFactoryForDesign = new ModelSourceFactory(mode);
        }
        modelSourceFactory = this._modelSourceFactoryForDesign;
        break;
      case 'runtime':
        if (!this._modelSourceFactoryForRuntime) {
          this._modelSourceFactoryForRuntime = new ModelSourceFactory(mode);
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
