import {IConfigSourceFactory} from '../../../shared/core/config/config.source.factory';
import {DesignConfigSourceFactory} from './design/design.config.source.factory';
import {RuntimeConfigSourceFactory} from '../../../shared/core/config/runtime/runtime.config.source.factory';
import {Observable} from 'rxjs';

/**
 *  每个页面对应一个ConfigSourceManager
 */
export class ConfigSourceManager {
  private _configSourceFactory: IConfigSourceFactory;
  private _mockConfigSourceFactory: IConfigSourceFactory;

  constructor() {
    this._configSourceFactory = DesignConfigSourceFactory.getInstance();
    this._mockConfigSourceFactory = RuntimeConfigSourceFactory.getInstance();
  }

  getConfigSource(configSourceOption: any): Observable<any> {
    return this._configSourceFactory.getConfigSource(configSourceOption);
  }

  getMockConfigSource(configSourceOption: any) {
    return this._mockConfigSourceFactory.getConfigSource(configSourceOption);
  }
}
