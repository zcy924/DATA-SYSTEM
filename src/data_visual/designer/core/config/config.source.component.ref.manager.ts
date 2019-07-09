import {ComponentRef} from '@angular/core';
import { session } from '../../utils/session';
import { BaseConfigSourceComponent } from '@data-studio/shared';

/**
 * 缓存应用中创建的GraphConfigComponent
 * note：
 * 缓存的是设计时配置源
 */
export class ConfigSourceComponentRefManager {
  private static _componentRefManager: ConfigSourceComponentRefManager;
  private _map = new Map();

  static getInstance() {
    return this._componentRefManager = this._componentRefManager || new ConfigSourceComponentRefManager();
  }

  private constructor() {
  }

  has(id: string) {
    return this._map.has(id);
  }

  add(id: string, graphicConfig: ComponentRef<BaseConfigSourceComponent>) {
    this._map.set(id, graphicConfig);
  }

  remove(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      componentRef.destroy();
      this._map.delete(id);
    }
  }

  activate(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      session.siderLeftComponent.attachDataProperty(componentRef.hostView);
    }
  }

}
