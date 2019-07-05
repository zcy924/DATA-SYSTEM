import { Region } from '../structure/region/region';
import { IAction } from './action';
import { Rectangle } from '@data-studio/shared';

/**
 * 图表缩放动作
 */
export class GraphicActionResize implements IAction {

  constructor(private _region: Region, private _origin: Rectangle, private _target: Rectangle) {
    console.log(this._origin, this._target);
  }

  forward() {
    if (!this._region.destroyed) {
      this._region.rectangle = this._target;
    }
  }

  backward() {
    if (!this._region.destroyed) {
      this._region.rectangle = this._origin;
    }
  }
}
