/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 *
 */
import { Type } from '../interface/type';
import { IGraphic } from '@core/node/graphic/graphic';
import { ComponentRepository } from '../interface/component.repository';

export class ComponentRepositoryManager {
  private _map: Map<string, ComponentRepository> = new Map();

  addCompRepo() {

  }

  /**
   * 根据图表路径获取
   *
   * standard$echart.bar
   */
  getGraphicDefByPath(path: string): Type<IGraphic> {
    const [repoKey, graphicKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).getGraphicDef(graphicKey);
    } else {
      return null;
    }
  }

  destroy() {
    this._map.forEach((value) => {

    });
    this._map.clear();
    this._map = null;
  }
}
