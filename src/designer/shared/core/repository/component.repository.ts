import { IGraphic } from '../graphic/graphic';
import { IComponentMeta, IPaletteMeta } from '../../../interface/component.meta';
import { Type } from '../../../interface/type';
import * as _ from 'lodash';


/**
 *  组件库
 *  注册组件
 *  根据组件库key，获取组件定义
 *  获取该组件库所有组件的wrapper
 *
 *  组件库是不可修改对象  所以
 */
export class ComponentRepository {
  private _map: Map<string, ComponentMeta> = new Map<string, ComponentMeta>();

  constructor(private _key: string, private _name: string) {

  }

  get key(): string {
    return this._key;
  }

  get name(): string {
    return this._name;
  }

  has(key: string): boolean {
    return this._map.has(key);
  }

  register(compMeta: IComponentMeta) {
    if (compMeta) {
      this._map.set(compMeta.key, new ComponentMeta(compMeta));
    }
  }

  batchRegister(compMetaArray: Array<IComponentMeta>) {
    if (_.isArray(compMetaArray)) {
      compMetaArray.forEach((value) => {
        this.register(value);
      });
    }
  }

  getComponents(convert: Function): Array<IPaletteMeta> {
    return Array.from(this._map.values(), (v) => {
      return convert(v);
    });
  }

  get paletteConfig() {
    return {
      key: this._key,
      name: this._name,
      children: _.compact(Array.from(this._map.values()).map(value => value.paletteMeta)),
    };
  }

  getComponentMeta(key: string): ComponentMeta {
    return this._map.get(key);
  }

  getGrabOption(key: string) {
    return this._map.get(key).grabOption;
  }

  getComponentOption(key: string) {
    return this._map.get(key).componentOption;
  }

  getGraphicDef(key: string): Type<IGraphic> {
    return this._map.get(key).graphicDef;
  }
}

export class ComponentMeta {
  constructor(private _meta: IComponentMeta) {

  }

  get paletteMeta() {
    const paletteMeta = this._meta.paletteMeta;
    if (paletteMeta && paletteMeta.show) {
      const { displayName, imageClass, grabOption } = paletteMeta;
      return {
        key: this._meta.key,
        displayName, imageClass, grabOption,
      };
    } else {
      return null;
    }
  }

  get grabOption() {
    return this._meta.paletteMeta ? this._meta.paletteMeta.grabOption : null;
  }

  get componentOption() {
    return this._meta.componentOption;
  }

  get graphicDef() {
    return this._meta.graphicDef;
  }
}
