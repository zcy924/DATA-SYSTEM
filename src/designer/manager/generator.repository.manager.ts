import { GeneratorRepository } from '../interface/generator.repository';

/**
 * 设计时和运行时都会使用到ComponentRepositoryManager
 * 管理设计器或运行时加载的全部组件库
 *
 * 设计器只能新建该manager中存在的Graphic
 * 运行时只能识别该manager中存在的Graphic
 */
export class GeneratorRepositoryManager {
  private _map: Map<string, GeneratorRepository> = new Map();

  addGeneratorRepository(geneRepo: GeneratorRepository) {
    if (geneRepo) {
      this._map.set(geneRepo.name, geneRepo);
    }
  }

  includes(array: Array<string>): boolean {
    const keys = Array.from(this._map.keys());
    return array.every((value) => {
      return keys.includes(value);
    });
  }

  removeGeneratorRepository(geneRepo: GeneratorRepository) {
    if (this._map.has(geneRepo.name)) {
      this._map.delete(geneRepo.name);
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
