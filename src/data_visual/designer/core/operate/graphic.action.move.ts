import { Region } from '../structure/region/region';
import { IAction } from './action';
import { Coordinates } from '@data-studio/shared';

/**
 * 图表移动动作
 */
export class GraphicActionMove implements IAction {

  constructor(private _region: Region, private _origin: Coordinates, private _target: Coordinates) {
  }

  forward() {
    if (!this._region.destroyed) {
      this._region.coordinates = {
        left: this._target.left, top: this._target.top,
      };
    }
  }

  backward() {
    if (!this._region.destroyed) {
      this._region.coordinates = {
        left: this._origin.left, top: this._origin.top,
      };
    }
  }
}
