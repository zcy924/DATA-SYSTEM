import { Type } from '../../interface/type';
import { IGraphic } from '../core/graphic/graphic';
import { ComponentRepository } from '../core/repository/component.repository';

/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 * 管理设计器或运行时加载的全部组件库
 *
 * 设计器只能新建该manager中存在的Graphic
 * 运行时只能识别该manager中存在的Graphic
 */
export class ComponentRepositoryManager {
  private static _manager: ComponentRepositoryManager;

  private _map: Map<string, ComponentRepository> = new Map();

  static getInstance() {
    if (!this._manager) {
      this._manager = new ComponentRepositoryManager();
    }
    return this._manager;
  }

  private constructor() {
  }

  addComponentRepository(compRepo: ComponentRepository) {
    if (compRepo) {
      this._map.set(compRepo.name, compRepo);
    }
  }

  includes(array: Array<string>): boolean {
    const keys = Array.from(this._map.keys());
    return array.every((value) => {
      return keys.includes(value);
    });
  }

  removeComponentRepository(compRepo: ComponentRepository) {
    if (this._map.has(compRepo.name)) {
      this._map.delete(compRepo.name);
    }
  }

  getComponentRepository(key: string) {
    return this._map.get(key);
  }

  get componentRepositories(): Array<ComponentRepository> {
    return Array.from(this._map.values());
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
    if (this._map) {
      this._map.clear();
      this._map = null;
    }
  }
}
