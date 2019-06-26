import { IConfigSourceFactory } from '../../../shared/core/config/config.source.factory';
import { DesignerConfigSourceFactory } from './designer.config.source.factory';
import { RuntimeConfigSourceFactory } from '../../../runtime/config/runtime.config.source.factory';
import { Observable } from 'rxjs';

/**
 *  每个页面对应一个ConfigSourceManager
 */
export class ConfigSourceManager {
  private _configSourceFactory: IConfigSourceFactory;
  private _mockConfigSourceFactory: IConfigSourceFactory;

  constructor() {
    this._configSourceFactory = DesignerConfigSourceFactory.getInstance();
    this._mockConfigSourceFactory = RuntimeConfigSourceFactory.getInstance();
  }

  getConfigSource(configSourceOption: any): Observable<any> {
    return this._configSourceFactory.getConfigSource(configSourceOption);
  }

  getMockConfigSource(configSourceOption: any): Observable<any> {
    return this._mockConfigSourceFactory.getConfigSource(configSourceOption);
  }
}
