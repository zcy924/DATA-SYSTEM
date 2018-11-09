import { Type } from '../../interface/type';
import { IGraphic } from '../core/graphic/graphic';
import { ComponentRepository } from '../core/repository/component.repository';
import { StandardCompRepo } from '../../component.packages/standard';

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
      this._manager.addComponentRepository(StandardCompRepo);
    }
    return this._manager;
  }

  private constructor() {
  }

  addComponentRepository(compRepo: ComponentRepository) {
    if (compRepo) {
      this._map.set(compRepo.key, compRepo);
    }
  }

  has(path: string) {
    const [repoKey, graphicKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).has(graphicKey);
    } else {
      return false;
    }
  }

  includes(array: Array<string>): boolean {
    const keys = Array.from(this._map.keys());
    return array.every((value) => {
      return keys.includes(value);
    });
  }

  removeComponentRepository(compRepo: ComponentRepository) {
    if (this._map.has(compRepo.key)) {
      this._map.delete(compRepo.key);
    }
  }

  getComponentRepository(key: string) {
    return this._map.get(key);
  }

  get componentRepositories(): Array<ComponentRepository> {
    return Array.from(this._map.values());
  }

  getComponentMetaByPath(path: string) {
    const [repoKey, graphicKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).getComponentMeta(graphicKey);
    } else {
      return null;
    }
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

  getComponentOptionByPath(path: string) {
    const [repoKey, graphicKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).getComponentOption(graphicKey);
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
