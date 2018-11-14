import {IConfigSourceFactory} from './config.source.factory';
import {DesignConfigSourceFactory} from './design/design.config.source.factory';
import {RuntimeConfigSourceFactory} from './runtime/runtime.config.source.factory';
import {Observable} from 'rxjs';

/**
 *  每个页面对应一个ConfigSourceManager
 */
export class ConfigSourceManager {
  private _configSourceFactory: IConfigSourceFactory;
  private _mockConfigSourceFactory: IConfigSourceFactory;

  constructor(modelSourceFactoryType: 'design' | 'runtime') {
    switch (modelSourceFactoryType) {
      case 'design':
        this._configSourceFactory = DesignConfigSourceFactory.getInstance();
        this._mockConfigSourceFactory = RuntimeConfigSourceFactory.getInstance();
        break;
      case 'runtime':
        this._mockConfigSourceFactory = this._configSourceFactory = RuntimeConfigSourceFactory.getInstance();
        break;
    }
  }

  getConfigSource(configSourceOption: any): Observable<any> {
    return this._configSourceFactory.getConfigSource(configSourceOption);
  }

  getMockConfigSource(configSourceOption: any) {
    return this._mockConfigSourceFactory.getConfigSource(configSourceOption);
  }
}
