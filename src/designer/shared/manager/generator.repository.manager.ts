import { GeneratorRepository } from '../core/repository/generator.repository';

/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 * 管理设计器或运行时加载的全部组件库
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

  addGeneratorRepository(geneRepo: GeneratorRepository) {
    if (geneRepo) {
      this._map.set(geneRepo.key, geneRepo);
    }
  }

  includes(array: Array<string>): boolean {
    const keys = Array.from(this._map.keys());
    return array.every((value) => {
      return keys.includes(value);
    });
  }

  removeGeneratorRepository(geneRepo: GeneratorRepository) {
    if (this._map.has(geneRepo.key)) {
      this._map.delete(geneRepo.key);
    }
  }

  getDataSourceGenerator(path: string) {
    const [repoKey, geneKey] = path.split('$');
    if (this._map.has(repoKey)) {
      return this._map.get(repoKey).getGeneratorDef(geneKey);
    }
  }

  getGeneratorRepository(key: string) {
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
