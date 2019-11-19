import { Destroyable } from '@data-studio/shared';
import { Region } from '../structure/region/region';
import { IAction } from './action';
import { IReportPageInner } from '../structure/page/report/page.interface';
import { addGraphicToPage } from './action.utils';

/**
 * 图表粘贴动作
 */
export class GraphicActionPaste extends Destroyable implements IAction {

  private _region: Region;

  constructor(private _pageInnerFacade: IReportPageInner, private _componentOption: any, private _x?: number, private  _y?: number) {
    super();
    this.onDestroy(() => {
      this._pageInnerFacade = this._componentOption = null;
    });
  }

  forward() {
    const { region } = addGraphicToPage(this._pageInnerFacade, this._componentOption, this._x, this._y);
    this._region = region;
  }

  backward() {
    if (this._region) {
      this._region.destroy();
      this._region = null;
    }
  }
}
