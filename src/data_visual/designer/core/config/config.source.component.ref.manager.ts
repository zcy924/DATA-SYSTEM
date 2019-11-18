import { ComponentRef } from '@angular/core';
import { session } from '../../utils/session';
import { BaseConfigSourceComponent, Destroyable } from '@data-studio/shared';

/**
 * 缓存应用中创建的GraphConfigComponent
 * note：
 * 缓存的是设计时配置源
 */
export class ConfigSourceComponentRefManager extends Destroyable {
  private _map: Map<string, ComponentRef<BaseConfigSourceComponent>> = new Map();

  constructor() {
    super();
    this.onDestroy(() => {
      this._map.forEach((value => value.destroy()));
      this._map.clear();
      this._map = null;
    });
  }

  has(id: string) {
    return this._map.has(id);
  }

  add(id: string, componentRef: ComponentRef<BaseConfigSourceComponent>) {
    this._map.set(id, componentRef);
  }

  /**
   * 删除angular组件实例
   * @param id
   */
  remove(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      componentRef.destroy();
      this._map.delete(id);
    }
  }

  /**
   * 激活angular组件实例
   * @param id
   */
  activate(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      session.attachConfigViewRef(componentRef.hostView);
    }
  }

}
