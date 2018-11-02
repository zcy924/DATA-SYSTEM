import { IGraphic } from '@core/node/graphic/graphic';
import { Type } from '@angular/core';

export class ComponentRepository {
  private _map: Map<string, IGraphic> = new Map<string, IGraphic>();

  constructor(private _name: string) {

  }

  get name(): string {
    return this._name;
  }

  addComponent(key:string,value:Type<IGraphic>) {
  }

  addComponents() {
  }
}
