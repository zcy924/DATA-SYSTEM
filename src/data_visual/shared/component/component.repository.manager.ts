import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { delay } from 'rxjs/operators';
import { Type } from '../common/type';
import { IGraphic } from '../core/graphic/graphic';
import { ComponentRepository } from './component.repository';
import { Destroyable } from '../common';

/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 * 管理设计器或运行时加载的全部组件库
 *
 * 设计器只能新建该manager中存在的Graphic
 * 运行时只能识别该manager中存在的Graphic
 */
export class ComponentRepositoryManager extends Destroyable {
  private static _manager: ComponentRepositoryManager;

  private _map: Map<string, ComponentRepository> = new Map();
  private _paletteConfig$ = new BehaviorSubject(null);

  static getInstance() {
    if (!this._manager) {
      this._manager = new ComponentRepositoryManager();
    }
    return this._manager;
  }

  private constructor() {
    super();
    this.onDestroy(() => {
      if (this._map) {
        this._map.clear();
        this._map = null;
      }
    });
  }

  addComponentRepository(compRepo: ComponentRepository) {
    if (compRepo) {
      this._map.set(compRepo.key, compRepo);
      this._updatePaletteConfig();
    }
  }

  removeComponentRepository(compRepo: ComponentRepository) {
    if (compRepo && this._map.has(compRepo.key)) {
      this._map.delete(compRepo.key);
    }
  }

  getComponentRepository(key: string) {
    return this._map.get(key);
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
    // array.every: This method returns true for any condition put on an empty array.
    return array.every((value) => {
      return keys.includes(value);
    });
  }

  get componentRepositories(): Array<ComponentRepository> {
    return Array.from(this._map.values());
  }

  get paletteConfig$() {
    return this._paletteConfig$.asObservable().pipe(delay(100));
  }

  /**
   * 根据路径信息获取组件元数据
   * @param {string} path
   * @returns {any}
   */
  getComponentMeta(path: string) {
    if (path) {
      const [repoKey, graphicKey] = path.split('$');
      if (this._map.has(repoKey)) {
        return this._map.get(repoKey).getComponentMeta(graphicKey);
      } else {
        return null;
      }
    }
  }

  getGraphicDef(path: string): Type<IGraphic> {
    if (path) {
      const [repoKey, graphicKey] = path.split('$');
      if (this._map.has(repoKey)) {
        return this._map.get(repoKey).getComponentMeta(graphicKey).graphicDef;
      } else {
        return null;
      }
    }
  }

  private _updatePaletteConfig() {
    this._paletteConfig$.next(Array.from(this._map.values()).map(value => {
      return value.paletteConfig;
    }));

  }
}

export const componentRepositoryManager = ComponentRepositoryManager.getInstance();
