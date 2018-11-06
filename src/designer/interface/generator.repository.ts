import { IGraphic } from '@core/node/graphic/graphic';
import { IComponentMeta, IPaletteMeta } from './component.meta';
import { Type } from './type';
import * as _ from 'lodash';
import { IDataSourceGenerator } from './data.source.generator';
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

  constructor(private _name: string) {

  }

  get name(): string {
    return this._name;
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

  getGeneratorDef(key: string): Type<IGraphic> {
    return this._map.get(key).generatorDef;
  }
}
