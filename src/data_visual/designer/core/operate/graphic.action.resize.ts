import { Region } from '../structure/region/region';
import { IAction } from './action';
import { Destroyable, Rectangle } from '@data-studio/shared';

/**
 * 图表缩放动作
 */
export class GraphicActionResize extends Destroyable implements IAction {

  constructor(private _region: Region, private _origin: Rectangle, private _target: Rectangle) {
    super();
    this.onDestroy(() => {
      this._region = this._origin = this._target = null;
    });
    console.log(this._origin, this._target);
  }

  forward() {
    if (this.usable) {
      this._region.rectangle = this._target;
    }
  }

  backward() {
    if (this.usable) {
      this._region.rectangle = this._origin;
    }
  }
}
