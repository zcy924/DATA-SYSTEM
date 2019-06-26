import * as _ from 'lodash';
import { Type } from '../common/type';
import { IDataSourceGenerator } from './generator';
import { IDataSourceGeneratorMeta } from './generator.meta';


/**
 *  组件库
 *  注册组件
 *  根据组件库key，获取组件定义
 *  获取该组件库所有组件的wrapper
 *
 *  组件库是不可修改对象  所以
 */
export class GeneratorRepository {

  private _map: Map<string, IDataSourceGeneratorMeta> = new Map<string, IDataSourceGeneratorMeta>();

  constructor(private _key: string, private _name: string) {

  }

  get key(): string {
    return this._key;
  }

  get name(): string {
    return this._name;
  }

  has(key: string) {
    return this._map.has(key);
  }

  register(geneMeta: IDataSourceGeneratorMeta) {
    if (geneMeta) {
      this._map.set(geneMeta.key, geneMeta);
    }
  }

  batchRegister(geneMetaArray: Array<any>) {
    if (_.isArray(geneMetaArray)) {
      geneMetaArray.forEach((value) => {
        this.register(value);
      });
    }
  }

  /**
   * 获得数据源生成器实例
   * @param key
   */
  getGenerator(key: string): IDataSourceGenerator {
    if (this._map.has(key)) {
      const meta = this._map.get(key);
      return meta.generator || (meta.generator = new meta.generatorDef());
    }
  }

  /**
   * 获得数据源生成器类
   * @param key
   */
  getGeneratorDef(key: string): Type<IDataSourceGenerator> {
    if (this._map.has(key)) {
      return this._map.get(key).generatorDef;
    }
  }
}
