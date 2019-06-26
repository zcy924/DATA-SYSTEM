import { GeneratorRepository } from './generator.repository';

/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 * 管理设计时或运行时加载的全部数据源生成器
 *
 * 设计器只能新建该manager中存在的Graphic
 * 运行时只能识别该manager中存在的Graphic
 */
export class GeneratorRepositoryManager {
  private static _manager: GeneratorRepositoryManager;

  private _map: Map<string, GeneratorRepository> = new Map();

  static getInstance() {
    if (!this._manager) {
      this._manager = new GeneratorRepositoryManager();
    }
    return this._manager;
  }

  private constructor() {
  }

  addRepository(repo: GeneratorRepository) {
    if (repo) {
      this._map.set(repo.key, repo);
    }
  }

  removeRepository(repo: GeneratorRepository) {
    if (this._map.has(repo.key)) {
      this._map.delete(repo.key);
    }
  }

  /**
   * 判断是否支持指定的数据源生成器库
   * @param repoKeyArray
   */
  includes(repoKeyArray: Array<string>): boolean {
    const keys = Array.from(this._map.keys());
    return repoKeyArray.every((value) => {
      return keys.includes(value);
    });
  }

  /**
   * 给定路径的数据源生成器是否存在
   * @param path
   */
  has(path: string) {
    const [repoKey, geneKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).has(geneKey);
    } else {
      return false;
    }
  }

  /**
   * 根据路径获得数据源生成器  例如：repo1$mockDataSource
   * repo1  数据源生成器仓库名称
   * mockDataSource 数据源生成器ID
   * @param path
   */
  getGenerator(path: string) {
    const [repoKey, geneKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).getGenerator(geneKey);
    }
  }

  /**
   * 根据ID获得数据源生成器仓库
   * @param key
   */
  getRepository(key: string): GeneratorRepository {
    return this._map.get(key);
  }

  get generatorRepositories(): Array<GeneratorRepository> {
    return Array.from(this._map.values());
  }

  destroy() {
    if (this._map) {
      this._map.clear();
      this._map = null;
    }
  }
}
