import { Region } from '../structure/region/region';
import { IAction } from './action';
import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { addGraphicToPage } from './action.utils';

/**
 * 图表粘贴动作
 */
export class GraphicActionPaste implements IAction {

  private _region: Region;

  constructor(private _pageInnerFacade: IReportPageInnerFacade, private _componentOption: any, private _x?: number, private  _y?: number) {
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
