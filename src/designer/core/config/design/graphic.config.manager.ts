import {ComponentRef} from '@angular/core';

import { session } from '../../../designer/utils/session';
import { DesignGraphicConfig } from '@shared/core/source/config.source/design.config.source';

export class GraphicConfigManager {
  private static _graphicConfigManager: GraphicConfigManager;
  private _map = new Map();

  static getInstance() {
    return this._graphicConfigManager = this._graphicConfigManager || new GraphicConfigManager();
  }

  private constructor() {
  }

  add(id: string, graphicConfig: ComponentRef<DesignGraphicConfig>) {
    this._map.set(id, graphicConfig);
  }

  has(id: string) {
    return this._map.has(id);
  }

  activate(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      session.siderLeftComponent.attachDataProperty(componentRef.hostView);
    }
  }

  remove(id: string) {
    if (this._map.has(id)) {
      const componentRef = this._map.get(id);
      componentRef.destroy();
      this._map.delete(id);
    }
  }
}
