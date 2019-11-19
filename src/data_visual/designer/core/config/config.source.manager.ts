import { DesignerConfigSourceFactory } from './designer.config.source.factory';
import { Observable } from 'rxjs';
import {
  Destroyable,
  IConfigSourceFactory,
  DefaultConfigSourceFactory,
  IConfigSourceOptionWrapper,
} from '@data-studio/shared';
import { ConfigSourceComponentRefManager } from './config.source.component.ref.manager';

/**
 *  每个页面对应一个ConfigSourceManager
 */
export class ConfigSourceManager extends Destroyable {
  private _componentRefManager: ConfigSourceComponentRefManager;
  private _configSourceFactory: IConfigSourceFactory;
  private _mockConfigSourceFactory: IConfigSourceFactory;

  constructor() {
    super();
    this._componentRefManager = new ConfigSourceComponentRefManager();
    this._configSourceFactory = new DesignerConfigSourceFactory(this._componentRefManager);
    this._mockConfigSourceFactory = DefaultConfigSourceFactory.getInstance();
    this.onDestroy(() => {
      this._componentRefManager.destroy();
      this._configSourceFactory.destroy();
      this._mockConfigSourceFactory = this._configSourceFactory = this._componentRefManager = null;
    });
  }

  get componentRefManager(): ConfigSourceComponentRefManager {
    return this._componentRefManager;
  }

  getConfigSource(configSourceOption: IConfigSourceOptionWrapper): Observable<any> {
    return this._configSourceFactory.getConfigSource(configSourceOption);
  }

  getMockConfigSource(configSourceOption: IConfigSourceOptionWrapper): Observable<any> {
    return this._mockConfigSourceFactory.getConfigSource(configSourceOption);
  }
}
