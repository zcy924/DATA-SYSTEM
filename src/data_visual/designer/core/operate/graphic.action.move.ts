import { Region } from '../structure/region/region';
import { IAction } from './action';
import { Coordinates } from '@barca/shared';

/**
 * 图表移动动作
 */
export class GraphicActionMove implements IAction {

  constructor(private _region: Region, private _origin: Coordinates, private _target: Coordinates) {
  }

  forward() {
    if (!this._region.destroyed) {
      this._region.setCoordinates(this._target.left, this._target.top);
    }
  }

  backward() {
    if (!this._region.destroyed) {
      this._region.setCoordinates(this._origin.left, this._origin.top);
    }
  }
}
