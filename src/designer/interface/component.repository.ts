import { IGraphic } from '@core/node/graphic/graphic';
import { ImageGraphic } from '@core/node/graphic/auxiliary/image.graphic';
import { Type } from './type';
import { IPaletteItemMeta } from './palette.item.meta';
import * as _ from 'lodash';

/**
 *  组件库
 *  注册组件
 *  根据组件库key，获取组件定义
 *  获取该组件库所有组件的wrapper
 */
export class ComponentRepository {
  private _map: Map<string, Type<IGraphic>> = new Map<string, Type<IGraphic>>();

  constructor(private _name: string) {

  }

  get name(): string {
    return this._name;
  }

  register(compMeta: any) {
  }

  batchRegister(compMetaArray: Array<any>) {
    if (_.isArray(compMetaArray)) {
      compMetaArray.forEach((value) => {
        this.register(value);
      });
    }
  }

  getComponents(callback: Function): Array<IPaletteItemMeta> {
    return null;
  }

  getGraphic(key: string): Type<IGraphic> {
    return ImageGraphic;
  }
}
