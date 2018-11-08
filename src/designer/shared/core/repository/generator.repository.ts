import { IGraphic } from '../../../core/node/graphic/graphic';
import { IComponentMeta, IPaletteMeta } from '../../../interface/component.meta';
import { Type } from '../../../interface/type';
import * as _ from 'lodash';
import { IDataSourceGenerator } from '../data/data.source.generator';
import { IDataSourceGeneratorMeta } from '../../../interface/generator.meta';
import { DataSourceFactory } from '@shared/core/data/data.source.factory';


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

  getGenerator(key: string): IDataSourceGenerator {
    if (this._map.has(key)) {
      const meta = this._map.get(key);
      return meta.generator || (meta.generator = new meta.generatorDef());
    }
  }

  getGeneratorDef(key: string): Type<IDataSourceGenerator> {
    return this._map.get(key).generatorDef;
  }
}
