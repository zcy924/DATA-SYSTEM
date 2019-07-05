import { DesignerConfigSourceFactory } from './designer.config.source.factory';
import { Observable } from 'rxjs';
import { IConfigSourceFactory } from '@data-studio/shared';
import { RuntimeConfigSourceFactory } from '@data-studio/runtime/lib/config/runtime.config.source.factory';

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
