import { IGraphic } from '@core/node/graphic/graphic';
import { ImageGraphic } from '@core/node/graphic/auxiliary/image.graphic';
import { Type } from './type';
import { PaletteItem } from './palette.item';

export class ComponentRepository {
  private _map: Map<string, IGraphic> = new Map<string, IGraphic>();

  constructor(private _name: string) {

  }

  get name(): string {
    return this._name;
  }

  addComponent(key: string) {
  }

  addComponents() {
  }

  getComponents(): Array<PaletteItem> {
    return null;
  }

  getGraphic(key: string): Type<IGraphic> {
    return ImageGraphic;
  }
}
