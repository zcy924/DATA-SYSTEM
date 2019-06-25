import {ComponentRef} from '@angular/core';

import { session } from '../../../utils/session';
import { DesignGraphicConfig } from '../../../../shared/core/source/config.source/design.config.source';

/**
 * 缓存应用中创建的GraphConfigComponent
 * note：
 * 缓存的是设计时配置源
 */
export class GraphicConfigManager {
  private static _graphicConfigManager: GraphicConfigManager;
  private _map = new Map();

  static getInstance() {
    return this._graphicConfigManager = this._graphicConfigManager || new GraphicConfigManager();
  }

  private constructor() {
  }

  has(id: string) {
    return this._map.has(id);
  }

  add(id: string, graphicConfig: ComponentRef<DesignGraphicConfig>) {
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
