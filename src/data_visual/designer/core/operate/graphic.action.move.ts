import { Coordinates, Destroyable } from '@data-studio/shared';
import { Region } from '../structure/region/region';
import { IAction } from './action';

/**
 * 图表移动动作
 */
export class GraphicActionMove extends Destroyable implements IAction {

  constructor(private _region: Region, private _origin: Coordinates, private _target: Coordinates) {
    super();
    this.onDestroy(() => {
      this._region = this._origin = this._target = null;
    });
  }

  forward() {
    if (this._region.usable) {
      this._region.coordinates = {
        left: this._target.left, top: this._target.top,
      };
    }
  }

  backward() {
    if (this._region.usable) {
      this._region.coordinates = {
        left: this._origin.left, top: this._origin.top,
      };
    }
  }
}
